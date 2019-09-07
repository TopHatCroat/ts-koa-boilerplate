const sgMail = require("@sendgrid/mail");

import { config } from "../config";

function isEmailSenderConfigured() {
    return config.sendGridKey === undefined || config.emailFrom === undefined;
}

if (isEmailSenderConfigured()) {
    sgMail.setApiKey(config.sendGridKey);
}

export default class EmailSender {
    private async sendEmail(receiver: string | string[], subject: string, html: string) {
        if (isEmailSenderConfigured()) {
            return Promise.resolve();
        }

        const msg = {
            to: receiver,
            from: config.emailFrom,
            subject,
            html,
        };

        await sgMail.sendMultiple(msg);
    }

    public async sendInvitation(receiver: string, confirmation: string) {
        const content = `<html>
                        <body>
                            <h1>You are special</h1>
                            <p>This is your invitation code: ${confirmation}</p>
                        </body>
                    </html>`;

        await this.sendEmail(receiver, "You have been invited to a conference", content);
    }
}
