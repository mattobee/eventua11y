const { DateTime } = require("luxon");
const dayjs = require("dayjs");

function readableDate(dateObj) {
  return new Date(dateObj).toDateString();
}

/* Converts the given date string to ISO8601 format. */
function isoDate(dateString) {
  return new Date(dateString).toISOString();
}

/* Formats a date using Day.js */
const formatDate = (date, format) => dayjs(date).format(format);

function eventDate(dateObj) {
  return DateTime.fromISO(dateObj).toLocaleString(DateTime.DATETIME_FULL);
}

function upcomingEvents(events) {
  return events
    .filter((event) => {
      return new Date(event.dateStart) > new Date();
    })
    .reverse();
}

module.exports = {
  readableDate,
  isoDate,
  formatDate,
  eventDate,
  upcomingEvents,
};
