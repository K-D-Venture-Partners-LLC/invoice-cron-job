module.exports = class TextMessageService {
  constructor(textMessageClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)) {
    this.client = textMessageClient
  }

  textRemindee(message) {
    return this.client.messages.create({
      to: process.env.REMINDEE_NUMBER,
      from: process.env.TWILIO_NUMBER,
      body: message
    })
  }
}
