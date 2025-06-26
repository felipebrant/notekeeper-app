import express from 'express';
const router = express.Router();
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tagController.js';
import { protect } from '../middleware/authMiddleware.js';


router.use(protect);

router.route('/').get(getTags).post(createTag);
router.route('/:id').put(updateTag).delete(deleteTag);

export default router;
