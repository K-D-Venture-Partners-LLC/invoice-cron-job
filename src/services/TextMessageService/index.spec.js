const TextMessageService = require('.')

describe('when sending a text message to a remindee', () => {
  const OLD_ENV = process.env
  let message
  let mockClient

  beforeAll(() => {
    jest.resetModules()

    mockClient = {
      messages: {
        create: jest.fn()
      }
    }
    message = 'Hello, World!'

    process.env = {
      REMINDEE_NUMBER: '+18015551234',
      TWILIO_NUMBER: '+18019872345',
      ...OLD_ENV
    }

    new TextMessageService(mockClient).textRemindee(message)
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('should send a text message using the text message client', () => {
    expect(mockClient.messages.create).toHaveBeenCalledWith({
      to: process.env.REMINDEE_NUMBER,
      from: process.env.TWILIO_NUMBER,
      body: message
    })
  })
})

describe('when no client is passed in', () => {
  let textMessageService

  it('should use the twilio client', () => {
    textMessageService = new TextMessageService()

    expect(textMessageService.client).toEqual(require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN))
  })
})
