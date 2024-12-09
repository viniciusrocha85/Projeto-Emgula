const pool = require('../config/database');
const bcrypt = require('bcrypt');

const Usuario = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT id, email FROM Usuarios');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await pool.query('SELECT id, email FROM Usuarios WHERE id = ?', [id]);
    return rows[0];
  },
  getByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
    return rows[0];
  },
  create: async (data) => {
    const [result] = await pool.query(
      'INSERT INTO Usuarios (email, senha) VALUES (?, ?)',
      [data.email, data.senha]
    );
    console.log('Resultado do INSERT:', result);
    return result;
  },
};

module.exports = Usuario;