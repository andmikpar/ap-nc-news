const {
  findTopics,
  findArticles,
  findArticleById,
} = require('../models/app.models');

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
  findArticleComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
};
