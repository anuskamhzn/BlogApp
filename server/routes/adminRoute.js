import express from 'express';
import adminController from '../controllers/adminController.js';
import adminMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const { isAdmin } = adminMiddleware;

// User Management Routes
router.get('/all-users', isAdmin, adminController.getAllUsers);        // Supports ?page=&limit=
router.get('/users-info/:id', isAdmin, adminController.getUserById);
router.delete('/delete/:userId', isAdmin, adminController.deleteUser);

// Blog Management Routes
router.get('/all-blogs', isAdmin, adminController.getAllBlogs);        // Supports ?page=&limit=
router.get('/recent-blogs', isAdmin, adminController.getRecentBlogs);
router.get('/blogs/:id', isAdmin, adminController.getBlogsById);
router.delete('/delete-blog/:blogId', isAdmin, adminController.deleteBlog);

export default router;