
// api/routes/auth.router.js
const express = require('express');
const { signup, login } = require('../controllers/auth.controller');
const { validateLogin, validateSignUp } = require('../middlewares/authValidation');
const router = express.Router();

router.post('/signup', validateSignUp, signup);
router.post('/login', validateLogin, login);

module.exports = router;