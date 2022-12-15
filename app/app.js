const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
} = require('../app/controllers/app.controllers');
const {
  badPath,
  handle500errors,
  sqlInputErrors,
  customErrorHandler,
} = require('../app/error-handlers');

const express = require('express');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postComment);

app.all('*', badPath);

app.use(customErrorHandler);
app.use(sqlInputErrors);
app.use(handle500errors);

module.exports = app;
