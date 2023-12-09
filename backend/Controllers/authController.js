import User from '../models/userSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const generateToken = existingUser => {
    const payload = {
        id: existingUser._id,
        isAdmin: existingUser.isAdmin || false, 
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d",
    });
};

export const register = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    try {

        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Ensure that the password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Password do not match' });
        }

        // Password complexity check using regular expressions
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
            });
        }

        // Email validation using regular expressions
        const emailRegex = /^[^\s@#!]+@{1}[^\s@.#!]+\.{1}[^\s@.]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(200).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};



export const login = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if the user exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create and sign a JSON Web Token (JWT)
        const token = generateToken(existingUser);

        const {password, appointments, ...rest} = existingUser._doc

        res.status(200).json({ success: true, message: 'Successfully Login', token, data: {...rest}});

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Failed to Login' });
    }
};
