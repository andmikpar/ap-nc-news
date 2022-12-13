const db = require('../../db/connection');

findTopics = (request, response, next) => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result;
  });
};

findArticles = (request, response, next) => {
  return db
    .query(
      `SELECT articles.article_id, articles.author , articles.title, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) 
      AS comment_count FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id Group BY articles.article_id 
      ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

findArticleById = ({ article_id }) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: 'Not Found',
        });
      return result.rows;
    });
};
module.exports = { findTopics, findArticles, findArticleById };
