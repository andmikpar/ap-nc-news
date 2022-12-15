const {
  findTopics,
  findArticles,
  findArticleById,
  findArticleComments,
  addComment,
  updateVoteCount,
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
  findArticles()
    .then((articles) => {
      response.status(200).send({ articles });
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
  const { article_id } = request.params;

  const promises = [findArticleComments(article_id)];
  if (article_id !== undefined) {
    promises.push(checkIfExists(article_id));
  }
  Promise.all(promises)
    .then((resolvedArray) => {
      return resolvedArray[0];
    })
    .then((comments) => {
      response.status(200).send({ comments });
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
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  const promises = [updateVoteCount(article_id, inc_votes)];
  if (article_id !== undefined) {
    promises.push(checkIfExists(article_id));
  }
  Promise.all(promises)
    .then((resolvedArray) => {
      return resolvedArray[0];
    })
    .then((updatedArticle) => {
      response.status(200).send({ updatedArticle });
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
};
