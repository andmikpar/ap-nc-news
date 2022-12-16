const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchVotes,
  getUsers,
  deleteCommentbyId,
  getApi,
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

app.get('/api', getApi);

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.get('/api/users', getUsers);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchVotes);

app.delete('/api/comments/:comment_id', deleteCommentbyId);

app.all('*', badPath);

app.use(customErrorHandler);
app.use(sqlInputErrors);
app.use(handle500errors);

module.exports = app;
