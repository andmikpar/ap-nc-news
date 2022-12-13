const { getTopics } = require('../app/controllers/app.controllers');
const { badPath, handle500errors } = require('../app/error-handlers');

const express = require('express');

const app = express();

app.get('/api/topics', getTopics);

app.all('*', badPath);

app.use(handle500errors);

module.exports = app;
