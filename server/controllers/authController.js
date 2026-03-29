import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        if (!name || !email || !password || !confirm_password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password should be at least 8 characters long"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists, please login instead"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "User Registration Error",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password incorrect" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error: (error).message });
    }
};

export default {
    register,
    login,
}