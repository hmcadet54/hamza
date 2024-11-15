import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/database.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test the database connection using async/await
async function testDatabaseConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to database');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process on connection error
  }
}

testDatabaseConnection();

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/api/patients', async (req, res) => {
  try {
    const { name, age, tel, address, height, weight, blood_pressure, pulse, temperature, sugar, bmi, diagnosis_patient } = req.body;

    const [result] = await pool.query(
      'INSERT INTO patient_historyV1 (name, age, tel, address, height, weight, blood_pressure, pulse, temperature, sugar, bmi diagnosis_patient) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, age, tel, address, height, weight, blood_pressure, pulse, temperature, sugar, bmi, diagnosis_patient]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patient_historyV1');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;