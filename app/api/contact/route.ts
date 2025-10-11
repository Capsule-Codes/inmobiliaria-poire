import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAdminConfig } from '@/domain/Config';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, subject, propertyTitle } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Obtener el email de la inmobiliaria desde la configuración
    const config = await getAdminConfig();
    const companyEmail = config.companyEmail || 'info@inmobiliaria.com';

    const emailSubject = subject || 'Nueva consulta desde el sitio web';
    const propertyInfo = propertyTitle ? `<p><strong>Propiedad/Emprendimiento:</strong> ${propertyTitle}</p>` : '';

    const data = await resend.emails.send({
      from: 'Inmobiliaria <onboarding@resend.dev>',
      to: [companyEmail], // Email de la inmobiliaria
      replyTo: email, // Email del cliente para que puedan responder fácilmente
      subject: emailSubject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
              .info-block { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
              .info-block p { margin: 5px 0; }
              strong { color: #2c3e50; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Nueva Consulta Recibida</h2>
              <div class="info-block">
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Teléfono:</strong> <a href="tel:${phone}">${phone}</a></p>
                ${propertyInfo}
              </div>
              ${message ? `
              <div class="info-block">
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
              </div>
              ` : ''}
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error al enviar el email', details: error.message },
      { status: 500 }
    );
  }
}
