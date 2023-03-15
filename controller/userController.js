const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

//register a user
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      images: {
        public_id: "this is a smaple id",
        url: "profilepicurl",
      },
    },
  });

  sendToken(user, 201, res);
});

//login user
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has given password and email both
  if (!email || !password)
    return next(new ErrorHandler(400, "Please  Enter email and password")); //400 for bad request

  const user = await User.findOne({ email }).select("+password");
  //if password or user is incorrect.
  if (!user) return next(new ErrorHandler(401, "Invalid email or Password")); //401 means unauthorised

  //this function will compare our hashed password
  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched)
    return next(new ErrorHandler(401, "Invalid email or Password")); //401 means unauthorised

  //everything satisfies then it will return a token

  sendToken(user, 200, res);
});

//Logout User

exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out successfully",
  });
});

//Forget password

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await user.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler(404, "user not found"));
  //get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is:- \n\n ${resetPasswordUrl}\n\n if yo have not requested this email then please ignore it `;

  try {
    await sendEmail({
      email: user.email,
      subjects: `Blogger Password Recovery`,
      message: message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} succesfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(500, error.message, 500));
  }
});
