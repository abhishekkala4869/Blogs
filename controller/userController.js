const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

require("dotenv").config();

//*****************************************************************************************************************************
//*****************************************UserControllers*********************************************************************
//*****************************************************************************************************************************

//register a user
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      images: {
        public_id: "this is a sample id",
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
  const isPasswordMatched = await user.comparePassword(password);

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
  const user = await User.findOne({ email: req.body.email });
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
      subjects: `Flipkart Password Recovery`,
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

//Reset Password

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(400, "Reset Password Token is invalid or expired")
    );
  }
  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler(400, "Password doesn't match"));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

//get user Details

exports.getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//update User Password

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler(400, "Your old password is incorrect"));
  }
  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new ErrorHandler(400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//update User Profile

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const newUserData = { name: req.body.name, email: req.body.email };
  //we will add cloudinary later
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, user });
});

//*****************************************************************************************************************************
//*****************************************Admin Controllers*******************************************************************
//*****************************************************************************************************************************

//Get all users [for admin]
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});
//Get all Single User [for admin]
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(404, `User does'nt exit with this id:${req.params.id} `)
    );
  }
  res.status(200).json({ success: true, user });
});

//Delete user [admin]
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  //we will remove cloudinary later
  if (!user)
    return next(
      new ErrorHandler(
        404,
        `User does'nt exists with this id: ${req.params.id} `
      )
    );
  await user.remove();
  res.status(200).json({
    success: true,
    message: `User with  id: ${req.params.id} has been removed`,
  });
});
