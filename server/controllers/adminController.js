import User from '../models/User.js';
import Blog from '../models/Blog.js';

import mongoose from 'mongoose';

// Get all users with pagination
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

        const users = await User.find({
            role: { $ne: 'admin' }
        })
            .select('name email createdAt role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            count: users.length,
            users
        });
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

// Get all blogs with pagination
const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalBlogs = await Blog.countDocuments();

        const blogs = await Blog.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            totalBlogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page,
            count: blogs.length,
            blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getRecentBlogs = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();

        const recentBlogs = await Blog.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalBlogs,
            recentBlogs,
        });
    } catch (error) {
        console.error("Error fetching recent users and counts:", error);
        res.status(500).json({ message: "Error fetching data", error: error.message });
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
    getRecentBlogs,
    getBlogsById,
    deleteBlog
}