const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, require: true, unique: true, minlength: 2 },
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

const User = mongoose.model("User", userSchema);
module.exports = User;
