// api/routes/auth.router.js
const express = require("express");
const { signup, login } = require("../controllers/auth.controller");
const {
  validateLogin,
  validateSignUp,
} = require("../middlewares/authValidation");
const JWT_SECRET = process.env.JWT_SecretKey || "mysupersupersecretkey";
const passport = require("passport");
const router = express.Router();

router.post("/signup", validateSignUp, signup);
router.post("/login", validateLogin, login);
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
module.exports = router;
