const db = require('../db');

class User {
  //* creating tables
  static async createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      followers INTEGER DEFAULT 0,
      following INTEGER DEFAULT 0
    )`;
    return db.run(sql);
  }
  
  static async createFollowersTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS followers (
      user_id INTEGER NOT NULL,
      follower_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, follower_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (follower_id) REFERENCES users(id)
    )`;
    return db.run(sql);
  }

  static async createFollowingTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS following (
      user_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, following_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (following_id) REFERENCES users(id)
    )`;
    return db.run(sql);
  }

  static async createUser(name, email, password) {
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.run(sql, [name, email, password], function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            reject('Email already exists');
          } else {
            reject(err);
          }
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  //* get user by email and password
  static async getUser(email, password) {
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [email, password], function (err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      })
    })
  }

  //* get user by id
  static async getUserById(id) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [id], function (err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      })
    })
  }

  //* get users by search
  static async getUsersByName(name) {
    const sql = `SELECT id, name FROM users WHERE name LIKE ?`;
    return new Promise((resolve, reject) => {
      db.all(sql, [`%${name}%`], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }

  static async follow(followingId, followerId) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(`INSERT INTO followers (user_id, follower_id) VALUES (?, ?)`, [followingId, followerId], function (err) {
        if (err) {
          reject(err);
        }

        db.run(`INSERT INTO following (user_id, following_id) VALUES (?, ?)`, [followerId, followingId], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      })
    });
  }

  static async getFollowers(id) {
    const sql = `SELECT name FROM users JOIN followers ON users.id = followers.follower_id WHERE followers.user_id = ?`;
    return new Promise((resolve, reject) => {
      db.all(sql, [id], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }

  static async getFollowing(id) {
    const sql = `SELECT name FROM users JOIN following ON users.id = following.following_id WHERE following.user_id = ?`;
    return new Promise((resolve, reject) => {
      db.all(sql, [id], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }

  static async getFriendList(id) {
    const sql = `SELECT id, name FROM users WHERE id IN (SELECT following_id FROM following WHERE user_id = ?)`;
    return new Promise((resolve, reject) => {
      db.all(sql, [id], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }
}

module.exports = User;