const connection = require("../config/database");

class ModelGroupMembers {
  // Mengambil semua data dari tabel groupmembers
  static async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT gm.id_group, g.nama_group, gm.id_users, u.nama_users, gm.id_posisi, p.nama_posisi
        FROM groupmembers gm
        JOIN users u ON gm.id_users = u.id_users
        JOIN posisi p ON gm.id_posisi = p.id_posisi
        JOIN \`group\` g ON gm.id_group = g.id_group
        ORDER BY gm.id_group DESC
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

  // Menyimpan data baru ke tabel groupmembers
  static async Store(data) {
    return new Promise((resolve, reject) => {
      try {
        // Jika posisi yang akan ditambahkan adalah ketua (id_posisi = 1)
        if (data.id_posisi === 1) {
          // Cek apakah sudah ada ketua di grup yang sama
          const checkQuery = "SELECT COUNT(*) AS count FROM groupmembers WHERE id_group = ? AND id_posisi = 1";
          connection.query(checkQuery, [data.id_group], (err, result) => {
            if (err) {
              return reject(err);
            } else if (result[0].count > 0) {
              // Jika sudah ada ketua, tampilkan error
              return reject(new Error('Group ini sudah memiliki posisi ketua'));
            } else {
              // Jika belum ada ketua, lakukan insert untuk posisi ketua
              const insertQuery = "INSERT INTO groupmembers SET ?";
              connection.query(insertQuery, data, (err, result) => {
                if (err) {
                  return reject(err);
                } else {
                  return resolve(result);
                }
              });
            }
          });
        } else {
          // Jika bukan posisi ketua, langsung lakukan insert tanpa pengecekan
          const insertQuery = "INSERT INTO groupmembers SET ?";
          connection.query(insertQuery, data, (err, result) => {
            if (err) {
              return reject(err);
            } else {
              return resolve(result);
            }
          });
        }
      } catch (error) {
        return reject(error);
      }
    });
  }
  
  

  // Mengambil data dari tabel groupmembers berdasarkan id_group
  static async getId(id_group) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT gm.id_group, g.nama_group, gm.id_users, u.nama_users, gm.id_posisi, p.nama_posisi
        FROM groupmembers gm
        JOIN users u ON gm.id_users = u.id_users
        JOIN posisi p ON gm.id_posisi = p.id_posisi
        JOIN \`group\` g ON gm.id_group = g.id_group
        WHERE gm.id_group = ?
      `;
      connection.query(query, [id_group], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Memperbarui data di tabel groupmembers berdasarkan id_group
  static async Update(id_group, data) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE groupmembers SET ? WHERE id_group = ?";
      connection.query(query, [data, id_group], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Menghapus data dari tabel groupmembers berdasarkan id_group
  static async Delete(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM groupmembers WHERE id_users = ?";
      connection.query(query, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getUsersBelumGroup() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.id_users, u.nama_users, r.nama_role
        FROM users u
        LEFT JOIN groupmembers gm ON u.id_users = gm.id_users
        JOIN role r ON u.id_role = r.id_role
        WHERE gm.id_users IS NULL AND u.id_role <> 1
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

    // Mengambil anggota berdasarkan id_group
    static getMembersByGroup(id_group) {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT gm.*, u.nama_users, g.nama_group, p.nama_posisi 
          FROM groupmembers gm
          JOIN users u ON gm.id_users = u.id_users
          JOIN \`group\` g ON gm.id_group = g.id_group
          JOIN posisi p ON gm.id_posisi = p.id_posisi
          WHERE gm.id_group = ?
        `;
        connection.query(query, [id_group], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
}

module.exports = ModelGroupMembers;
