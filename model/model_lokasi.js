const connection = require("../config/database");

class ModelLokasi {
    static async getAll() {
        return new Promise((resolve, reject) => {
          connection.query("SELECT * FROM lokasi", (err, rows) => {
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
      connection.query("SELECT * FROM users WHERE id_users = ?", id, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

}

module.exports = ModelLokasi;
