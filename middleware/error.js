const ErrorHandler = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";
  if (err.name === "CastError") {
    err.statusCode = 404;
    message = `Resource not found, Invalid ${err.path}`;
    console.log(err.path);
    return res
      .status(err.statusCode)
      .json({ success: false, message: message });
  }
  if (process.env.NODE_ENV == "production") {
    message = err.message;
  } else {
    message = err.stack;
  }
  //mongodb error  in case of id is less digit i.e cast error

  res.status(err.statusCode).json({ success: false, message: message });
};
