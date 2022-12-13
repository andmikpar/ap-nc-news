const { findTopics, findArticles } = require('../models/app.models');

const getTopics = (request, response, next) => {
  findTopics()
    .then((result) => {
      response.status(200).send(result.rows);
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

module.exports = { getTopics, getArticles };
