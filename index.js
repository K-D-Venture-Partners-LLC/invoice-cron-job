// 5 - 8, 18 - 24
const moment = require('moment-mini')

const weekDays = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7
}

const getInvoiceDate = date => {
  if (!(date instanceof moment)) throw new Error('The \'date\' parameter must be an object of type Moment.')

  return moment(date).subtract(7, 'days')
}

const getMidMonthDate = date => {
  if (!(date instanceof moment)) throw new Error('The \'date\' parameter must be an object of type Moment.')

  return moment({ year: date.year(), month: date.month(), date: 15 }).startOf('day')
}

const getEndOfMonthDate = date => {
  if (!(date instanceof moment)) throw new Error('The \'date\' parameter must be an object of type Moment.')

  return moment(date).endOf('month').startOf('day')
}

const getClosestBusinessDate = date => {
  if (!(date instanceof moment)) throw new Error('The \'date\' parameter must be an object of type Moment.')

  const dateClone = moment(date)

  while (dateClone.isoWeekday() > weekDays.FRIDAY) {
    dateClone.subtract(1, 'day')
  }

  return dateClone
}

const findNextPayDate = date => {
  if (!(date instanceof moment)) throw new Error('The \'date\' parameter must be an object of type Moment.')

  const midMonth = getClosestBusinessDate(getMidMonthDate(date))
  const endOfMonth = getClosestBusinessDate(getEndOfMonthDate(date))
  const midNextMonth = getClosestBusinessDate(getMidMonthDate(moment(date).add(1, 'month')))

  if (date.isBefore(midMonth, 'day')) {
    return midMonth
  } else if (date.isBefore(endOfMonth, 'day')) {
    return endOfMonth
  } else {
    return midNextMonth
  }
}

const findPreviousPayDate = date => {
  if (!(date instanceof moment)) throw new Error('The \'date\' parameter must be an object of type Moment.')

  const midMonth = getClosestBusinessDate(getMidMonthDate(date))
  const endOfMonth = getClosestBusinessDate(getEndOfMonthDate(date))
  const endOfLastMonth = getClosestBusinessDate(getEndOfMonthDate(moment(date).subtract(1, 'month')))

  if (date.isAfter(endOfMonth, 'day')) {
    return endOfMonth
  } else if (date.isAfter(midMonth, 'day')) {
    return midMonth
  } else {
    return endOfLastMonth
  }
}

// eslint-disable-next-line no-unused-vars
// const execute = () => {
//   const today = moment().startOf('day')
//   const nextPayDay = findNextPayDate(today)
//   const invoiceDay = getInvoiceDate(nextPayDay)
//   // if (today.isSame(invoiceDay, 'day')) {
//   const previousPayDay = findPreviousPayDate(today)
//   const dayBeforeInvoiceDay = moment(invoiceDay).subtract(1, 'day').endOf('day')

//   console.log(today, invoiceDay, previousPayDay, dayBeforeInvoiceDay)
//   // }
// }

module.exports = {
  getInvoiceDate,
  getMidMonthDate,
  getEndOfMonthDate,
  getClosestBusinessDate,
  findNextPayDate,
  findPreviousPayDate
}
