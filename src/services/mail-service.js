const sendgrid  = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    send(to, subject, body) {
        let msg = {
            to: to,
            from: 'test@example.com',
            subject: subject,
            html: body
        }
        
        sendgrid.send(msg);
    }
}