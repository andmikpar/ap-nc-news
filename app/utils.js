const db = require('../db/connection');

const checkIfExists = (table, column, value) => {
  return db
    .query(`SELECT * FROM ${table} WHERE ${column} = $1`, [value])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      } else {
        return true;
      }
    });
};

module.exports = checkIfExists;
