const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    if (error.message.includes("username_1 dup key")) {
      return next(new AppError("username: username taken", 400));
    }
    if (error.message.includes("email_1 dup key")) {
      return next(new AppError("email: email taken", 400));
    }
    return next(new AppError(` ${error.message}`, 400));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.confirmPassword(password, user.password))) {
      return next(new AppError("incorrect email or password", 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("you are not logged in", 401));
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("the user belonging to this token is no longer exist", 401)
      );
    }
    if (!currentUser.changePasswordAfter(decoded.iat)) {
      console.log(!currentUser.changePasswordAfter(decoded.iat));
      return next(
        new AppError("user recently changed password, pls login again", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error.name);
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("invalid token", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new AppError("token expired", 401));
    }
  }
};
