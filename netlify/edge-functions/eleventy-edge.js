import {
  EleventyEdge,
  precompiledAppData,
} from "./_generated/eleventy-edge-app.js";

import events from "../../src/_data/events.json" assert {type: 'json'};

export default async (request, context) => {
  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,

      // default is [], add more keys to opt-in e.g. ["appearance", "username"]
      cookies: [],
    });

    const locale = request.headers["accept-language"] || "en-GB";
    const { timezone } = context.geo;
    const date = new Date();
    const localDateNow = date.toLocaleDateString(locale, {
      timeZone: timezone,
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    edge.config((eleventyConfig) => {
      // Add some custom Edge-specific configuration
      // e.g. Fancier json output
      // eleventyConfig.addFilter("json", obj => JSON.stringify(obj, null, 2));

      // Add events to global data in edge
      eleventyConfig.addGlobalData("events", events);

      /* Converts the given date string to ISO8601 format. */
      eleventyConfig.addFilter("isoDate", function(date) {
        const dateObject = new Date(date);
        return dateObject.toISOString();
      });

      // Return events taking place today, based on locale
      eleventyConfig.addFilter("todaysEvents", function(events) {
        const today = new Date().toISOString().slice(0, 10);
        return events.filter((event) => {
          const eventDateStart = new Date(event.dateStart).toISOString().slice(0, 10);
          const eventDateEnd = new Date(event.dateEnd).toISOString().slice(0, 10);
          return eventDateStart <= today && today <= eventDateEnd;
        });
      });

      // Return today's date based on locale
      eleventyConfig.addShortcode("today", () => localDateNow);
    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
