const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "is required"],
    unique: [true, "is already taken"],
    minLength: [5, "is too short"],
    maxLength: [15, "is too short"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "is required"],
    unique: [true, "already taken"],
    validate: [validator.isEmail, "is invalid"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "is required"],
    minLength: [5, "is too short"],
    select: false,
  },
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.confirmPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt);
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changeTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
