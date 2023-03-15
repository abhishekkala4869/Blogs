const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

//to check if the user is loggedin
exports.isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler(401, "Please login first"));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id); //till the user is loggedin we can access user data
  next();
});

// to check if the user is authorized or not

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorHandler(
          403,
          `${req.user.role} is not allowed to access this resource`
        )
      ); //status code 403 means server understood what we want to do but still refuses our request
    }
    next();
  };
};
