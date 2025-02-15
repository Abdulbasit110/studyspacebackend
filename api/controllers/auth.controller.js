const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { createErrorResponse } = require("../../util/errorHandler");
const JWT_SECRET = process.env.JWT_SecretKey || "mysupersupersecretkey";

const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, googleId } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // If user exists and is signing up via Google, update their Google ID
      if (googleId && user.authType === "google") {
        user.googleId = googleId;
        await user.save();
        return generateAndSendToken(user, res, "User updated with Google ID");
      }
      return res.status(409).json({ code: 409, message: "Email is already registered" });
    }

    // Hash password if it's a password-based signup
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const authType = googleId ? "google" : "password";

    user = new User({
      username: email.split("@")[0],
      email,
      passwordHash: hashedPassword,
      authType,
      firstName: firstName || null,
      lastName: lastName || null,
      googleId: googleId || null,
    });

    await user.save();
    return generateAndSendToken(user, res, "User registered successfully");
  } catch (error) {
    createErrorResponse(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ code: 401, message: "Invalid email or user not found" });
    }

    if (googleId) {
      // Google authentication
      if (user.authType !== "google" || user.googleId !== googleId) {
        return res.status(400).json({ code: 400, message: "Google authentication failed" });
      }
      return generateAndSendToken(user, res, "Login successful with Google");
    }

    if (user.authType === "google") {
      return res.status(400).json({
        code: 400,
        message: "This account is registered via Google authentication. Use Google Login.",
      });
    }

    // Password authentication
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: "Invalid password" });
    }

    return generateAndSendToken(user, res, "Login successful");
  } catch (error) {
    createErrorResponse(res, error);
  }
};

const generateAndSendToken = (user, res, message) => {
  const token = jwt.sign(
    { userId: user._id, username: user.username, authType: user.authType },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    code: 200,
    message,
    token,
    data: {
      userId: user._id,
      username: user.username,
      authType: user.authType,
    },
  });
};

module.exports = { signup, login };
