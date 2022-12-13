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
module.exports = { findTopics, findArticles };
