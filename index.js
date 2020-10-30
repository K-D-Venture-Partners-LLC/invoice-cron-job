// 5 - 8, 18 - 24
const moment = require('moment-mini');

export const weekDays = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7
}

export const getInvoiceDay = payDay => {
  // TODO: if payDay isn't a moment obj, throw an invalid argument exception

  return moment(payDay).subtract(7, 'days');
}

export const getMidMonthDay = day => {
  return moment({ year: day.year(), month: day.month(), date: 15 }).startOf('day');
}

export const getEndOfMonthDay = day => {
  return moment(day).endOf('month').startOf('day');
}

export const getClosestBusinessDay = day => {
  // TODO: if payDay isn't a moment obj, throw an invalid argument exception
  const dayClone = moment(day);

  while (dayClone.day() > weekDays.FRIDAY) {
    dayClone.subtract(1, 'day')
  }

  return dayClone;
}

export const findNextPayDay = day => {
  // TODO: if payDay isn't a moment obj, throw an invalid argument exception
  const midMonth = getClosestBusinessDay(getMidMonthDay(day));
  const endOfMonth = getClosestBusinessDay(getEndOfMonthDay(day));
  const midNextMonth = getClosestBusinessDay(getMidMonthDay(moment(day).add(1, 'month')));

  if (day.isBefore(midMonth, 'day')) {
    return midMonth;
  } else if (day.isBefore(endOfMonth, 'day')) {
    return endOfMonth;
  } else {
    return midNextMonth;
  }
}

export const findPreviousPayDay = day => {
  // TODO: if payDay isn't a moment obj, throw an invalid argument exception
  const midMonth = getClosestBusinessDay(getMidMonthDay(day));
  const endOfMonth = getClosestBusinessDay(getEndOfMonthDay(day));
  const endOfLastMonth = getClosestBusinessDay(getEndOfMonthDay(moment(day).subtract(1, 'month')));

  if (day.isAfter(endOfMonth, 'day')) {
    return endOfMonth;
  } else if (day.isAfter(midMonth, 'day')) {
    return midMonth;
  } else {
    return endOfLastMonth;
  }
}

const execute = () => {
  const today = moment().startOf('day');
  const nextPayDay = findNextPayDay(today)
  const invoiceDay = getInvoiceDay(nextPayDay);
  // if (today.isSame(invoiceDay, 'day')) {
  const previousPayDay = findPreviousPayDay(today);
  const dayBeforeInvoiceDay = moment(invoiceDay).subtract(1, 'day').endOf('day');

  console.log(today, invoiceDay, previousPayDay, dayBeforeInvoiceDay);
  // }
}