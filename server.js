const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'app_db',
    waitForConnections: true,
    connectionLimit: 10
});

// 1. READ ALL
app.get('/api/users', (req, res) => {
    const sql = `SELECT u.*, p.biography, p.experience_level, p.latitude, p.longitude, p.entry_year 
                 FROM users u LEFT JOIN profiles p ON u.id = p.user_id ORDER BY u.id DESC`;
    pool.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. CREATE OR UPDATE (Logic based on ID)
app.post('/api/users', (req, res) => {
    const d = req.body;
    const activeStatus = d.is_active === 'on' ? 1 : 0;
    const userId = d.id; // Get ID if editing

    if (userId) {
        // UPDATE LOGIC
        pool.query(
            'UPDATE users SET full_name=?, birth_date=?, is_active=?, balance=?, registration_time=?, last_name_initial=? WHERE id=?',
            [d.full_name, d.birth_date, activeStatus, d.balance, d.registration_time, d.last_name_initial, userId],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                pool.query(
                    'UPDATE profiles SET biography=?, experience_level=?, latitude=?, longitude=?, entry_year=? WHERE user_id=?',
                    [d.biography, d.experience_level, d.latitude, d.longitude, d.entry_year, userId],
                    (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ success: true, message: "Updated" });
                    }
                );
            }
        );
    } else {
        // CREATE LOGIC
        pool.query(
            'INSERT INTO users (full_name, birth_date, is_active, balance, registration_time, last_name_initial) VALUES (?,?,?,?,?,?)',
            [d.full_name, d.birth_date, activeStatus, d.balance, d.registration_time, d.last_name_initial],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                pool.query(
                    'INSERT INTO profiles (user_id, biography, experience_level, last_login, latitude, longitude, entry_year, avatar_points) VALUES (?,?,?,NOW(),?,?,?,?)',
                    [result.insertId, d.biography, d.experience_level, d.latitude, d.longitude, d.entry_year, 100],
                    (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ success: true, message: "Created" });
                    }
                );
            }
        );
    }
});

// 3. DELETE
app.delete('/api/users/:id', (req, res) => {
    pool.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('✅ Full CRUD Server ready at http://localhost:3000'));