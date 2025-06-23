const { db, hashPassword, comparePassword } = require('./database');

module.exports = {
    register: async (email, login, password) => {
        const hashedPass = await hashPassword(password);
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (email, login, password) VALUES (?, ?, ?)',
                [email, login, hashedPass],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },
    
    login: async (login, password) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE login = ?',
                [login],
                async (err, user) => {
                    if (err) return reject(err);
                    if (!user) return reject(new Error('User not found'));
                    
                    const isValid = await comparePassword(password, user.password);
                    if (!isValid) return reject(new Error('Invalid password'));
                    
                    resolve(user);
                }
            );
        });
    }
};