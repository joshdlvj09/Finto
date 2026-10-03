// =======================================================
// ENVÍO DE CORREOS (SMTP con nodemailer)
// Funciona con Gmail, Outlook, Resend, etc. según las variables SMTP_* del .env
// Si no hay SMTP configurado, el correo se muestra en la consola (modo desarrollo)
// =======================================================

const nodemailer = require('nodemailer');

const smtpConfigurado = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = smtpConfigurado
    ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: (Number(process.env.SMTP_PORT) || 465) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    : null;

// Convierte caracteres especiales en texto seguro para HTML. El nombre lo escribe el usuario,
// así que sin esto alguien podría meter enlaces o etiquetas en los correos que envía Finto.
const escaparHtml = (texto) =>
    String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Plantilla con la identidad de Finto (negro y dorado) para cualquier correo con código
const enviarCodigo = async ({ email, nombre, codigo, asunto, mensaje }) => {
    const nombreSeguro = escaparHtml(nombre);

    if (!transporter) {
        console.log(`📧 [SIN SMTP] ${asunto} -> ${email}: ${codigo}`);
        return;
    }

    await transporter.sendMail({
        from: process.env.MAIL_FROM || `Finto <${process.env.SMTP_USER}>`,
        to: email,
        subject: asunto,
        text: `Hola ${nombre}, ${mensaje}: ${codigo}. Expira en 15 minutos. Si no lo pediste, ignora este correo.`,
        html: `
            <div style="font-family: Arial, sans-serif; background: #000; padding: 30px; color: #E3D5BB;">
                <h1 style="color: #A07F3A; font-weight: normal; margin: 0 0 20px;">Finto</h1>
                <p>Hola ${nombreSeguro},</p>
                <p>${mensaje}:</p>
                <div style="background: #141414; border: 1px solid #A07F3A; padding: 15px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <span style="color: #C8AA6F; font-size: 32px; letter-spacing: 8px; font-weight: bold;">${codigo}</span>
                </div>
                <p style="font-size: 12px; color: #7A7468;">Expira en 15 minutos. Si no lo pediste, puedes ignorar este correo.</p>
            </div>
        `,
    });
};

exports.enviarCodigoRecuperacion = (email, nombre, codigo) =>
    enviarCodigo({
        email,
        nombre,
        codigo,
        asunto: 'Tu código para restablecer tu contraseña de Finto',
        mensaje: 'usa este código para restablecer tu contraseña',
    });

exports.enviarCodigoVerificacion = (email, nombre, codigo) =>
    enviarCodigo({
        email,
        nombre,
        codigo,
        asunto: 'Confirma tu correo para crear tu cuenta de Finto',
        mensaje: 'usa este código para confirmar tu correo y terminar de crear tu cuenta',
    });
