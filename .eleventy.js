const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const dayjs = require('dayjs')
const filters = require("./src/_11ty/filters");
const { EleventyEdgePlugin } = require("@11ty/eleventy");

console.log("hello from .eleventy.js", process.env)

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./src/favicon");
  eleventyConfig.addPassthroughCopy("./src/scripts");
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addPlugin(EleventyEdgePlugin);
  eleventyConfig.addShortcode("year", () => `${new dayjs().year()}`);
  eleventyConfig.addShortcode("today", () => `${new dayjs()}`);

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
