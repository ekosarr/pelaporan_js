const { Store } = require("express-session");
const connection = require("../config/database");

class ModelRole {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query("select * from role order by id_role desc", (err, rows) => {
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
      connection.query("insert into role set ?", Data, function (err, result) {
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
      connection.query("select * from role where id_role = " + id, (err, rows) => {
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
      connection.query("update role set ? where id_role = " + id, Data, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async countByRole(roleId) {
    return new Promise((resolve, reject) => {
      // Misalnya, kita asumsikan ada tabel `users` dengan kolom `id_role`
      connection.query(
        "SELECT COUNT(*) AS count FROM users WHERE id_role = ?",
        [roleId],
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

  static async Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query("delete from role where id_role =" + id, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = ModelRole;
