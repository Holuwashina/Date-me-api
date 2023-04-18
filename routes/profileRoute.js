const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const AppError = require("../utils/appError");
const profileController = require("../controllers/profileController");
const authController = require("../controllers/authController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path.resolve(".")}/public/uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpeg" && ext !== ".jpg") {
      return cb(
        new AppError("only images are allowed - 'jpeg','png','jpg'", 400)
      );
    }
    cb(null, true);
  },
}).single("profileImage");

router
  .route("/")
  .post(authController.protect, profileController.createProfile)
  .get(authController.protect, profileController.checkProfileSaved);

router
  .route("/image")
  .post(upload, authController.protect, profileController.uploadProfileImage)
  .get(authController.protect, profileController.checkProfileSaved);

router
  .route("/search")
  .get(authController.protect, profileController.searchProfile);

router
  .route("/query")
  .get(authController.protect, profileController.locationQuery);

module.exports = router;
