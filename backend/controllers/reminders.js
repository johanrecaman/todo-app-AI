import openDb from '../db.js';

const db = await openDb();

export const getReminders = async (_, res) =>{
  const sql = 'SELECT * FROM reminders ORDER BY created_at DESC';
  const reminders = await db.all(sql);
  res.json(reminders);
}

export const getReminder = async (req, res) =>{
  const sql = 'SELECT * FROM reminders WHERE id = ?';
  const reminder = await db.get(sql, req.params.id);
  res.json(reminder);
}

export const createReminder = async (req, res) =>{
  const { title, location, date, time } = req.body;
  const sql = 'INSERT INTO reminders (title, location, date, time) VALUES (?, ?, ?, ?)';
  const params = [title, location, date, time];
  await db.run(sql, params);
  res.status(201).json({ message: 'Reminder created successfully' });
}

export const updateReminder = async (req, res) =>{
  const { title, location, date, time } = req.body;
  const sql = 'UPDATE reminders SET title = ?, location = ?, date = ?, time = ? WHERE id = ?';
  const params = [title, location, date, time, req.params.id];
  await db.run(sql, params);
}

export const deleteReminder = async (req, res) =>{
  const sql = 'DELETE FROM reminders WHERE id = ?';
  await db.run(sql, req.params.id);
}
