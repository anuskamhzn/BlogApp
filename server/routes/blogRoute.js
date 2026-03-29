import express from 'express';

import blogController from '../controllers/blogController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware.authenticate, blogController.createBlog);
router.get('/get', blogController.getAllBlogs);
router.get('/get/:id', blogController.getBlogById);
router.get('/getByUserId/:userId', authMiddleware.authenticate, blogController.getBlogByUserId);
router.get('/getByUser/:userId', blogController.getBlogByUser);
router.put('/update/:id', authMiddleware.authenticate, blogController.updateBlog);
router.delete('/delete/:id', authMiddleware.authenticate, blogController.deleteBlog);

export default router;