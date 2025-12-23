import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import {
  containsSuspiciousPatterns,
  createSecureEmailHtml,
  createSecureEmailText,
  isHoneypotTriggered,
  sanitizeEmail,
  sanitizeHtml,
} from "@/lib/security";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  // Honeypot fields (should be empty)
  website?: string; // Classic honeypot
  formLoadedAt?: number; // Timing-based anti-bot
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, message, website, formLoadedAt } = body;

    // ========================================
    // Security Check 1: Honeypot validation
    // ========================================
    if (isHoneypotTriggered(website)) {
      // Log suspicious activity but return success to not reveal detection
      console.warn("[Security] Honeypot triggered - possible bot", {
        ip: request.headers.get("x-forwarded-for"),
        userAgent: request.headers.get("user-agent"),
      });
      // Return fake success to confuse bots
      return NextResponse.json({ success: true, message: "Email enviado com sucesso" });
    }

    // ========================================
    // Security Check 2: Timing validation
    // ========================================
    if (formLoadedAt) {
      const timeTaken = Date.now() - formLoadedAt;
      const MIN_TIME_MS = 2000; // 2 seconds minimum

      if (timeTaken < MIN_TIME_MS) {
        console.warn("[Security] Form submitted too fast - possible bot", {
          timeTaken,
          ip: request.headers.get("x-forwarded-for"),
        });
        return NextResponse.json({ success: true, message: "Email enviado com sucesso" });
      }
    }

    // ========================================
    // Security Check 3: Basic validation
    // ========================================
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    // ========================================
    // Security Check 4: Length validation
    // ========================================
    const MAX_NAME_LENGTH = 100;
    const MAX_EMAIL_LENGTH = 254;
    const MAX_MESSAGE_LENGTH = 5000;

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: "Um ou mais campos excedem o tamanho máximo permitido" },
        { status: 400 }
      );
    }

    // ========================================
    // Security Check 5: Email validation
    // ========================================
    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // ========================================
    // Security Check 6: Suspicious patterns
    // ========================================
    if (containsSuspiciousPatterns(name) || containsSuspiciousPatterns(message)) {
      console.warn("[Security] Suspicious patterns detected", {
        ip: request.headers.get("x-forwarded-for"),
        name: name.substring(0, 50),
      });
      return NextResponse.json({ error: "Conteúdo inválido detectado" }, { status: 400 });
    }

    // ========================================
    // Sanitize inputs for email
    // ========================================
    const safeName = sanitizeHtml(name.trim());
    const safeMessage = sanitizeHtml(message.trim());

    // ========================================
    // Configure SMTP transporter
    // ========================================
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // ========================================
    // Send email with sanitized content
    // ========================================
    const mailOptions = {
      from: `"TaskScribe Landing Page" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      replyTo: sanitizedEmail,
      subject: `Novo contato da Landing Page - ${safeName}`,
      html: createSecureEmailHtml(safeName, sanitizedEmail, safeMessage),
      text: createSecureEmailText(safeName, sanitizedEmail, safeMessage),
    };

    await transporter.sendMail(mailOptions);

    console.log("[Contact] Email sent successfully", {
      from: sanitizedEmail,
      name: safeName.substring(0, 30),
    });

    return NextResponse.json({
      success: true,
      message: "Email enviado com sucesso",
    });
  } catch (error) {
    console.error("[Contact] Error sending email:", error);
    return NextResponse.json(
      {
        error: "Erro ao enviar email",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}
