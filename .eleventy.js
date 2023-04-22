const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const filters = require("./src/_11ty/filters");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Create filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
