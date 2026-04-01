import express from 'express';
import blogController from '../controllers/blogController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/get', blogController.getAllBlogs);           // Supports ?page=1&limit=10
router.get('/get/:id', blogController.getBlogById);
router.get('/getByUser/:userId', blogController.getBlogByUser);   // Supports pagination

// Protected routes (require authentication)
router.post('/create', authMiddleware.authenticate, blogController.createBlog);
router.get('/getByUserId/:userId', authMiddleware.authenticate, blogController.getBlogByUserId); // Supports pagination
router.put('/update/:id', authMiddleware.authenticate, blogController.updateBlog);
router.delete('/delete/:id', authMiddleware.authenticate, blogController.deleteBlog);

export default router;