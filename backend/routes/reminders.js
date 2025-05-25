import express from 'express';
import {getReminders, getReminder, createReminder, updateReminder, deleteReminder} from '../controllers/reminders.js';

const router = express.Router();

router.get('/', getReminders);
router.get('/:id', getReminder);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;
