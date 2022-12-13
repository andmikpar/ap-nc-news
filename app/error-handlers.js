const { response } = require('./app');

const badPath = (request, response, next) => {
  response.status(404).send({ msg: 'Not Found' });
};

const customErrorHandler = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
};

const sqlInputErrors = (err, request, response, next) => {
  if (err.code === '22P02') {
    response.status(400).send({ msg: 'Bad Request' });
  } else next(err);
};

const handle500errors = (err, request, response, next) => {
  response.status(500).send({ err });
};

module.exports = {
  badPath,
  handle500errors,
  sqlInputErrors,
  customErrorHandler,
};
