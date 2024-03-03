// Lecture 116: To remove try/catch blocks from all controllers functions and make them cleaner. 
const catchAsync = (fn)=>{
    return (req, res, next) =>{
        fn(req, res, next).catch(err=> next(err));
    }
}

module.exports = catchAsync;