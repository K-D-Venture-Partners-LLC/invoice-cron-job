// 5 - 8, 18 - 24
const moment = require('moment-mini')

export const weekDays = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
}

export const getInvoiceDay = day => {
  if (!(day instanceof moment)) throw new Error('The \'day\' parameter must be an object of type Moment.')

  return moment(day).subtract(7, 'days')
}

export const getMidMonthDay = day => {
  if (!(day instanceof moment)) throw new Error('The \'day\' parameter must be an object of type Moment.')

  return moment({ year: day.year(), month: day.month(), date: 15 }).startOf('day')
}

export const getEndOfMonthDay = day => {
  if (!(day instanceof moment)) throw new Error('The \'day\' parameter must be an object of type Moment.')

  return moment(day).endOf('month').startOf('day')
}

export const getClosestBusinessDay = day => {
  if (!(day instanceof moment)) throw new Error('The \'day\' parameter must be an object of type Moment.')

  const dayClone = moment(day)

  while (dayClone.day() > weekDays.FRIDAY) {
    dayClone.subtract(1, 'day')
  }

  return dayClone
}

export const findNextPayDay = day => {
  if (!(day instanceof moment)) throw new Error('The \'day\' parameter must be an object of type Moment.')

  const midMonth = getClosestBusinessDay(getMidMonthDay(day))
  const endOfMonth = getClosestBusinessDay(getEndOfMonthDay(day))
  const midNextMonth = getClosestBusinessDay(getMidMonthDay(moment(day).add(1, 'month')))

  if (day.isBefore(midMonth, 'day')) {
    return midMonth
  } else if (day.isBefore(endOfMonth, 'day')) {
    return endOfMonth
  } else {
    return midNextMonth
  }
}

export const findPreviousPayDay = day => {
  if (!(day instanceof moment)) throw new Error('The \'day\' parameter must be an object of type Moment.')

  const midMonth = getClosestBusinessDay(getMidMonthDay(day))
  const endOfMonth = getClosestBusinessDay(getEndOfMonthDay(day))
  const endOfLastMonth = getClosestBusinessDay(getEndOfMonthDay(moment(day).subtract(1, 'month')))

  if (day.isAfter(endOfMonth, 'day')) {
    return endOfMonth
  } else if (day.isAfter(midMonth, 'day')) {
    return midMonth
  } else {
    return endOfLastMonth
  }
}

// eslint-disable-next-line no-unused-vars
const execute = () => {
  const today = moment().startOf('day')
  const nextPayDay = findNextPayDay(today)
  const invoiceDay = getInvoiceDay(nextPayDay)
  // if (today.isSame(invoiceDay, 'day')) {
  const previousPayDay = findPreviousPayDay(today)
  const dayBeforeInvoiceDay = moment(invoiceDay).subtract(1, 'day').endOf('day')

  console.log(today, invoiceDay, previousPayDay, dayBeforeInvoiceDay)
  // }
}
