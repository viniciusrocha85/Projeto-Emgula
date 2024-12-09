const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuariosModel');

const SECRET_KEY = process.env.JWT_SECRET;

exports.registerUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log("Requisição de cadastro recebida:", { email });

    if (!email || !senha) {
      console.error("Erro: Dados incompletos fornecidos");
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    console.log("Senha criptografada com sucesso:");

    const result = await Usuario.create({ email, senha: hashedPassword });
    console.log("Usuário criado com sucesso no banco de dados:", result);

    res.status(201).json({ id: result.insertId, email });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email já está em uso" });
    }
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};


exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log("Requisição de login recebida:", { email });

    const usuario = await Usuario.getByEmail(email);
    if (!usuario) {
      console.warn("Usuário não encontrado:", email);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    console.log("Usuário encontrado:", usuario);

    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
    if (!isPasswordValid) {
      console.warn("Senha incorreta para o usuário:", email);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, { expiresIn: "1h" });
    console.log("Token gerado com sucesso:", token);

    res.status(200).json({ message: "Login bem-sucedido", token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};


exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Nenhum token fornecido' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.userId = decoded.id;
    next();
  });
};
