//Importing all external libraries
const fs = require('fs');   
const express = require('express');

//Express
const app = express();


// Middleware for reading json body for post requests
app.use(express.json());
// Middleware for reading static files
app.use(express.static(`${__dirname}/public`))


// Custom Middleware:
app.use((req, res, next)=>{
    console.log("Hello from middleware 👌❤️");

    //Adding property to request object for all Urls
    req.addedProp = 'Succesfully added!😉'

    next();
})


//Routers
const tourRouter = require('./routers/tourRouters');
const userRouter = require('./routers/userRouters');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;
