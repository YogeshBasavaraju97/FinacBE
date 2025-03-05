const express = require("express");
const User = require("../models/user");
const { validateAge, validatePassword } = require("../helpers/validations");
const { calculateAge } = require("../helpers/function");
const bcrypt = require("bcrypt");

const router = express.Router();
const userAuth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { name, age, dateOfBirth, password, gender, about } = req.body;
    if (!name || !age || !dateOfBirth || !password || !gender) {
      return res
        .status(400)
        .send({ message: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ name: name });
    if (existingUser) {
      return res.status(400).send({ message: "name is registered" });
    }
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      return res.status(400).send({ message: passwordCheck.message });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await new User({
      name,
      age,
      dateOfBirth,
      password: passwordHash,
      gender,
      about,
    });

    await user.save();

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).send({ message: "name and password required" });
    }
    const sanitizedName = name.toLowerCase().trim();
    const user = await User.findOne({ name: sanitizedName });
    if (!user) {
      return res.status(404).send({ message: "No user Found" });
    }
    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "invalid credentials" });
    }

    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 900000, httpOnly: true });

    res.status(201).send({
      message: "User successfully logged in",
      token: token,
      user: user,
    });
  } catch (error) {
    res.status(500).send({ message: "server error", error: error.message });
  }
});

router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "server error", error: error.message });
  }
});

router.put("/:id", userAuth, async (req, res) => {
  try {
    const { name, dateOfBirth, gender, age, about } = req.body;

    const ALLOWED_UPDATES = ["name", "dateOfBirth", "age", "gender", "about"];
    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send({ message: "update not allowed" });
    }

    const data = {
      name: name,
      age: age,
      dateOfBirth: dateOfBirth,
      gender: gender,
      about: about,
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ message: "user not found" });
    }

    res.status(200).send({ message: "user updated", user: updatedUser });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", userAuth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ message: "user not found" });
    }
    res.status(200).send({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", null, { maxAge: 0 });
  res.send();
});

module.exports = router;
