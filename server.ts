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
    const { name, email, phone, message } = req.body;

    // Configure your email transport here
    // For Gmail, you'd typically use an App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g., wiseassessoriademarketing@gmail.com
        pass: process.env.EMAIL_PASS  // App Password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'wiseassessoriademarketing@gmail.com',
      subject: `Novo Lead: ${name}`,
      text: `
        Nome: ${name}
        E-mail: ${email}
        Telefone: ${phone}
        Mensagem: ${message}
      `,
      html: `
        <h3>Novo Lead Capturado</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
      `
    };

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials not set. Skipping email send.");
        return res.status(200).json({ message: "Lead saved (email skipped due to missing config)" });
      }

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
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
