// PACKAGES
const express = require('express'),
	  app = express(),
	  server = require('http').createServer(app),
	  bodyParser = require('body-parser');

// HELPERS

server.listen(1607);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTE
const usersRouter = require('./routes/users').usersRouter;

app.use('/users/', usersRouter);