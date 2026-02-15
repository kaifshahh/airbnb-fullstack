const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res, next) => {
  res.json({
    pageTitle: "Login",
  });
};

exports.getSignup = (req, res, next) => {
  res.json({
    pageTitle: "Signup",
  });
};

exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should be atleast 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be atleast 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    .matches(/[!@&]/)
    .withMessage("Password should contain atleast one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value, { req }) => {
      if (value !== "on" && value !== true) {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: "Validation failed",
        errors: errors.array().map((err) => err.msg),
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.status(201).json({ message: "User registered successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Registration failed" });
      });
  },
];

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({ error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({ error: "Invalid Password" });
    }

    /* req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save(); */

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ message: "Login successful", user: user, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.postLogout = (req, res, next) => {
  /* req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Assuming default cookie name
    res.json({ message: "Logout successful" });
  }); */
  res.json({ message: "Logout successful" }); // JWT logout is client-side
};

exports.getAuthStatus = (req, res, next) => {
  // Check if req.userId was set by isAuth middleware
  if (req.userId) {
    User.findById(req.userId)
      .then((user) => {
        if (!user) {
          return res.json({ isLoggedIn: false });
        }
        res.json({ isLoggedIn: true, user: user });
      })
      .catch((err) => {
        console.log(err);
        res.json({ isLoggedIn: false });
      });
  } else {
    res.json({ isLoggedIn: false });
  }
};
