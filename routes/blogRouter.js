const express = require("express");
const router = express.Router();

router.route("/user/").get(getAllUsers).post(createUser);
router.route("/user/:id").get(getUser).put(updateUser).delete(deleteUser);
//user routes
router.route("/user/login").post(signIn).post(signOut);
