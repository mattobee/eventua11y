const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

function readableDate(dateObj) {
  return new Date(dateObj).toDateString();
}

/* Converts the given date string to ISO8601 format. */
const isoDate = (date) => dayjs(date).toISOString();

/* Formats a date using Day.js */
const formatDate = (date, format) => dayjs(date).format(format);

module.exports = {
  readableDate,
  isoDate,
  formatDate
};
