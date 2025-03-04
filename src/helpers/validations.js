function validateAge(age) {
  if (age < 0 || age > 120) {
    return res.status(400).json({ message: "invalid age" });
  }
}

function validatePassword(password) {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d).{10,}$/;
  if (!password) {
    return { isValid: false, message: "Password is required." };
  }
  if (!regex.test(password)) {
    return {
      isValid: false,
      message:
        "Password must be at least 10 characters long and include at least one letter and one number.",
    };
  }
  return { isValid: true, message: "Valid password" };
}

module.exports = { validateAge, validatePassword };
