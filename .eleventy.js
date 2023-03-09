const { DateTime } = require("luxon");
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");

module.exports = (eleventyConfig) => {
    eleventyConfig.addPassthroughCopy("./src/images");
    eleventyConfig.addPlugin(eleventySass);

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