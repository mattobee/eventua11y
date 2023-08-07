function readableDate(dateObj) {
  return new Date(dateObj).toDateString();
}

module.exports = {
  readableDate
};
