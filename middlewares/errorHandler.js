const CustomError = require('../utils/customError'); 


function errorHandler(err, req, res, next) {
  if (err instanceof CustomError) {

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }


  console.error('Unexpected Error:', err); 
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}

module.exports = errorHandler;
