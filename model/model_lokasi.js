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
      

    static async getKejadianById(userId) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT kejadian FROM users WHERE id = ?", [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getByKejadian(kejadianArray) {
    return new Promise((resolve, reject) => {
      // Gunakan `IN (?)` untuk mencocokkan array nilai kejadian
      const query = 'SELECT * FROM lokasi WHERE kejadian IN (?)';
      connection.query(query, [kejadianArray], (err, rows) => {
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
