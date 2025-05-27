import express from 'express';
import cors from 'cors';
import router from './routes/reminders.js';
import db from './db.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/reminders', router);

app.listen(3001);
