import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Contact Form Email
  app.post("/api/contact", async (req, res) => {
    console.log("Contact form request received:", req.body);
    const { name, email, phone, message } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("CRITICAL: EMAIL_USER or EMAIL_PASS environment variables are missing.");
      return res.status(500).json({ error: "Server configuration error: Email credentials missing." });
    }

    if ((process.env.EMAIL_USER || '').trim() !== 'wiseassessoriademarketing@gmail.com') {
      console.warn(`WARNING: EMAIL_USER is set to ${(process.env.EMAIL_USER || '').trim()}, but expected wiseassessoriademarketing@gmail.com`);
    }

    if (process.env.EMAIL_PASS && (process.env.EMAIL_PASS || '').replace(/\s/g, '').length !== 16) {
      console.warn(`WARNING: EMAIL_PASS length is ${(process.env.EMAIL_PASS || '').replace(/\s/g, '').length}, but expected 16 characters (Gmail App Password).`);
    }

    const trimmedUser = (process.env.EMAIL_USER || '').trim();
    const trimmedPass = (process.env.EMAIL_PASS || '').replace(/\s/g, '');

    const expectedEmail = 'wiseassessoriademarketing@gmail.com';
    if (trimmedUser !== expectedEmail) {
      console.warn(`WARNING: EMAIL_USER typo detected. Current: ${trimmedUser}, Expected: ${expectedEmail}`);
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: trimmedUser,
        pass: trimmedPass
      }
    });

    const mailOptions = {
      from: `"${name}" <${trimmedUser}>`,
      to: 'wiseassessoriademarketing@gmail.com',
      replyTo: email,
      subject: `Wise Marketing - Contato de ${name}`,
      text: `Mensagem de ${name}:\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Nova Mensagem de Contato</h2>
          <p style="font-size: 16px;"><strong>Nome:</strong> ${name}</p>
          <p style="font-size: 16px;"><strong>E-mail:</strong> ${email}</p>
          <p style="font-size: 16px;"><strong>Telefone:</strong> ${phone}</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="font-weight: bold; margin-bottom: 10px;">Mensagem:</p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
            Este é um e-mail automático enviado pelo formulário do seu site.
          </p>
        </div>
      `
    };

    try {
      console.log(`Attempting to send email...`);
      console.log(`- User: ${trimmedUser.substring(0, 3)}...${trimmedUser.split('@')[1]}`);
      console.log(`- Pass: ${trimmedPass.substring(0, 2)}... (Length: ${trimmedPass.length})`);
      
      await transporter.sendMail(mailOptions);
      console.log("SUCCESS: Email sent successfully.");
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error: any) {
      console.error("NODEMAILER ERROR:", error);
      
      let userFriendlyMessage = "Falha ao enviar e-mail.";
      if (error.message?.includes('535-5.7.8')) {
        let typoWarning = "";
        if (trimmedUser !== expectedEmail) {
          typoWarning = `\n\n⚠️ ERRO DE DIGITAÇÃO NO E-MAIL:\nO e-mail configurado está com um erro: ${trimmedUser}\nO correto é: ${expectedEmail}\n(Verifique os dois 's' em 'assessoria')`;
        }
        userFriendlyMessage = `ERRO DE AUTENTICAÇÃO: O Google rejeitou sua senha.${typoWarning}\n\nO servidor está tentando usar:\nE-mail: ${trimmedUser}\nSenha começa com: ${trimmedPass.substring(0, 4)}...\n\nSe isso não estiver correto, atualize os 'Secrets' com a Senha de App de 16 caracteres.`;
      } else if (error.code === 'EAUTH') {
        userFriendlyMessage = "ERRO DE LOGIN: Verifique se o e-mail e a senha de app estão corretos nos 'Secrets'.";
      }
      
      res.status(500).json({ 
        error: userFriendlyMessage, 
        details: error.message || String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
