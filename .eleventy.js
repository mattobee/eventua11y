const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const filters = require("./src/_11ty/filters");
const { EleventyEdgePlugin } = require("@11ty/eleventy");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addPlugin(EleventyEdgePlugin);
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("today", () => `${new Date()}`);


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
