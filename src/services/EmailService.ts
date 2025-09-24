import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export class EmailService {
    static async sendOtpEmail(to: string, otp: string): Promise<void> {
        const fromEmail = process.env.SENDGRID_FROM_EMAIL;
        if (!fromEmail) {
            throw new Error('O e-mail do remetente não está configurado.');
        }

        const msg = {
            to: to,
            from: {
                email: fromEmail,
                name: 'Equipe Roofly'
            },
            subject: 'Seu Código de Verificação Roofly',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Verificação de E-mail Roofly</h2>
                    <p>Olá,</p>
                    <p>Obrigado por se registrar na Roofly. Por favor, use o código de verificação abaixo para completar seu cadastro:</p>
                    <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px;">${otp}</h3>
                    <p>Este código é válido por 5 minutos.</p>
                    <p>Se você não solicitou este código, por favor, ignore este e-mail.</p>
                    <p>Atenciosamente,</p>
                    <p>Equipe Roofly</p>
                </div>
            `,
        };

        try {
            await sgMail.send(msg);
        } catch (error: any) {
            throw new Error('Falha ao enviar e-mail de verificação.');
        }
    }
}