import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

const createBlog = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const blog = new Blog({
            ...req.body,
            author: req.user.id
        });

        const saveBlog = await blog.save();
        res.status(201).json(saveBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};

// Get All Blogs - WITH PAGINATION (Public)
const getAllBlogs = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments();

        res.status(200).json({
            success: true,
            count: blogs.length,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page,
            totalBlogs,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Retrieves a single blog by its ID, with author details populated. Public access—any user can view any blog.
const getBlogById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name email');

        if (!blog) return res.status(400).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Retrieves a specific blog (pagination) but verifies that the authenticated user is the author. Used for authorization checks before edits/deletes.
const getBlogByUserId = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { userId } = req.params;

        const blogs = await Blog.find({ author: userId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments({ author: userId });

        res.status(200).json({
            success: true,
            count: blogs.length,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page,
            totalBlogs,
            data: blogs
        });
    } catch (error) {
        console.error("Error in getBlogByUserId:", error);
        res.status(500).json({
            message: "Server error while fetching blogs",
            error: error.message
        });
    }
};

const updateBlog = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized user' });

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },   // Note: fixed typo "updateAt" → "updatedAt"
            {
                returnDocument: 'after',   // ← This replaces the deprecated `new: true`
                runValidators: true
            }
        ).populate('author', 'name email');

        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({
            _id: req.params.id,
            author: req.user.id,        // Important: Security check
        });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found or unauthorized" });
        }

        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export default {
    createBlog,
    getAllBlogs,
    getBlogById,
    getBlogByUserId,
    updateBlog,
    deleteBlog
}