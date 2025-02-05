require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

app.get('/', (req, res) => {
    res.send("SQL Contest Backend Running");
});

// API to evaluate SQL queries
app.post('/evaluate', async (req, res) => {
    const { userQuery, expectedQuery } = req.body;
    try {
        const userResult = await db.query(userQuery);
        const expectedResult = await db.query(expectedQuery);

        if (JSON.stringify(userResult.rows) === JSON.stringify(expectedResult.rows)) {
            return res.json({ success: true, message: "Correct Answer" });
        } else {
            return res.json({ success: false, message: "Incorrect Answer" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
