import moment from 'moment';

// MomentJS Hacks
// To check for past due date use `const isPastDue = moment(dueDate).isBefore();`, same for isAfter(), leaving empty args sets to today by default.

/**
 * Returns true if the passed in datetime object represents today for client.
 * @param {DateTime object} dateTime
 */
export const isMomentToday = (dateTime) => {
  const today = moment();
  return moment(dateTime).isSame(today, 'day');
};

/**
 * Returns true if the passed in datetime object represents Tomorrow for client.
 * @param {DateTime object} dateTime
 */
export const isMomentTomorrow = (dateTime) => {
  const tomorrow = moment().add(1, 'days');
  return moment(dateTime).isSame(tomorrow, 'day');
};

/**
 * Returns true if the passed in datetime object represents Yesterday for client.
 * @param {DateTime object} dateTime
 */
export const isMomentYesterday = (dateTime) => {
  const yesterday = moment().add(-1, 'days');
  return moment(dateTime).isSame(yesterday, 'day');
};

/**
 * Returns true if the passed in datetime object represents date in next 7 days for client.
 * @param {DateTime object} dateTime
 */
export const isMomentInNext7Days = (dateTime) => {
  const A_WEEK_OLD = moment().subtract(7, 'days').startOf('day');
  return dateTime.isAfter(A_WEEK_OLD);
};

/**
 * Returns true if the passed in datetime object lies in the current week for client.
 * @param {DateTime object} dateTime
 */
export const isMomentThisWeek = (dateTime) => {
  return moment(dateTime).isSame(new Date(), 'week');
};

/**
 * Returns true if the passed in datetime object lies in the current month for client.
 * @param {DateTime object} dateTime
 */
export const isMomentThisMonth = (dateTime) => {
  return moment(dateTime).isSame(new Date(), 'month');
};

/**
 * Returns the name of the day, Monday, Tuesday...Sunday
 * @param {DateTime object} dateTime
 */
export const dayName = (dateTime) => {
  return moment(dateTime).format('dddd');
};

/**
 * Returns the name of the day in short format, Mon, Tue...Sun
 * @param {DateTime object} dateTime
 */
export const dayNameShort = (dateTime) => {
  return moment(dateTime).format('ddd');
};

/**
 * Returns the name of the day with date in short format, Mon 14, Tue 14...Sun 14
 * @param {DateTime object} dateTime
 */
export const dayNameAndDateShort = (dateTime) => {
  return moment(dateTime).format('ddd DD');
};

/**
 * Returns the name of the day with date in short format, Mon 14 (Jun), Tue 15 (Jun)...Sun 20(Jun)
 * @param {DateTime object} dateTime
 */
export const dayNameDateAndMonthShort = (dateTime) => {
  return moment(dateTime).format('ddd DD (MMM)');
};

/**
 * Returns the name of the month with date in short format, Feb 14, Mar 14...Dec 14
 * @param {DateTime object} dateTime
 */
export const monthNameAndDateShort = (dateTime) => {
  return moment(dateTime).format('MMM DD');
};

/**
 * Returns the number of days since now from the input dateTime
 * @param {DateTime object} dateTime
 */
export const daysSinceToday = (dateTime) => {
  return moment().diff(dateTime, 'days');
};

export const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};

/**
 * Returns the number of days between startDate and endDate.
 * @param {*} startDate
 * @param {*} endDate
 */
export const daysBetweenDates = (startDate, endDate) => {
  const a = moment(startDate, 'YYYY-MM-DD');
  const b = moment(endDate, 'YYYY-MM-DD');
  const days = b.diff(a, 'days');
  return days;
};

/**
 * Converts time from milliseconds to minutes.
 * @param {Time in milliseconds} timeInMs
 */
export const convertMsToMins = (timeInMs) => {
  return Math.floor(timeInMs / 60000);
};

/**
 * Converts time from milliseconds to minutes and seconds.
 * Example: convertMsToMinsAndSeconds(298999); will return "4:59"
 * @param {Time in milliseconds} timeInMs
 */
export const convertMsToMinsAndSeconds = (timeInMs) => {
  const minutes = Math.floor(timeInMs / 60000);
  const seconds = ((timeInMs % 60000) / 1000).toFixed(0);
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds > 10 ? `${seconds}s` : ''}`;
};

/**
 * Converts time from minutes to hours and minutes.
 * Example: convertMinsToTime(70); will return "1h 10m"
 * @param {Time in milliseconds} timeInMs
 */
export const convertMinsToTime = (timeInMins) => {
  if (timeInMins < 60) {
    // return `${timeInMins} m`;
    return convertMsToMinsAndSeconds(timeInMins * 60000);
  }
  const hours = Math.floor(timeInMins / 60);
  const mins = (timeInMins % 60).toFixed(0);
  return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
};

/**
 * Rounds the time to the next closest slot. For a current time 10:13am will return 10:30am, for a current time 11:45am -> 12:00pm
 *
 * Example usage:
 * const today = moment();
 * const roundedTime = roundToNearestTime(date, moment.duration(15, "minutes"), "ceil");
 *
 * @param {*} date
 * @param {*} duration
 * @param {*} method
 * @returns
 */
export const roundToNearestTime = (date, duration, method) => {
  return moment(Math[method](+date / +duration) * +duration);
};

/**
 * Rounds the time to the next closest slot. For a current time 10:13am will return 10:30am, for a current time 11:45am -> 12:00pm
 *
 * Example usage:
 * const {milliseconds, hours} = calculateDiffinTwoTimes("2021-07-20T18:39:38+05:30", "2021-07-20T18:42:31+05:30");
 *
 * @param {*} startTime
 * @param {*} endTime
 * @returns
 */
export const calculateDiffinTwoTimes = (startTime, endTime) => {
  const startTimeFormatted = moment(startTime);
  const endTimeFormatted = moment(endTime);
  const duration = moment.duration(endTimeFormatted.diff(startTimeFormatted));
  const hours = parseFloat(duration.asHours());
  const milliseconds = hours && hours * 60 * 60 * 1000;
  return { milliseconds, hours };
};
