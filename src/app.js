const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");

const cors = require("cors");

const cookieParser = require("cookie-parser");
const router = require("./routes/userRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", router);

app.listen(process.env.PORT, () => {
  connectDB()
    .then(() => {
      console.log("Database connection established");
      console.log("server successfully started");
    })
    .catch((err) => {
      console.error("Database cannot be connected", err);
    });
});
