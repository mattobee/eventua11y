import { EleventyEdge, precompiledAppData } from "./_generated/eleventy-edge-app.js";
import getEvents from "./sanity.js";
import dayjs from "./day.js";
import meta from "../../src/_data/meta.mjs";

// Pull events from Sanity
const events = await getEvents();
console.log(events);

export default async (request, context) => {
  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,

      // default is [], add more keys to opt-in e.g. ["appearance", "username"]
      cookies: [],
    });

    // Set the locale based on the request headers, defaulting to en-gb
    const LOCALE = request.headers["accept-language"] || "en-gb";
    console.log("LOCALE is " + LOCALE);

    // Set the timezone based on Netlify's geo headers
    const { timezone } = context.geo;
    console.log("timezone is " + timezone);

    // Set the current date
    const now = new dayjs();
    console.log("now is " + now);

    edge.config((eleventyConfig) => {
      // Make Eleventy global data available on the edge
      eleventyConfig.addGlobalData("events", events); // Events from Sanity
      eleventyConfig.addGlobalData("meta", meta); // Meta data

      /* Converts the given date string to ISO8601 format. */
      eleventyConfig.addFilter("isoDate", (date) => dayjs(date).toISOString());

      /* Formats the given date string based on the user's locale. */
      eleventyConfig.addFilter("localizeDate", (date, format) =>
        dayjs(date).locale(LOCALE).tz(timezone).format(format)
      );

      // Return theme events taking place today, based on locale
      eleventyConfig.addFilter("todaysThemes", function (events) {
        return events.filter((event) => {
          // console.log(event)
          const eventDateStart = new dayjs(event.dateStart);
          const eventDateEnd = new dayjs(event.dateEnd);
          return (
            eventDateStart.isSameOrBefore(now) &&
            eventDateEnd.isSameOrAfter(now) &&
            event.type == "theme"
          );
        });
      });

      // Return non-theme events taking place today, based on locale
      eleventyConfig.addFilter("todaysEvents", function (events) {
        return events.filter((event) => {
          const eventDateStart = new dayjs(event.dateStart);
          const eventDateEnd = new dayjs(event.dateEnd);
          // Return an event if it starts today or earlier, and ends today or later
          return (
            eventDateStart.isSameOrBefore(now) &&
            eventDateEnd.isSameOrAfter(now) &&
            event.type != "theme"
          );
        });
      });

      /* Returns a list of upcoming events in chronological order */
      eleventyConfig.addFilter("upcomingEvents", function (events) {
        return events.filter((event) => {
          return new dayjs(event.dateStart).isAfter(now, "day");
        });
        // .reverse();
      });

      // Return today's date as an iso string
      eleventyConfig.addShortcode("todayISO", () => now.toISOString());

      // Return today's date as a locale string
      eleventyConfig.addShortcode("today", function () {
        return dayjs(now).locale(LOCALE).tz(timezone).format("LL");
        // return now;
      });

      // Return the user's timezone
      eleventyConfig.addShortcode("timezone", function (context) {
        return timezone;
      });

      // Return the user's country
      eleventyConfig.addShortcode("country", function (context) {
        return context.geo.country;
      });

    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
