const Profile = require("../models/profileModel");
const Interest = require("../models/interestModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.createProfile = async (req, res, next) => {
  const body = {
    userId: req.user._id,
    ...req.body,
  };

  try {
    if (await Profile.findOne({ userId: body.userId }))
      return next(new AppError("profile already saved", 400));

    const profile = await Profile.create(body);

    res.status(201).json({
      status: "success",
      data: {
        profile,
      },
    });
  } catch (error) {
    if (error.message.includes("skin color")) {
      return next(new AppError("invalid skin color", 400));
    }
    if (error.message.includes("age")) {
      return next(new AppError("you need to be 18 & above", 400));
    }
    if (error.message.includes("height")) {
      return next(new AppError("height should be 3ft & 8ft", 400));
    }
    if (error.message.includes("body")) {
      return next(new AppError("body size should be 1lbs &  10lbs", 400));
    }
    return next(new AppError(error.message, 400));
  }
};

exports.checkProfileSaved = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    const preference = await Interest.findOne({ userId: req.user._id });
    res.status(200).json({
      status: "success",
      data: {
        profile,
        preference,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.checkImageUpload = async (req, res) => {
  console.log(await Profile.findOne({ userId: req.user._id }));
};

exports.updateProfile = async (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: {
        // user: newUser,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.uploadProfileImage = async (req, res) => {
  const body = {
    userId: req.user._id,
    ...req.body,
  };

  try {
    const profileImageResult = await Profile.findOneAndUpdate(
      { userId: body.userId },
      {
        profileImage: `${req.protocol}://${req.get("host")}/uploads/${
          req.file.originalname
        }`,
        profileCompleted: true,
      }
    ).select("profileImage");

    if (profileImageResult._id) {
      res.status(201).json({
        status: "success",
        data: {
          profileImageUrl: `${req.protocol}://${req.get("host")}/uploads/${
            req.file.originalname
          }`,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.searchProfile = async (req, res) => {
  try {
    const { gender, skinColor } = await Interest.findOne({
      userId: req.user._id,
    });
    const searches = await Profile.find({
      gender,
      skinColor,
    });

    res.status(200).json({
      status: "success",
      data: {
        searches,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.locationQuery = async (req, res) => {
  console.log(req.query);
  try {
    const searches = await Profile.find(req.query);

    console.log(searches);

    res.status(200).json({
      status: "success",
      data: {
        searches,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
