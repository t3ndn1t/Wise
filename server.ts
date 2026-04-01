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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: 'wiseassessoriademarketing@gmail.com',
      replyTo: email,
      subject: name, // User requested name on the title
      text: message, // User requested description as the body
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #f97316;">Nova Mensagem de Contato</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensagem:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    };

    try {
      console.log("Attempting to send email...");
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully to wiseassessoriademarketing@gmail.com");
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Nodemailer Error:", error);
      res.status(500).json({ error: "Failed to send email", details: error instanceof Error ? error.message : String(error) });
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
