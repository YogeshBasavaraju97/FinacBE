const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://yogeshb0697:PcFzHUotK5Gm2288@fincapluse.q3a2l.mongodb.net/crud"
  );
};

module.exports = connectDB;
