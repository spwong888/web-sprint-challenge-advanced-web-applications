import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [currentArticle, setCurrentArticle] = useState()

  useEffect(() => {
    setCurrentArticle(articles.find(art => art.article_id === currentArticleId))
  }, [currentArticleId])

  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/')
  const redirectToArticles = () => navigate('/articles')

  const resetArticles = () => {
    axiosWithAuth().get('/articles')
      .then(res => setArticles(res.data.articles))
  }
  const logout = () => {
    localStorage.removeItem('token');
    setMessage("Goodbye!");
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    axios.post(loginUrl, { username: username.trim(), password: password.trim() }).then(res => {
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message);
      setSpinnerOn(false);
      redirectToArticles()
    }).catch(err => console.log(err))
  }

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
      .get('/articles')
      .then(res => {
        setArticles(res.data.articles)
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        if (err.status === 401) {
          redirectToLogin()
        }
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    axiosWithAuth().post('/articles', { title: article.title.trim(), text: article.text.trim(), topic: article.topic })
      .then(res => {
        console.log(res.data)
        setMessage(res.data.message)
        resetArticles()
      })
      .catch(err => console.log(err))
  }

  const updateArticle = ({ article_id, article }) => {
    axiosWithAuth().put(`/articles/${article_id}`, { title: article.title.trim(), text: article.text.trim(), topic: article.topic })
      .then(res => {
        setMessage(res.data.message)
        resetArticles()
      })
      .catch(err => console.log(err));
  }

  const deleteArticle = article_id => {
    axiosWithAuth().delete(`/articles/${article_id}`)
      .then(res => {
        setMessage(res.data.message)
        resetArticles()
      })
      .catch(err => console.log(err));
  }

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
                currentArticle={currentArticle}
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
              />
              <Articles
                articles={articles}
                getArticles={getArticles}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
                deleteArticle={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
