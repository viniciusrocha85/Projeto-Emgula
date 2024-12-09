require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/usuariosRoutes');
const pool = require('./config/database');

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    console.log('Teste de conexão bem-sucedido:', rows[0].resultado);
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    process.exit(1);
  }
})();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
