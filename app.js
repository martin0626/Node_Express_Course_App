//Importing all external libraries
const fs = require('fs');   
const express = require('express');
//Express
const app = express();
// Custom error
const AppError = require('./utils/appError')
//Global custo error handlers
const globalErrorHandler = require('./controllers/errorControllers')





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

// Catching wrong URL. if none of routes above is matched, this middleware returns err message with the wrong URL.
app.all('*', (req, res, next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

// Middleware to catch all errors
app.use(globalErrorHandler)

module.exports = app;
