const db = require('../../db/connection');

findTopics = (request, response, next) => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result;
  });
};

findArticles = (topic, sorted_by = 'created_at', ordered_by = 'DESC') => {
  const allowToSortBy = [
    'article_id',
    'title',
    'author',
    'body',
    'created_at',
    'votes',
  ];
  const requestedOrder = ['ASC', 'DESC'];
  if (
    !allowToSortBy.includes(sorted_by.toLowerCase()) ||
    !requestedOrder.includes(ordered_by.toUpperCase())
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  const sqlParams = [];

  let sqlQuery = `SELECT articles.article_id, articles.author , articles.title, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) 
      AS comment_count FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id `;

  if (topic) {
    sqlQuery += `WHERE topic = $1 `;
    sqlParams.push(topic);
  }

  sqlQuery += `GROUP BY articles.article_id  ORDER BY ${sorted_by} ${ordered_by};`;

  return db.query(sqlQuery, sqlParams).then((result) => {
    return result.rows;
  });
};

findArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.body, articles.author , articles.title, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) 
    AS comment_count FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: 'Not Found',
        });
      return result.rows[0];
    });
};

findArticleComments = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments  WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((body) => {
      return body.rows;
    });
};

addComment = (username, body, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

updateVoteCount = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes  = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

findUsers = (request, response, next) => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

removeComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};

module.exports = {
  findTopics,
  findArticles,
  findArticleById,
  findArticleComments,
  addComment,
  updateVoteCount,
  findUsers,
  removeComment,
};
