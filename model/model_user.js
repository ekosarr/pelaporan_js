const connection = require("../config/database");

class ModelUser {
    static async getAll() {
        return new Promise((resolve, reject) => {
          connection.query("SELECT * FROM user", (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      }
      

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user WHERE id = ?", id, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getKejadianByUserId(id) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT kejadian FROM user WHERE id = ?", [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows); // Pastikan ini mengembalikan array
        }
      });
    });
  }

  static async login(username) {
    return new Promise((resolve, reject) => {
      connection.query("select * from user where username = ?", [username], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

}

module.exports = ModelUser;
