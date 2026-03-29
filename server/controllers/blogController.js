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

//Retrieves all blogs from every user, sorted by newest first. Public endpoint with no restrictions.
const getAllBlogs = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const blogs = await Blog.find().populate('author', 'name email').sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {

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

//Retrieves a specific blog but verifies that the authenticated user is the author. Used for authorization checks before edits/deletes.
const getBlogByUserId = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.params;

        // Find ALL blogs by this user (not just one)
        const blogs = await Blog.find({
            author: userId
        }).sort({ createdAt: -1 });   // Sort newest first

        if (blogs.length === 0) {
            return res.status(200).json({
                message: "No blogs found",
                data: []
            });
        }

        res.status(200).json(blogs);   // Return array directly (cleanest)

    } catch (error) {
        console.error("Error in getBlogByUserId:", error);
        res.status(500).json({
            message: "Server error while fetching blogs",
            error: error.message
        });
    }
};

//Retrieves all blogs written by a specific user (by their user ID). Public endpoint—anyone can view another user's blog collection.
const getBlogByUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const blog = await Blog.find({ author: req.params.userId }).sort({ createdAt: -1 });

        if (!blog) return res.status(400).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized user' });

        const updateBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updateAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('author', 'name email');

        res.json(updateBlog);
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
    getBlogByUser,
    updateBlog,
    deleteBlog
}