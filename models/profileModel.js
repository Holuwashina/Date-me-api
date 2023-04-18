const mongoose = require("mongoose");
const validator = require("validator");
const User = require("../models/userModel");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: User,
  },
  firstname: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "firstname is required"],
  },
  lastname: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "lastname is required"],
  },
  age: {
    type: Number,
    trim: true,
    required: [true, "age is required"],
    min: [18, "you need to be 18 and above"],
    max: [70, "you are above 70 - too old"],
  },
  gender: {
    type: String,
    trim: true,
    required: [true, "gender is required"],
    enum: {
      values: ["male", "female", "other"],
      message: "gender is either - 'male', 'female', 'other'",
    },
  },
  relationship: {
    type: String,
    trim: true,
    required: [true, "marital status is required"],
    enum: {
      values: ["single", "married", "divorced"],
      message: "gender is either - 'single', 'married', 'divorced'",
    },
  },
  skinColor: {
    type: String,
    trim: true,
    required: [true, "skin color is required"],
    enum: {
      values: ["black melani", "albino", "fair"],
      message: "skin color is either - 'black melani', 'albino', 'fair'",
    },
  },
  height: {
    type: Number,
    trim: true,
    required: [true, "height is required"],
    min: [3, "invalid height in ft"],
    max: [8, "invalid height in ft"],
  },
  bodySize: {
    type: Number,
    trim: true,
    required: [true, "body size is required"],
    min: [1, "invalid body size in lbs"],
    max: [10, "invalid height in lbs"],
  },
  location: String,
  profileImage: String,
  profileCompleted: Boolean,
  moreImages: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
