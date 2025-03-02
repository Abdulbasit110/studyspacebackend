const express = require("express");
const { signup, login } = require("../controllers/auth.controller");
const {
  validateLogin,
  validateSignUp,
} = require("../middlewares/authValidation");
const JWT_SECRET = process.env.JWT_SecretKey || "mysupersupersecretkey";
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../util/authMiddleware");
const userModel = require("../models/user.model");
router.post("/signup", signup);
router.post("/login", login);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const payload = {
      user: {
        id: req.user._id,
        role: req.user.role,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "10h" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Error generating token" });
      }
      // Redirect to your client with the token as a query parameter
      res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${token}`);
    });
  }
);

// const express = require("express");
// const { signup, login } = require("../controllers/auth.controller");
// const { validateLogin, validateSignUp } = require("../middlewares/authValidation");
// const JWT_SECRET = process.env.JWT_SecretKey || "mysupersupersecretkey";
// const passport = require("passport");

// const router = express.Router();

// router.post("/signup", validateSignUp, signup);
// router.post("/login", validateLogin, login);

// // Google OAuth callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false, failureRedirect: "/login" }),
//   (req, res) => {
//     const payload = { user: { userId: req.user._id, username: req.user.username, authType: req.user.authType } };
//     jwt.sign(payload, JWT_SECRET, { expiresIn: "10h" }, (err, token) => {
//       if (err) {
//         return res.status(500).json({ code: 500, message: "Error generating token" });
//       }
//       res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${token}`);
//     });
//   }
// );

// module.exports = router;

// api/routes/auth.router.js

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-passwordHash"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
