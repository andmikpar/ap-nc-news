const db = require('../db/connection');
const fs = require('fs/promises');
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

const findEndpoints = () => {
  return fs
    .readFile('./endpoints.json', 'utf8')
    .then((result) => {
      console.log(result);
      response.status(200).send({ endPoints: JSON.parse(result) });
    })
    .catch(next);
};

module.exports = { checkIfExists, findEndpoints };
