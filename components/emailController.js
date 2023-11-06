const databaseConn = require("../db");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
exports.validateEmailInput = [
  // Defina as regras de validação aqui usando express-validator
  check("nome").notEmpty().withMessage('O campo "nome" não pode estar vazio'),
  check("email").isEmail().withMessage("Formato de email inválido"),
  check("telefone")
    .notEmpty()
    .withMessage('O campo "telefone" não pode estar vazio'),
  check("content").isArray().withMessage('O campo "content" deve ser um array'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
// Função auxiliar para iniciar uma transação no banco de dados
async function beginTransaction(db) {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Função auxiliar para fazer o commit de uma transação no banco de dados
async function commitTransaction(db) {
  return new Promise((resolve, reject) => {
    db.commit((err) => {
      if (err) {
        db.rollback(() => {
          reject(err);
        });
      } else {
        resolve();
      }
    });
  });
}

// Função auxiliar para inserção no banco de dados dentro de uma transação
async function insertDataIntoDatabase(db, nome, email, telefone, content) {
  return new Promise((resolve, reject) => {
    const newContent = content.join(" , ");
    const sql =
      "INSERT INTO `decorfab_teste`.`email_teste` (nome, email_cliente, telefone_cliente, content) VALUES (?, ?, ?, ?)";
    const values = [nome, email, telefone, newContent];

    db.query(sql, values, (err, result) => {
      if (err) {
        db.rollback(() => {
          reject(err);
        });
      } else {
        resolve(result);
      }
    });
  });
}

// Função auxiliar para envio de e-mail
async function sendEmail(nome, email, telefone, content) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_USER,
    subject: "Novo Cliente em Contato",
    text: `Cliente: ${nome}. Email: ${email}; Telefone: ${telefone} deseja contratar os serviços ${content} da CodeCase. Entre em contato!`,
  };

  try {
    // Tente enviar o e-mail
    await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso");
  } catch (emailError) {
    console.error("Erro ao enviar e-mail:", emailError);
    throw new Error("Erro ao enviar e-mail");
  }
}

exports.Email = async (req, res, next) => {
  const db = databaseConn();

  try {
    const { nome, email, telefone, content } = req.body;

    await beginTransaction(db); // Iniciar a transação no banco de dados

    await insertDataIntoDatabase(db, nome, email, telefone, content); // Inserir dados na tabela dentro da transação

    await sendEmail(nome, email, telefone, content); // Enviar o e-mail

    await commitTransaction(db); // Confirmar a transação no banco de dados

    res.status(200).json({ message: "Dados inseridos com sucesso" });
  } catch (error) {
    console.error("Erro no controller:", error);
    db.rollback(() => {
      res.status(500).json({ error: "Erro interno do servidor" });
    });
  } finally {
    db.end();
  }
};
