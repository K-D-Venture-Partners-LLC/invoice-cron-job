const moment = require('moment-mini')
const InvoiceCronJob = require('.')

let invoiceCronJob
let mockTextMessageService

beforeAll(() => {
  mockTextMessageService = {
    textRemindee: jest.fn().mockResolvedValue()
  }

  invoiceCronJob = new InvoiceCronJob(undefined, mockTextMessageService)
})

describe('when getting the date to send an invoice, and passing in a non-moment pay date', () => {
  it('should throw an error', () => {
    expect(() => invoiceCronJob.getInvoiceDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the date to send an invoice', () => {
  it('should return a date occurring one week before', () => {
    const invoiceDate = invoiceCronJob.getInvoiceDate(moment('2020-10-30')).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual('2020-10-23')
  })
})

describe('when getting the date in the middle of the month, and passing in a non-moment pay date', () => {
  it('should throw an error', () => {
    expect(() => invoiceCronJob.getMidMonthDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the date in the middle of the month', () => {
  it('should return a date on the 15th of the same month and year', () => {
    const invoiceDate = invoiceCronJob.getMidMonthDate(moment('2020-10-30')).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual('2020-10-15')
  })
})

describe('when getting the date in the middle of the month, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => invoiceCronJob.getMidMonthDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the date in the middle of the month', () => {
  it('should return a date on the 15th of the same month and year', () => {
    const invoiceDate = invoiceCronJob.getMidMonthDate(moment('2020-10-30')).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual('2020-10-15')
  })
})

describe('when getting the date at the end of the month, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => invoiceCronJob.getEndOfMonthDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the date at the end of the month', () => {
  it('should return the last date of the same month and year', () => {
    const invoiceDate = invoiceCronJob.getEndOfMonthDate(moment('2020-10-30')).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual('2020-10-31')
  })
})

describe('when getting the closest business date, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => invoiceCronJob.getClosestBusinessDate('2020-11-15')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the closest business date', () => {
  it.each([
    [ '2020-11-15', '2020-11-13' ],
    [ '2020-10-31', '2020-10-30' ],
    [ '2017-01-01', '2016-12-30' ],
    [ '2020-03-01', '2020-02-28' ],
    [ '2020-02-29', '2020-02-28' ]
  ])('should return the closest business date to %i', (date, closestBusinessDate) => {
    const invoiceDate = invoiceCronJob.getClosestBusinessDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(closestBusinessDate)
  })
})

describe('when getting the next pay date, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => invoiceCronJob.findNextPayDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the next pay date from a date that is before the middle of the month', () => {
  it.each([ [ '2020-11-01', '2020-11-13' ], [ '2020-10-13', '2020-10-15' ] ])('should return the closest business date to %i', (date, nextPayDate) => {
    const invoiceDate = invoiceCronJob.findNextPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(nextPayDate)
  })
})

describe('when getting the next pay date from a date that is after the middle of the month and before the end of the month', () => {
  it.each([ [ '2020-11-13', '2020-11-30' ], [ '2020-10-23', '2020-10-30' ] ])('should return the closest business date to %i', (date, nextPayDate) => {
    const invoiceDate = invoiceCronJob.findNextPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(nextPayDate)
  })
})

describe('when getting the next pay date from a date that is after the end of the month', () => {
  it.each([ [ '2020-10-30', '2020-11-13' ], [ '2020-10-31', '2020-11-13' ], [ '2020-02-28', '2020-03-13' ] ])('should return the closest business date to %i', (date, nextPayDate) => {
    const invoiceDate = invoiceCronJob.findNextPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(nextPayDate)
  })
})

describe('when getting the previous pay date, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => invoiceCronJob.findPreviousPayDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the previous pay date from a date that is before the middle of the month pay day', () => {
  it.each([ [ '2020-11-13', '2020-10-30' ], [ '2020-10-15', '2020-09-30' ] ])('should return the closest business date to %i', (date, previousPayDate) => {
    const invoiceDate = invoiceCronJob.findPreviousPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(previousPayDate)
  })
})

describe('when getting the previous pay date from a date that is after the middle of the month pay day and before the end of the month pay day', () => {
  it.each([ [ '2020-11-15', '2020-11-13' ], [ '2020-10-23', '2020-10-15' ] ])('should return the closest business date to %i', (date, previousPayDate) => {
    const invoiceDate = invoiceCronJob.findPreviousPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(previousPayDate)
  })
})

describe('when getting the previous pay date from a date that is after the end of the month pay day', () => {
  it.each([ [ '2020-10-31', '2020-10-30' ], [ '2020-02-29', '2020-02-28' ] ])('should return the closest business date to %i', (date, previousPayDate) => {
    const invoiceDate = invoiceCronJob.findPreviousPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(previousPayDate)
  })
})

describe('when building the text message reminder', () => {
  it('should return the reminder text', () => {
    expect(invoiceCronJob.buildTextMessageReminder(
      moment('2020-11-06'),
      moment('2020-10-30T00:00:00-06:00'),
      moment('2020-11-05T23:59:59-07:00')
    )).toEqual('Hello! Today is 11/06/2020. This is a reminder that it\'s time to send your time sheets and invoices out to your clients.\nThe pay period for this invoice begins on Friday, October 30th 2020, 12:00:00 am and ends on Thursday, November 5th 2020, 11:59:59 pm.')
  })
})

describe('when the job is executed on an invoice date', () => {
  beforeAll(() => {
    invoiceCronJob.execute(moment('2020-11-06'))
  })

  afterAll(() => {
    mockTextMessageService.textRemindee.mockClear()
  })

  it('should send a text message reminder', () => {
    expect(mockTextMessageService.textRemindee).toHaveBeenCalledWith('Hello! Today is 11/06/2020. This is a reminder that it\'s time to send your time sheets and invoices out to your clients.\nThe pay period for this invoice begins on Friday, October 30th 2020, 12:00:00 am and ends on Thursday, November 5th 2020, 11:59:59 pm.')
  })
})

describe('when the job is executed on any other non-invoice date', () => {
  beforeAll(() => {
    invoiceCronJob.execute(moment('2020-11-01'))
  })

  afterAll(() => {
    mockTextMessageService.textRemindee.mockClear()
  })

  it('should send a text message reminder', () => {
    expect(mockTextMessageService.textRemindee).not.toHaveBeenCalled()
  })
})
