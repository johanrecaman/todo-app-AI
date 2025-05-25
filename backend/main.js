import express from 'express';
import cors from 'cors';
import router from './routes/reminders.js';
import openDb from './db.js';

await openDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', router);

app.listen(3001);
