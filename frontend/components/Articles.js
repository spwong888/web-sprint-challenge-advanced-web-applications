import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PT from 'prop-types';

export default function Articles({
  articles,
  getArticles,
  deleteArticle,
  setCurrentArticleId,
  currentArticleId,
}) {
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <div className="articles">
      <h2>Articles</h2>
      {articles.length === 0 ? (
        'No articles yet'
      ) : (
        articles.map((art) => (
          <div className="article" key={art.article_id}>
            <div>
              <h3>{art.title}</h3>
              <p>{art.text}</p>
              <p>Topic: {art.topic}</p>
            </div>
            <div>
              <button
                disabled={currentArticleId !== null} // Disable if there's an ongoing edit
                onClick={() => setCurrentArticleId(art.article_id)}
              >
                Edit
              </button>
              <button
                disabled={currentArticleId !== null} // Disable if there's an ongoing edit
                onClick={() => deleteArticle(art.article_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
