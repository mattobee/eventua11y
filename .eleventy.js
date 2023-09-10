const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const filters = require("./src/_11ty/filters");
const { EleventyEdgePlugin } = require("@11ty/eleventy");

// require("dotenv").config();
// console.log(process.env.SANITY_TOKEN)
// console.log("Sanity project is:", process.env.SANITY_PROJECT)
// console.log("hello from .eleventy.js")

// module.exports = {
//   sanityProject: process.env.SANITY_PROJECT,
//   sanityToken: process.env.SANITY_TOKEN,
// };

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
