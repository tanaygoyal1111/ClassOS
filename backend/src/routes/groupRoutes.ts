import { Router } from 'express';
import { createGroup, getGroups, getGroupById } from '../controllers/groupController.js';

const router = Router();

router.route('/')
  .post(createGroup)
  .get(getGroups);

router.route('/:id')
  .get(getGroupById);

export default router;
