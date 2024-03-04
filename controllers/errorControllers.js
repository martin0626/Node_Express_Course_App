const appError = require('./../utils/appError');


const handleCastErr = (err)=>{
    const message = `Inavlid ${err.path}: ${err.value}`
    return new appError(message, 400);
}


const handleDublicateFieldsDB = err =>{
    let value = Object.values(err.keyValue)[0];
    let field = Object.keys(err.keyValue)[0];
    
    const message = `Duplicate field value: ${value} for ${field}. Please use another value.`;
    return new appError(message, 400);
}


const handleValidationErrorDB = err =>{
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;

    return new appError(message, 400);
}


const sendErrorDev = (err, res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });  
}

const sendErrorProd = (err, res)=>{

    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }else{
        // Log error to be checked by developer and send generic message to the client
        console.log("Error!", err)
        //Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
}


module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV === 'production'){

        let error = {...err};
        if(err.name == 'CastError') error = handleCastErr(error);
        if(error.code == 11000) error = handleDublicateFieldsDB(error);
        if(err.name == 'ValidationError') error = handleValidationErrorDB(error);

        sendErrorProd(error, res);
    }
};