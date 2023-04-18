const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
const interestRouter = require("./routes/interestRoute");

const app = express();

// MIDDLEWARES
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static("public"));

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/user/profile", profileRouter);
app.use("/api/v1/user/interest", interestRouter);

// UNHANDLE ROUTE
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR
app.use(globalErrorHandler);

module.exports = app;
