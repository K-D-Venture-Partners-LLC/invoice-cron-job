const {
  getInvoiceDate,
  getMidMonthDate,
  getEndOfMonthDate,
  getClosestBusinessDate,
  findNextPayDate,
  findPreviousPayDate
} = require('.')

const moment = require('moment-mini')

describe('when getting the date to send an invoice, and passing in a non-moment pay date', () => {
  it('should throw an error', () => {
    expect(() => getInvoiceDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the date to send an invoice', () => {
  it('should return a date occurring one week before', () => {
    const invoiceDate = getInvoiceDate(moment('2020-10-30')).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual('2020-10-23')
  })
})

describe('when getting the date in the middle of the month, and passing in a non-moment pay date', () => {
  it('should throw an error', () => {
    expect(() => getMidMonthDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the date in the middle of the month', () => {
  it('should return a date on the 15th of the same month and year', () => {
    const invoiceDate = getMidMonthDate(moment('2020-10-30')).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual('2020-10-15')
  })
})

describe('when getting the date in the middle of the month, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => getMidMonthDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the date in the middle of the month', () => {
  it('should return a date on the 15th of the same month and year', () => {
    const invoiceDate = getMidMonthDate(moment('2020-10-30')).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual('2020-10-15')
  })
})

describe('when getting the date at the end of the month, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => getEndOfMonthDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the date at the end of the month', () => {
  it('should return the last date of the same month and year', () => {
    const invoiceDate = getEndOfMonthDate(moment('2020-10-30')).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual('2020-10-31')
  })
})

describe('when getting the closest business date, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => getClosestBusinessDate('2020-11-15')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
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
    const invoiceDate = getClosestBusinessDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(closestBusinessDate)
  })
})

describe('when getting the next pay date, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => findNextPayDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the next pay date from a date that is before the middle of the month', () => {
  it.each([ [ '2020-11-01', '2020-11-13' ], [ '2020-10-13', '2020-10-15' ] ])('should return the closest business date to %i', (date, nextPayDate) => {
    const invoiceDate = findNextPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(nextPayDate)
  })
})

describe('when getting the next pay date from a date that is after the middle of the month and before the end of the month', () => {
  it.each([ [ '2020-11-13', '2020-11-30' ], [ '2020-10-23', '2020-10-30' ] ])('should return the closest business date to %i', (date, nextPayDate) => {
    const invoiceDate = findNextPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(nextPayDate)
  })
})

describe('when getting the next pay date from a date that is after the end of the month', () => {
  it.each([ [ '2020-10-30', '2020-11-13' ], [ '2020-10-31', '2020-11-13' ], [ '2020-02-28', '2020-03-13' ] ])('should return the closest business date to %i', (date, nextPayDate) => {
    const invoiceDate = findNextPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(nextPayDate)
  })
})

describe('when getting the previous pay date, and passing in a non-moment date', () => {
  it('should throw an error', () => {
    expect(() => findPreviousPayDate('2020-10-30')).toThrowError(/^The 'date' parameter must be an object of type Moment.$/)
  })
})

describe('when getting the previous pay date from a date that is before the middle of the month pay day', () => {
  it.each([ [ '2020-11-13', '2020-10-30' ], [ '2020-10-15', '2020-09-30' ] ])('should return the closest business date to %i', (date, previousPayDate) => {
    const invoiceDate = findPreviousPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(previousPayDate)
  })
})

describe('when getting the previous pay date from a date that is after the middle of the month pay day and before the end of the month pay day', () => {
  it.each([ [ '2020-11-15', '2020-11-13' ], [ '2020-10-23', '2020-10-15' ] ])('should return the closest business date to %i', (date, previousPayDate) => {
    const invoiceDate = findPreviousPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(previousPayDate)
  })
})

describe('when getting the previous pay date from a date that is after the end of the month pay day', () => {
  it.each([ [ '2020-10-31', '2020-10-30' ], [ '2020-02-29', '2020-02-28' ] ])('should return the closest business date to %i', (date, previousPayDate) => {
    const invoiceDate = findPreviousPayDate(moment(date)).format('YYYY-MM-DD')

    expect(invoiceDate).toEqual(previousPayDate)
  })
})
