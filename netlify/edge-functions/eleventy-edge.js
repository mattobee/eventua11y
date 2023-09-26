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

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(localeData)
dayjs.extend(LocalizedFormat)

// Pull events from Sanity
const events = getEvents();

import meta from "../../src/_data/meta.mjs";

export default async (request, context) => {
  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,

      // default is [], add more keys to opt-in e.g. ["appearance", "username"]
      cookies: [],
    });

    const LOCALE = request.headers["accept-language"] || "en-gb";

    // import(`npm:dayjs/locale/${LOCALE}.js`)
    // .then(() => {
    //   dayjs.locale(LOCALE);
    //   console.log("Locale in day.js is " + dayjs.locale());
    //   console.log("Same or before: " + dayjs().isSameOrBefore(dayjs('2024-01-01')))
    // });

    // const dayjslocale = await import(`https://esm.sh/dayjs/locale/${LOCALE}.js`);
    // dayjs.locale('de');
    // console.log("Locale in day.js is " + dayjs.locale());
    
    const { timezone } = context.geo;
    const dateNow = new dayjs();
    console.log("dateNow is " + dateNow)

    edge.config((eleventyConfig) => {
      // Add some custom Edge-specific configuration
      // e.g. Fancier json output
      // eleventyConfig.addFilter("json", obj => JSON.stringify(obj, null, 2));

      // Make Eleventy global data available on the edge
      eleventyConfig.addGlobalData("events", events); // Events from Sanity
      eleventyConfig.addGlobalData("meta", meta); // Meta data

      /* Converts the given date string to ISO8601 format. */
      eleventyConfig.addFilter("isoDate", function(date) {
        return dayjs(date).toISOString() 
      });

      // Return theme events taking place today, based on locale
      eleventyConfig.addFilter("todaysThemes", function(events) {
        let today = new dayjs();
        return events.filter((event) => {
          console.log(event)
          const eventDateStart = new dayjs(event.dateStart);
          const eventDateEnd = new dayjs(event.dateEnd);
          return eventDateStart.isSameOrBefore(today) && eventDateEnd.isSameOrAfter(today) && event.type == "theme";
        });
      });

      // Return non-theme events taking place today, based on locale
      eleventyConfig.addFilter("todaysEvents", function(events) {
        let today = new dayjs();
        // console.log("I think today is " + today);
        return events.filter((event) => {
          const eventDateStart = new dayjs(event.dateStart);
          const eventDateEnd = new dayjs(event.dateEnd);
          // Return an event if it starts today or earlier, and ends today or later
          return eventDateStart.isSameOrBefore(today) && eventDateEnd.isSameOrAfter(today) && event.type != "theme";
        });
      });

      /* Returns a list of upcoming events in chronological order */
      eleventyConfig.addFilter("upcomingEvents", function(events) {
        let today = new dayjs();
        return events.filter((event) => {
            return new dayjs(event.dateStart).isAfter(today, 'day');
          })
          // .reverse();
      });

      // Return today's date as an iso string
      eleventyConfig.addShortcode("todayISO", () => dateNow.toISOString());

      // Return today's date as a locale string
      eleventyConfig.addShortcode("today", function() {
        return dateNow.format('LL');
      });

    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
