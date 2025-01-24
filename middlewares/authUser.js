const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');


const secretKey = process.env.JWT_SECRET ;

const authUser = (req, res, next) => {

    const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return next(new CustomError('Access denied. No token provided.', 403)); 
  }

  try {

    const decoded = jwt.verify(token, secretKey);


    req.user = decoded;

    next(); 
  } catch (error) {
    console.log(error)
    
    next(new CustomError('Invalid token. Authentication failed.', 401));
  }
};

module.exports = authUser;
