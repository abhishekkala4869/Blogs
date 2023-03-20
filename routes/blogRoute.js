const express = require("express");
const {
  createBlog,
  updateBlog,
  deleteBlog,
  commentBlog,
  getBlogDetails,
  getAllBlogs,
  getBlogComments,
  deleteComment,
} = require("../controller/blogController");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

//admin routes
router
  .route("/user/blog/new")
  .post(isAuthenticatedUser, authorizeRoles("admin", "auther"), createBlog); //adding authentication and authorization.
router
  .route("/user/blog/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateBlog)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBlog);

//user routes
router.route("/product/:id").get(getBlogDetails);
router.route("/products").get(getAllBlogs);
router.route("/comment").put(isAuthenticatedUser, commentBlog);
router
  .route("/comments")
  .get(getBlogComments)
  .delete(isAuthenticatedUser, deleteComment);
module.exports = router;
