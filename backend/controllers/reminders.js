import db from '../db.js';

export const getReminders = async (_, res) => {
  const sql = 'SELECT * FROM reminders';
  db.all(sql, [], (err, reminders) => {
    if (err){
      return res.status(500).json({ error: 'Erro ao buscar lembretes' });
    }
    res.json(reminders);
  });
}

export const getReminder = async (req, res) => {
  const sql = 'SELECT * FROM reminders WHERE id = ?';
  const params = [req.params.id];
  db.get(sql, params, (err, reminder) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar lembrete' });
    }
    if (!reminder) {
      return res.status(404).json({ error: 'Lembrete não encontrado' });
    }
    res.json(reminder);
  });
}

export const createReminder = async (req, res) => {
  const { title, location, date, time } = req.body;
  const sql = 'INSERT INTO reminders (title, location, date, time) VALUES (?, ?, ?, ?)';
  const params = [title, location, date, time];
  
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar lembrete' });
    }
    res.status(201).json({ id: this.lastID });
  });
}

export const updateReminder = async (req, res) => {
  const { title, location, date, time } = req.body;
  const sql = 'UPDATE reminders SET title = ?, location = ?, date = ?, time = ? WHERE id = ?';
  const params = [title, location, date, time, req.params.id];
  
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar lembrete' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Lembrete não encontrado' });
    }
    res.json({ message: 'Lembrete atualizado com sucesso' });
  });
}

export const deleteReminder = async (req, res) => {
  const sql = 'DELETE FROM reminders WHERE id = ?';
  const params = [req.params.id];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar lembrete' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Lembrete não encontrado' });
    }
    res.json({ message: 'Lembrete deletado com sucesso' });
  });
}
