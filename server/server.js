// PACKAGES
const express = require('express'),
	  app = express(),
	  server = require('http').createServer(app),
	  bodyParser = require('body-parser');

// HELPERS

server.listen(1607);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");
    if ('OPTIONS' == req.method){
    	res.sendStatus(200);
    }else{
        next();
    }
});

// ROUTE
const usersRouter = require('./routes/users').usersRouter;

app.use('/users/', usersRouter);