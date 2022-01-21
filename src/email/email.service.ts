import {Injectable} from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import SMTPTransport, {TransportOptions} from "nodemailer";

@Injectable()
export class MailService {
    private transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        } as SMTPTransport.TransportOptions);
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Aктивация аккаунта" + process.env.API_URL,
            text: "",
            html:
                `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href=${link}>${link}<a/>
            </div>
            `
        })
    }

    async sendSecreteNumbers(to, randomString: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Восстановление пароля" + process.env.API_URL,
            text: "",
            html:
                `
            <div>
                <h1>Восстановление пароля</h1>
                <div>Для восстановления пароля введите символы в соответствующем поле на сайте</div>
                <h2>${randomString}</h2>
                <div>Если вы не запрашивали изменение пароля просто проигнорируйте это письмо</div>
            </div>
            `
        })
    }
}
