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
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router
  .route("/user/blog/new")
  .post(isAuthenticatedUser, authorizeRoles("admin", "auther"), createBlog); //adding authentication and authorization.
router
  //admin routes
  .route("/admin/blog/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateBlog)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBlog);

//user routes
router.route("/blog/:id").get(getBlogDetails);
router.route("/blogs").get(getAllBlogs);
router.route("/comment").put(isAuthenticatedUser, commentBlog);
router
  .route("/comments")
  .get(getBlogComments)
  .delete(isAuthenticatedUser, deleteComment);
module.exports = router;
