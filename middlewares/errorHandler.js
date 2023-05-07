const errorHandler = (err, req, res, next) =>{

    const errorCode = res.statusCode? res.statusCode : 500

    res.status(errorCode).json({
        message:err.message,
        stack:err.stack
    })
}

module.exports = {
    errorHandler
}