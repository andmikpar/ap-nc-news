const badPath = (request, response, next) => {
  response.status(404).send({ msg: 'Not Found' });
};

const handle500errors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ err });
};

module.exports = { badPath, handle500errors };
