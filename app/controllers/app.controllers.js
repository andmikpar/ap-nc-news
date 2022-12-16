const {
  findTopics,
  findArticles,
  findArticleById,
  findArticleComments,
  addComment,
  updateVoteCount,
  findUsers,
  removeComment,
} = require('../models/app.models');
const checkIfExists = require('../utils');

const getTopics = (request, response, next) => {
  findTopics()
    .then((result) => {
      response.status(200).send({ topics: result.rows });
    })
    .catch(next);
};

const getArticles = (request, response, next) => {
  const { topic, sorted_by, ordered_by } = request.query;

  const promises = [findArticles(topic, sorted_by, ordered_by)];
  if (topic !== undefined) {
    promises.push(checkIfExists('topics', 'slug', topic));
  }

  Promise.all(promises)
    .then((resolvedArray) => {
      response.status(200).send({ articles: resolvedArray[0] });
    })
    .catch(next);
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  findArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

const getCommentsByArticleId = (request, response, next) => {
  const article_idNum = request.params.article_id;

  const promises = [findArticleComments(article_idNum)];
  if (article_idNum !== undefined) {
    promises.push(checkIfExists('articles', 'article_id', article_idNum));
  }
  Promise.all(promises)
    .then((resolvedArray) => {
      response.status(200).send({ comments: resolvedArray[0] });
    })
    .catch(next);
};

const postComment = (request, response, next) => {
  const { username, body } = request.body;
  const { article_id } = request.params;

  addComment(username, body, article_id)
    .then((addedComment) => {
      response.status(200).send({ addedComment });
    })
    .catch(next);
};

const patchVotes = (request, response, next) => {
  const article_idNum = request.params.article_id;
  const { inc_votes } = request.body;

  const promises = [updateVoteCount(article_idNum, inc_votes)];
  if (article_idNum !== undefined) {
    promises.push(checkIfExists('articles', 'article_id', article_idNum));
  }
  Promise.all(promises)
    .then((resolvedArray) => {
      response.status(200).send({ updatedArticle: resolvedArray[0] });
    })
    .catch(next);
};

const getUsers = (request, response, next) => {
  findUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

const deleteCommentbyId = (request, response, next) => {
  const { comment_id } = request.params;

  checkIfExists('comments', 'comment_id', comment_id)
    .then(() => {
      removeComment(comment_id);
    })
    .then((result) => {
      response.sendStatus(204);
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchVotes,
  getUsers,
  deleteCommentbyId,
};
