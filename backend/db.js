import sqlite3 from 'sqlite3';
const {Database} = sqlite3;

async function openDb(){
  const db = new Database('./reminders.db', (err) => {
    if (err) {
      console.error('Error opening database ' + err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });

  await db.exec(
    `CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      location TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  );
  return db;
}

export default openDb;
