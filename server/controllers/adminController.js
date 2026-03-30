import User from '../models/User.js';
import Blog from '../models/Blog.js';

import mongoose from 'mongoose';

// Get all users 
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: { $ne: 'admin' } // Exclude users with role 'admin'
        }).select(' name email createdAt').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Find user by ID
        const user = await User.findById(id).select('name email createdAt');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User found", user });
    } catch (error) {
        console.error('Error fetching user:', error); // Log the error
        res.status(500).json({ success: false, message: "Error in fetching user", error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const admin = req.user;
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can delete users." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role === 'Admin') {
            return res.status(400).json({ message: "Cannot delete admin accounts." });
        }

        await user.deleteOne();
        res.status(200).json({
            success: true,
            message: `User ${user.name} has been deleted successfully.`,
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getBlogsById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Find user by ID
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.status(200).json({ success: true, message: "Blog found", blog });
    } catch (error) {
        console.error('Error fetching user:', error); 
        res.status(500).json({ success: false, message: "Error in fetching blog", error });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;

        const admin = req.user;
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can delete blogs." });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        await blog.deleteOne();
        res.status(200).json({
            success: true,
            message: `Blog ${blog.title} has been deleted successfully.`,
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
    }
};

export default {
    getAllUsers,
    getUserById,
    deleteUser,
    getAllBlogs,
    getBlogsById,
    deleteBlog
}