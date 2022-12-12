const db = require('../../db/connection');

findTopics = (request, response, next) => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result;
  });
};

module.exports = { findTopics };
