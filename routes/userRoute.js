const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  deleteUser,
} = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
//register user
// router.route("/register").post(registerUser);
router.get("/hello", (req, res) => {
  res.status(200).json({ message: "hello world" });
});
router.post("/register", registerUser);
//login user
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forget").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
//users profile
router.route("/me").get(isAuthenticatedUser, getUserDetails);
//users update password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
//User update profile
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

//admin routes

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
module.exports = router;
