const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());

/**
 * Format a Date as a date-only string (YYYY-MM-DD).
 *
 * @param {Date|null|undefined} date
 * @returns {string|null} null when the input is not a valid Date
 */
const formatDateOnly = (date) => {
  if (!isValidDate(date)) return null;
  return date.toISOString().split('T')[0];
};

/**
 * Format a Date as a 24-hour time-only string (HH:mm:ss, UTC).
 *
 * @param {Date|null|undefined} date
 * @returns {string|null} null when the input is not a valid Date
 */
const formatTimeOnly = (date) => {
  if (!isValidDate(date)) return null;
  return date.toISOString().split('T')[1].slice(0, 8);
};

/**
 * Parse a date-only string (YYYY-MM-DD) into a Date at midnight UTC.
 *
 * @param {string|null|undefined} dateString
 * @returns {Date|null} null when the input is missing or invalid
 */
const convertDateOnlyToDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  const date = new Date(`${dateString}T00:00:00.000Z`);
  return isValidDate(date) ? date : null;
};

/**
 * Parse a time-only string (HH:mm:ss) into a Date on the base date 1900-01-01 (UTC).
 *
 * @param {string|null|undefined} timeString
 * @returns {Date|null} null when the input is missing or invalid
 */
const convertTimeOnlyToDate = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return null;

  const match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [hours, minutes, seconds] = match.slice(1).map((part) => parseInt(part, 10));
  if (hours > 23 || minutes > 59 || seconds > 59) return null;

  const date = new Date('1900-01-01T00:00:00.000Z');
  date.setUTCHours(hours, minutes, seconds, 0);
  return date;
};

/**
 * Return a shallow copy of `data` with the given date/time string fields converted to Dates.
 *
 * @param {Record<string, unknown>} data
 * @param {{ dateKeys?: string[], timeKeys?: string[] }} options
 * @returns {Record<string, unknown>}
 */
const transformDateFields = (data, { dateKeys = [], timeKeys = [] } = {}) => {
  const transformed = { ...data };

  dateKeys.forEach((key) => {
    if (typeof transformed[key] === 'string') {
      transformed[key] = convertDateOnlyToDate(transformed[key]);
    }
  });

  timeKeys.forEach((key) => {
    if (typeof transformed[key] === 'string') {
      transformed[key] = convertTimeOnlyToDate(transformed[key]);
    }
  });

  return transformed;
};

module.exports = {
  formatDateOnly,
  formatTimeOnly,
  convertDateOnlyToDate,
  convertTimeOnlyToDate,
  transformDateFields,
};
