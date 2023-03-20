const Blog = require("../models/blogModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("express-async-handler");
const ApiFeature = require("../utils/apiFeatures");

//create Blog ----EveryOne
exports.createBlog = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, blog });
});

//get all Blogs ----EveryOne

//this is basudev's contribution
exports.getAllBlogs = asyncHandler(async (req, res) => {
  const resultPerPage = 5;
  const blogCount = await Blog.countDocuments();
  const apiFeature = new ApiFeature(Blog.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const blogs = await apiFeature.query;
  res.status(200).json({ success: true, blogs, Count });
});

//Update Blog---Admin Route
exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler(404, "Blog not found"));
  }
  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    blog,
  });
});

//delete Product ---Admin  Route
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler(404, "Blog not found"));
  }
  await blog.remove();
  res.status(200).json({ success: true, message: "Blog Deleted Successfully" });
});

//get single Blog
exports.getBlogDetails = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler(404, "Blog not found"));
  }
  res.status(200).json({ success: true, blog });
});

//Comment on blog
exports.commentBlog = asyncHandler(async (req, res, next) => {
  const { comment, blog_id } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
  };
  const blog = await Blog.findById(blog_id);

  const isReviewed = blog.comments.find(
    (com) => com.user.toString() === req.user._id.toString() //here we have used array method find not mongoose method
  );

  if (isReviewed) {
    blog.comments.forEach((com) => {
      if (com.user.toString() === req.user._id.toString()) {
        com.comment = comment;
      }
    });
  } else {
    blog.comments.push(review);
    blog.numOfComments = blog.comments.length;
  }

  await blog.save({ validateBeforeSave: false });
  res.status(200).json({ succes: true });
});
//Get all Reviews of a blog
exports.getBlogComments = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.query.productId);
  if (!blog) return next(new ErrorHandler(404, "Blog not found"));
  res.status(200).json({ success: true, comments: blog.comments });
});
//Delete Comment
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.query.blogId);

  if (!blog) return next(new ErrorHandler(404, "Blog not found"));
  const comments = blog.comments.filter(
    (com) => com._id.toString() !== req.query.id.toString() //id hai comment ki id
  );
  //here we are keeping all those review which we want to keep the other way is to delete only the selected review

  const numsOfComments = comments.length;
  await Blog.findByIdAndUpdate(
    req.query.productId,
    {
      comments,
      numsOfComments,
    },
    { new: true, runValidators: true }
  );
  res
    .status(200)
    .json({ success: true, message: "Comment deleted succesfully" });
});
