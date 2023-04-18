const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app.js");

const DB = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

async function dbConnection() {
  await mongoose.connect(DB);
  console.log("DB connected");
}

dbConnection().catch((err) => {
  console.log(err.name, err.message);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on ${PORT} ⚡️`);
});

// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on("uncaughtException", (err) => {
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
