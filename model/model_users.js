const connection = require("../config/database");

class ModelUsers {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT *, b.nama_role FROM users as a
      join role as b on b.id_role = a.id_role
       ORDER BY id_users DESC`,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async getAnggota() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT *, b.nama_role FROM users as a
         JOIN role as b ON b.id_role = a.id_role
         WHERE a.id_role != 1
         ORDER BY id_users DESC`,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT *, b.nama_role FROM users as a
         JOIN role as b ON b.id_role = a.id_role
         WHERE id_users = ?`,
        [id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  

  static async getByRoleBelumGroup(roleId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.id_users, u.nama_users, r.nama_role
        FROM users u
        LEFT JOIN groupmembers gm ON u.id_users = gm.id_users
        JOIN role r ON u.id_role = r.id_role
        WHERE u.id_role = ? 
        AND gm.id_users IS NULL 
        AND u.id_role <> 1
      `;
      connection.query(query, [roleId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
   
  

  static async store(data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO users SET ?", data, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async login(email) {
    return new Promise((resolve, reject) => {
      connection.query("select * from users where email = ?", [email], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query("UPDATE users SET ? WHERE id_users = ?", [data, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM users WHERE id_users = ?", id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async searchUsers(query) {
    const [users] = await db.query("SELECT * FROM users WHERE nama_users LIKE ?", [`%${query}%`]);
    return users;
  }

  static async searchByName(query) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE nama_users LIKE ?";
      connection.query(sql, [`%${query}%`], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }

  static async getByRole(id_role) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT *, b.nama_role FROM users as a
         JOIN role as b ON b.id_role = a.id_role
         WHERE a.id_role = ?
         ORDER BY id_users DESC`,
        [id_role],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  

}

module.exports = ModelUsers;
