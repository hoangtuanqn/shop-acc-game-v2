import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import path from "path";

interface TemplateVariables {
    subject: string;
    recipient_name: string;
    main_content_html: string;
    sub_content_html: string;
    cta_text: string;
    url: string;
    year?: string;
}

interface SendMailParams extends TemplateVariables {
    to: string;
}

class Mailer {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false, // 587: false, 465: true
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    private replaceTemplateVariables(htmlContent: string, variables: Record<string, string | undefined>): string {
        let output = htmlContent;
        for (const key in variables) {
            if (Object.prototype.hasOwnProperty.call(variables, key)) {
                const regex = new RegExp(`{{${key}}}`, "g");
                const value = variables[key] || "";
                output = output.replace(regex, value);
            }
        }
        return output;
    }

    public async sendMail(params: SendMailParams): Promise<void> {
        const { to, subject, ...templateVars } = params;

        const templatePath = path.join("src", "templates", "common.html");

        let templateHtml: string;
        try {
            templateHtml = fs.readFileSync(templatePath, "utf8");
        } catch (error) {
            throw new Error("Không thể tìm thấy hoặc đọc file template email.");
        }

        const allVariables: Record<string, string | undefined> = {
            ...templateVars,
            appName: process.env.APP_NAME,
            homepage_link: process.env.CLIENT_URL || "",
            subject: subject,
            year: new Date().getFullYear().toString(),
        };

        const finalHtml = this.replaceTemplateVariables(templateHtml, allVariables);

        await this.transporter.sendMail({
            from: process.env.APP_NAME,
            to,
            subject,
            html: finalHtml,
        });

        // console.log("Message sent: %s", info.messageId);
    }
}

const mailer = new Mailer();
export default mailer;
