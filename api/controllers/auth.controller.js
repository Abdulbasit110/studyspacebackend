const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { createErrorResponse } = require('../../util/errorHandler');
const { rolesEnum } = require('../../util/enum');
const JWT_SECRET = process.env.JWT_SecretKey || 'mysupersupersecretkey';

const signup = async (req, res) => {
    try {
        const { email, password, firstName, lastName, location, address, phoneNumber, role } = req.body;
        
        // Validate role (Ensure role is one of the allowed values)
        if (role && !Object.values(rolesEnum).includes(role)) {
            return res.status(400).json({
                code: 400,
                message: `Invalid role. Allowed roles are: ${Object.values(rolesEnum).join(", ")}`
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ code: 409, message: 'Email is already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            location,
            address,
            phoneNumber,
            role
        });
        await user.save();
        
        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        

        res.status(201).json({ 
            code: 201, 
            message: 'User registered successfully',
            token: token,
            data: {
                userId: user._id,
                role: user.role,
            }
        });
    } catch (error) {
        createErrorResponse(res, error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ code: 401, message: 'Invalid email' });
        }
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ code: 401, message: 'Invalid password' });
        }
        
        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(200).json({ 
            code: 200, 
            message: 'Login successful', 
            token: token,
            data: {
                userId: user._id,
                role: user.role,
            }
        });
    } catch (error) {
        createErrorResponse(res, error);
    }
};

module.exports = { signup, login };
