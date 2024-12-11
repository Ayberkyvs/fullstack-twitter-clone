import express from 'express';
import { getAllHashtags } from '../controllers/hashtag.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/all', protectRoute, getAllHashtags);

export default router;