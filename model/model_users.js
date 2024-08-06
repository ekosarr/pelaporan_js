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

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM users WHERE id_users = ?", id, (err, rows) => {
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
}

module.exports = ModelUsers;
