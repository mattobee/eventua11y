import {
  EleventyEdge,
  precompiledAppData,
} from "./_generated/eleventy-edge-app.js";

// import events from "../../src/_data/events.json" assert {type: 'json'};

import { events } from "../../src/_data/sanity.mjs";
console.log("Importing events from sanity.mjs", events);

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
    const dateNow = new Date();
    const localDateNow = dateNow.toLocaleDateString(locale, {
      timeZone: timezone,
      day: "numeric",
      weekday: "short",
      month: "short",
      timeZoneName: "shortGeneric"
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

      // Return theme events taking place today, based on locale
      eleventyConfig.addFilter("todaysThemes", function(events) {
        const today = new Date().toISOString().slice(0, 10);
        return events.filter((event) => {
          const eventDateStart = new Date(event.dateStart).toISOString().slice(0, 10);
          const eventDateEnd = new Date(event.dateEnd).toISOString().slice(0, 10);
          return eventDateStart <= today && today <= eventDateEnd && event.type == "Theme";
        });
      });

      // Return non-theme events taking place today, based on locale
      eleventyConfig.addFilter("todaysEvents", function(events) {
        const today = new Date().toISOString().slice(0, 10);
        return events.filter((event) => {
          const eventDateStart = new Date(event.dateStart).toISOString().slice(0, 10);
          const eventDateEnd = new Date(event.dateEnd).toISOString().slice(0, 10);
          return eventDateStart <= today && today <= eventDateEnd && event.type !== "Theme";
        });
      });

      /* Returns a list of upcoming events in chronological order */
      eleventyConfig.addFilter("upcomingEvents", function(events) {
        return events.filter((event) => {
            return new Date(event.dateStart) > new Date();
          })
          .reverse();
      });

      // Return today's date as an iso string
      eleventyConfig.addShortcode("todayISO", () => dateNow.toISOString());

      // Return today's date as a locale string
      eleventyConfig.addShortcode("today", function() {
        return localDateNow;
      });

    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
