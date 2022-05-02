const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/images");

    // Format event dates based on user's locale
    eleventyConfig.addFilter("eventDate", (dateObj) => {
      return DateTime.fromISO(dateObj).toLocaleString(DateTime.DATETIME_FULL);
    });
    
    return {
      dir: {
        input: "src",
        output: "dist"
      }
    }
  };