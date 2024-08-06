const { Store } = require("express-session");
const connection = require("../config/database");

class ModelGroup {
    static async getAll() {
        return new Promise((resolve, reject) => {
          const query = `
            SELECT g.id_group, g.nama_group, r.id_role, r.nama_role
            FROM \`group\` g
            JOIN role r ON g.id_role = r.id_role
            ORDER BY g.id_group DESC
          `;
          connection.query(query, (err, rows) => {
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
      connection.query("insert into `group` set ?", Data, function (err, result) {
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
      const query = `
        SELECT g.id_group, g.nama_group, r.id_role, r.nama_role
        FROM \`group\` g
        JOIN role r ON g.id_role = r.id_role
        WHERE g.id_group = ?
      `;
      connection.query(query, [id], (err, rows) => {
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
      connection.query("update `group` set ? where id_group = " + id, Data, function (err, result) {
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
      connection.query("delete from `group` where id_group =" + id, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async countByGroup(groupId) {
    return new Promise((resolve, reject) => {
      // Misalnya, kita asumsikan ada tabel `users` dengan kolom `id_role`
      connection.query(
        "SELECT COUNT(*) AS count FROM groupmembers WHERE id_group = ?",
        [groupId],
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

module.exports = ModelGroup;
