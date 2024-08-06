const { Store } = require("express-session");
const connection = require("../config/database");

class ModelPosisi {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query("select * from posisi order by id_posisi desc", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async Store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("insert into posisi set ?", Data, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query("select * from posisi where id_posisi = " + id, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async Update(id, Data) {
    return new Promise((resolve, reject) => {
      connection.query("update posisi set ? where id_posisi = " + id, Data, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query("delete from posisi where id_posisi =" + id, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async countByPosisi(posisiId) {
    return new Promise((resolve, reject) => {
      // Misalnya, kita asumsikan ada tabel `users` dengan kolom `id_role`
      connection.query(
        "SELECT COUNT(*) AS count FROM groupmembers WHERE id_posisi = ?",
        [posisiId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0].count);
          }
        }
      );
    });
  }

}

module.exports = ModelPosisi;
