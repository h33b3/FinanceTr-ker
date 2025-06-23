const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'finance.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Создаем таблицы, если они не существуют
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            login TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS checks (
            id_check INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name_check TEXT NOT NULL,
            summa REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id_transactions INTEGER PRIMARY KEY AUTOINCREMENT,
            check_id INTEGER NOT NULL,
            name_transactions TEXT NOT NULL,
            summa REAL NOT NULL,
            type TEXT NOT NULL,  # 'income' или 'expense'
            date TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (check_id) REFERENCES checks (id_check)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS goals (
            id_goals INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name_goals TEXT NOT NULL,
            target_summa REAL NOT NULL,
            current_summa REAL DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);
    });
}

module.exports = db;