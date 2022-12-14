const db = require('../db/connection');

const checkIfExists = (article) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      } else {
        return true;
      }
    });
};

module.exports = checkIfExists;
