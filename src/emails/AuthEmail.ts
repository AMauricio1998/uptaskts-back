import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user : IEmail) => {
        await transporter.sendMail({
            from: 'UpTask <uptask@admin.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `
                <p>Hola ${user.name}, has creado tu cuenta de UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="">Confirmar tu cuenta</a>
                <p>E ingrese el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        });
    }
}