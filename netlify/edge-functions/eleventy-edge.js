import {
  EleventyEdge,
  precompiledAppData,
} from "./_generated/eleventy-edge-app.js";

import getEvents from "./sanity.js";

import dayjs from 'https://esm.sh/dayjs'
import customParseFormat from 'https://esm.sh/dayjs/plugin/customParseFormat'
import isSameOrBefore from 'https://esm.sh/dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'https://esm.sh/dayjs/plugin/isSameOrAfter'
import localeData from 'https://esm.sh/dayjs/plugin/localeData'
import LocalizedFormat from 'https://esm.sh/dayjs/plugin/localizedFormat'
import meta from "../../src/_data/meta.mjs";

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(localeData)
dayjs.extend(LocalizedFormat)

// Pull events from Sanity
const events = getEvents();

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
    
    const { timezone } = context.geo;
    const now = new dayjs();
    
    console.log("now is " + now)
    console.log("timezone is " + timezone)

    edge.config((eleventyConfig) => {

      // Make Eleventy global data available on the edge
      eleventyConfig.addGlobalData("events", events); // Events from Sanity
      eleventyConfig.addGlobalData("meta", meta); // Meta data

      /* Converts the given date string to ISO8601 format. */
      eleventyConfig.addFilter("isoDate", function(date) {
        return dayjs(date).toISOString() 
      });

       /* Formats the given date string based on the user's locale. */
       eleventyConfig.addFilter("localizedDate", function(date) {
        return dayjs(date).locale(LOCALE).format("LL");
      });

      // Return theme events taking place today, based on locale
      eleventyConfig.addFilter("todaysThemes", function(events) {
        return events.filter((event) => {
          // console.log(event)
          const eventDateStart = new dayjs(event.dateStart);
          const eventDateEnd = new dayjs(event.dateEnd);
          return eventDateStart.isSameOrBefore(now) && eventDateEnd.isSameOrAfter(now) && event.type == "theme";
        });
      });

      // Return non-theme events taking place today, based on locale
      eleventyConfig.addFilter("todaysEvents", function(events) {
        return events.filter((event) => {
          const eventDateStart = new dayjs(event.dateStart);
          const eventDateEnd = new dayjs(event.dateEnd);
          // Return an event if it starts today or earlier, and ends today or later
          return eventDateStart.isSameOrBefore(now) && eventDateEnd.isSameOrAfter(now) && event.type != "theme";
        });
      });

      /* Returns a list of upcoming events in chronological order */
      eleventyConfig.addFilter("upcomingEvents", function(events) {
        return events.filter((event) => {
            return new dayjs(event.dateStart).isAfter(now, 'day');
          })
          // .reverse();
      });

      // Return today's date as an iso string
      eleventyConfig.addShortcode("todayISO", () => now.toISOString());

      // Return today's date as a locale string
      eleventyConfig.addShortcode("today", function() {
        return now;
      });

    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
