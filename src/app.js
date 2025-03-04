const express = require("express");
const connectDB = require("./config/database");

const cors = require("cors");

const cookieParser = require("cookie-parser");
const router = require("./routes/userRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/user", router);

app.listen(7777, () => {
  connectDB()
    .then(() => {
      console.log("Database connection established");
      console.log("server successfully listening on post 7777");
    })
    .catch((err) => {
      console.error("Database cannot be connected");
    });
});
