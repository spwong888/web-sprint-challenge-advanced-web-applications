import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setMessage(data.message);
      setSpinnerOn(false);
      redirectToArticles();
    } catch (error) {
      setMessage('Login failed');
      setSpinnerOn(false);
    }
  };

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await fetch(articlesUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized, redirect to login
          setMessage('Unauthorized. Please log in.');
          redirectToLogin();
        } else {
          throw new Error('Failed to fetch articles');
        }
      }

      const data = await response.json();
      setArticles(data);
      setMessage('Articles loaded successfully');
      setSpinnerOn(false);
    } catch (error) {
      setMessage('Failed to fetch articles');
      setSpinnerOn(false);
    }
  };

  const postArticle = async (article) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await fetch(articlesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      const data = await response.json();
      setArticles([...articles, data]);
      setMessage('Article created successfully');
      setSpinnerOn(false);
    } catch (error) {
      setMessage('Failed to create article');
      setSpinnerOn(false);
    }
  };

  const updateArticle = async ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      const updatedArticle = await response.json();
      setArticles((prevArticles) =>
        prevArticles.map((art) =>
          art.article_id === updatedArticle.article_id ? updatedArticle : art
        )
      );
      setMessage('Article updated successfully');
      setSpinnerOn(false);
      setCurrentArticleId(null); // Reset current article ID after updating
    } catch (error) {
      setMessage('Failed to update article');
      setSpinnerOn(false);
    }
  };

  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      setArticles((prevArticles) =>
        prevArticles.filter((art) => art.article_id !== article_id)
      );
      setMessage('Article deleted successfully');
      setSpinnerOn(false);
    } catch (error) {
      setMessage('Failed to delete article');
      setSpinnerOn(false);
    }
  };

  return (
    <>
      <Spinner spinnerOn={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? '0.25' : '1' }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticle={currentArticleId && articles.find((art) => art.article_id === currentArticleId)}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
