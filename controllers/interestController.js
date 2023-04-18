const Interest = require("../models/interestModel");
const AppError = require("../utils/appError");

exports.createInterest = async (req, res, next) => {
  const body = {
    userId: req.user._id,
    ...req.body,
  };

  try {
    if (await Interest.findOne({ userId: body.userId }))
      return next(new AppError("interests already saved", 400));

    const interest = await Interest.create(body);

    res.status(201).json({
      status: "success",
      data: {
        interest,
      },
    });
  } catch (error) {
    if (error.message.includes("skin color")) {
      return next(new AppError("invalid skin color", 400));
    }
    return next(new AppError(error.message, 400));
  }
};

exports.getInterest = async (req, res) => {
  try {
    if (await Interest.findOne({ userId: req.user._id })) {
      res.status(200).json({
        status: "success",
        data: {
          interestSaved: true,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateInterest = async (req, res) => {
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
