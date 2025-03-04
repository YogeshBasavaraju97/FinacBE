const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
      minlength: 2,
      lowercase: true,
      trim: true,
    },
    age: { type: Number, require: true, min: 0, max: 120 },
    dateOfBirth: {
      type: Date,
      require: true,
    },
    password: {
      type: String,
      require: true,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-zA-Z])(?=.*\d).{10,}$/.test(value);
        },
      },
    },
    gender: { type: String, enum: ["Male", "Female", "others"] },

    about: { type: String, maxlength: 5000 },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "FinacPluse@123", {
    expiresIn: "1hr",
  });

  return token;
};

userSchema.methods.verifyPassword = async function (userPassword) {
  const isVerified = await bcrypt.compare(userPassword, this.password);

  return isVerified;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
