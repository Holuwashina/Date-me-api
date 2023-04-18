const mongoose = require("mongoose");
const validator = require("validator");
const User = require("../models/userModel");

const interestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: User,
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
  skinColor: {
    type: String,
    trim: true,
    required: [true, "skin color is required"],
    enum: {
      values: ["black melani", "albino", "fair"],
      message: "skin color is either - 'black melani', 'albino', 'fair'",
    },
  },
});

const Interest = mongoose.model("Interest", interestSchema);

module.exports = Interest;
