const ErrorResponse = require("../utils/errorResponse");


const errorHandler = (err, req, res, next) => {

    let error = {...err};

     error.message = err.message


    // log the error to the console 
    console.log(err);
       // MONGOOSE BAD ERORR 
    if (err.name === 'CastError') {
        const message = `Resource not found with the id ${err.value}`
        error = new ErrorResponse(message, 404)
    }
    // Mongo duplicate key 
    if (err.code === 11000) {
        const message = "Duplicate value filed entered";
        error = new ErrorResponse(message , 400);
    }
    // Mongoose Validation eror 
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message , 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error : error.message || 'Server ERROR'
    });
}

module.exports = errorHandler;