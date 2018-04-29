// ENVIRONMENT VARIABLES
// if (process.env.NODE_ENV === "production") {
//     process.env = require('./config/prod.json');
// } else {
//     process.env = require('./config/dev.json'); 
// }

// PACKAGES
const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    config = require('./config'),
    morgan = require('morgan');

// ROUTES
const authRouter = require('./controllers/auth').authRouter,
      userRouter = require('./controllers/user').userRouter,
      adminRouter = require('./controllers/admin').adminRouter,
      contentRouter = require('./controllers/content').contentRouter;

// HELPERS

server.listen(config.port);

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

// MORGAN LOGGING THE CALLS
app.use(morgan('dev'));

// ROUTES
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/content', contentRouter);