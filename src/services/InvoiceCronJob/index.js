const TextMessageService = require('../TextMessageService')
const shortDateFormat = 'MM/DD/YYYY'
const longDateFormat = 'dddd, MMMM Do YYYY, h:mm:ss a'
const weekDays = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7
}

module.exports = class InvoiceCronJob {
  constructor(
    moment = require('moment-mini'),
    textMessageService = new TextMessageService()
  ) {
    this.moment = moment
    this.textMessageService = textMessageService
  }

  execute(today = this.moment()) {
    if (!this.moment.isMoment(today)) throw new Error('Today must be a Date or moment object')

    const todaysDate = this.moment(today).startOf('day')
    const nextPayDay = this.findNextPayDate(todaysDate)
    const invoiceDay = this.getInvoiceDate(nextPayDay)

    if (todaysDate.isSame(invoiceDay, 'day')) {
      const previousPayDay = this.findPreviousPayDate(todaysDate)
      const dayBeforeInvoiceDay = this.moment(invoiceDay).subtract(1, 'day').endOf('day')

      this.textMessageService
        .textRemindee(this.buildTextMessageReminder(invoiceDay, previousPayDay, dayBeforeInvoiceDay))
      // TODO: add an error handling mechanism
    }
  }

  buildTextMessageReminder(invoiceDay, startOfPayPeriod, endOfPayPeriod) {
    if (!this.moment.isMoment(invoiceDay) || !this.moment.isMoment(startOfPayPeriod) || !this.moment.isMoment(endOfPayPeriod)) throw new Error('The invoiceDay, startOfPayPeriod, and endOfPayPeriod must all be moment objects.')

    return `Hello! Today is ${invoiceDay.format(shortDateFormat)}. This is a reminder that it's time to send your time sheets and invoices out to your clients.
The pay period for this invoice begins on ${startOfPayPeriod.format(longDateFormat)} and ends on ${endOfPayPeriod.format(longDateFormat)}.`
  }

  throwIfNotMoment(date) {
    if (!this.moment.isMoment(date)) throw new Error('The \'date\' parameter must be an object of type Moment.')
  }

  getInvoiceDate(date) {
    this.throwIfNotMoment(date)
    return this.moment(date).subtract(7, 'days')
  }

  getMidMonthDate(date) {
    this.throwIfNotMoment(date)
    return this.moment({ year: date.year(), month: date.month(), date: 15 }).startOf('day')
  }

  getEndOfMonthDate(date) {
    this.throwIfNotMoment(date)
    return this.moment(date).endOf('month').startOf('day')
  }

  getClosestBusinessDate(date) {
    this.throwIfNotMoment(date)

    const dateClone = this.moment(date)

    while (dateClone.isoWeekday() > weekDays.FRIDAY) {
      dateClone.subtract(1, 'day')
    }

    return dateClone
  }

  findNextPayDate(date) {
    this.throwIfNotMoment(date)

    const midMonth = this.getClosestBusinessDate(this.getMidMonthDate(date))
    const endOfMonth = this.getClosestBusinessDate(this.getEndOfMonthDate(date))
    const midNextMonth = this.getClosestBusinessDate(this.getMidMonthDate(this.moment(date).add(1, 'month')))

    if (date.isBefore(midMonth, 'day')) {
      return midMonth
    } else if (date.isBefore(endOfMonth, 'day')) {
      return endOfMonth
    } else {
      return midNextMonth
    }
  }

  findPreviousPayDate(date) {
    this.throwIfNotMoment(date)

    const midMonth = this.getClosestBusinessDate(this.getMidMonthDate(date))
    const endOfMonth = this.getClosestBusinessDate(this.getEndOfMonthDate(date))
    const endOfLastMonth = this.getClosestBusinessDate(this.getEndOfMonthDate(this.moment(date).subtract(1, 'month')))

    if (date.isAfter(endOfMonth, 'day')) {
      return endOfMonth
    } else if (date.isAfter(midMonth, 'day')) {
      return midMonth
    } else {
      return endOfLastMonth
    }
  }
}
