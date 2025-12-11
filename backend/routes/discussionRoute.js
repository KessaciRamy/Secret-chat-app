import express from 'express';
import { createDiscussion, listDiscussions, closeDiscussion } from '../controllers/discussionController.js';

const router = express.Router();
// POST /api/
router.post('/', createDiscussion);

router.get('/', listDiscussions);

router.post('/:id/close', closeDiscussion);

export default router;