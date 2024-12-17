import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { createPost, deletePost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts, repostPost, getPostById, getPostReplies } from '../controllers/post.controller.js';

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/likes/:id', protectRoute, getLikedPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likeUnlikePost);
router.post('/repost/:id', protectRoute, repostPost);
router.get('/:id', protectRoute, getPostById);
router.get('/replies/:id', protectRoute, getPostReplies);

export default router;