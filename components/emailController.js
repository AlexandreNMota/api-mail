const db = require("../db");
const nodemailer = require("nodemailer");

exports.Email = async (req, res, next) => {
  try {
    const { nome, email, telefone, content } = req.body;
    newContent = content.join(" , ");
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      throw new Error("Formato de email inválido");
    }
    const sql =
      "INSERT INTO `decorfab_teste`.`email_teste` (nome, email_cliente, telefone_cliente, content) VALUES (?, ?, ?, ?)";
    const values = [nome, email, telefone, newContent];

    const queryPromise = () => {
      return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const result = await queryPromise();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Novo Cliente em Contato",
      text: `Cliente: ${nome}. Email: ${email}; Telefone: ${telefone} deseja contratar os serviços ${newContent} da CodeCase. Entre em contato!`,
    };

    try {
      // Tente enviar o e-mail
      await transporter.sendMail(mailOptions);
      console.log("E-mail enviado com sucesso");
    } catch (emailError) {
      console.error("Erro ao enviar e-mail:", emailError);
      throw new Error("Erro ao enviar e-mail");
    }

    res.status(200).json({ message: "Dados inseridos com sucesso" });
  } catch (error) {
    console.error("Erro na inserção de dados no MySQL:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
