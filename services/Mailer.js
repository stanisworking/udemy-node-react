const sendgrid = require('sendgrid');
const helper = sendgrid.mail;

const key = require('../config/keys');

class Mailer extends helper.Mail {
    constructor({ subject, recipients }, content) {
        super();

        this.sgApi = sendgrid(key.sendGridKey);
        this.from_email = new helper.Email('stanley.haryoto@gmail.com');
        this.subject = subject;
        this.body = new helper.Content('text/html', content);
        this.recipients = this.formatAddresses(recipients);

        console.log('>>> Test here 1');

        this.addContent(this.body);
        console.log('>>> Test here 2');

        this.addClickTracking();

        console.log('>>> Test here 3');
        this.addRecipients();

        console.log('>>> Test here 4');

    }

    formatAddresses(recipients) {
        return recipients.map(({ email }) => {
            return new helper.Email(email);
        });
    }

    addClickTracking() {
        const trackingSettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true, true);
        
        trackingSettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSettings);
    }

    addRecipients() {
        const personalize = new helper.Personalization();
        this.recipients.forEach(recipient => personalize.addTo(recipient));
        this.addPersonalization(personalize);
    }

    async send() {
        const request = this.sgApi.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: this.toJSON()
        });

        const response = this.sgApi.API(request);
        return response;
    }
}

module.exports = Mailer;