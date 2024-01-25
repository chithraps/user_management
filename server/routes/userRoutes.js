const express = require("express");
const user_rout = express();

const userController = require("../controller/userController");
const multer = require("../config/multer");
const { verifyToken } = require("../middleware/verifyToken");

user_rout.post("/signup", userController.signUp);
user_rout.post("/login", userController.login);
user_rout.post(
  "/uploadImage",
  verifyToken,
  multer.imageUpload.single("file"),
  userController.uploadImage
);
module.exports = user_rout;
