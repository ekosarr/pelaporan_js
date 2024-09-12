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

}

module.exports = ModelUser;
