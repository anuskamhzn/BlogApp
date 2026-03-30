import express from 'express';
import adminController from '../controllers/adminController.js';
import adminMiddleware from '../middleware/authMiddleware.js';

const { isAdmin} = adminMiddleware;

const router = express.Router();

router.get('/all-users', isAdmin, adminController.getAllUsers);
router.get('/users-info/:id', isAdmin, adminController.getUserById);
router.delete('/delete/:userId', isAdmin, adminController.deleteUser);

router.get('/all-blogs', isAdmin, adminController.getAllBlogs);
router.get('/blogs/:id', isAdmin, adminController.getBlogsById);
router.delete('/delete-blog/:blogId', isAdmin, adminController.deleteBlog);

export default router;