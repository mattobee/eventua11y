import {
  EleventyEdge,
  precompiledAppData,
} from "./_generated/eleventy-edge-app.js";
import getEvents from "./sanity.js";
import dayjs from "./day.js";
import meta from "../../src/_data/meta.mjs";

// Pull events from Sanity
const events = await getEvents();

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
    console.log(now.toISOString());

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

      // Return theme events taking place today
      eleventyConfig.addFilter("todaysThemes", function (events) {
        return events.filter((event) => {
          // Get the start date of the event
          const eventDateStart = new dayjs(event.dateStart);
          // If there's no end date, assume it's a one-day event
          const eventDateEnd = event.dateEnd ? dayjs(event.dateEnd) : eventDateStart;
          // Work out if the event is ongoing
          const isOngoing = eventDateStart.isSameOrBefore(now, 'day') && eventDateEnd.isSameOrAfter(now, 'day');
          // Return the event if it's ongoing and a theme
          return isOngoing && event.type == "theme";
        });
      });

      // Return non-theme events taking place today
      eleventyConfig.addFilter("todaysEvents", function (events) {
        return events.filter((event) => {
          // Get the start date of the event
          const eventDateStart = new dayjs(event.dateStart);
          // If there's no end date, assume it's a one-day event
          const eventDateEnd = event.dateEnd ? dayjs(event.dateEnd) : eventDateStart;
          // Work out if the event is ongoing
          const isOngoing = eventDateStart.isSameOrBefore(now, 'day') && eventDateEnd.isSameOrAfter(now, 'day');
          console.log(event.title, isOngoing);
          // Return the event if it's ongoing and not a theme
          return isOngoing && event.type != "theme";
        });
      });

      /* Returns a list of upcoming events in chronological order */
      eleventyConfig.addFilter("upcomingEvents", function (events) {
        return events.filter((event) => {
          // Return the event if its start date is after today
          return new dayjs(event.dateStart).isAfter(now, "day");
        });
      });

      // Returns debugging details for each event
      eleventyConfig.addShortcode("debug", function (event) {
        const isOngoing = dayjs(event.dateStart).isSameOrBefore(now, 'day') && dayjs(event.dateEnd).isSameOrAfter(now, 'day');
       
        const debugOutput = `
        <div class="debugging">
          <details>
            <summary class="debug-toggle">Debug information</summary>
            <div class="debug">
              <p><strong>${event.title}</strong></p>
              <p>Your timezone is <strong>${timezone}</strong></p>
              <p>Your locale is <strong>${LOCALE}</strong></p>
              <p>Your local datetime is <strong>${dayjs(now).locale(LOCALE).tz(timezone).format()}</strong></p>
              <p>Start date in Sanity: ${event.dateStart}</p>
              <p>Start date in your timezone: ${dayjs(event.dateStart).locale(LOCALE).tz(timezone).format()}</p>
              <p>End date in Sanity: ${event.dateEnd}</p>
              <p>End date in your timezone: ${event.dateEnd ? dayjs(event.dateEnd).locale(LOCALE).tz(timezone).format() : null}</p>
              <!-- if the event has ended, show a message. Otherwise, show nothing -->
              ${dayjs(event.dateEnd).isBefore(now, 'day') ? `<p><strong>This event has ended</strong></p>` : null}
              ${isOngoing ? `<p><strong>This event is ongoing</strong></p>` : null}
              ${dayjs(event.dateStart).isAfter(now, 'day') ? `<p><strong>This event is upcoming</strong></p>` : null}
            </div>
          </details>
          <details>
            <summary class="debug-toggle">Raw event data</summary>
            <div class="debug">
              <pre>${JSON.stringify(event, null, 2)}</pre>
            </div>
          </details>
        </div>
        `
        
        return debugOutput;
      });

      // Return today's date as an iso string
      eleventyConfig.addShortcode("todayISO", () => now.toISOString());

      // Return today's date as a locale string
      eleventyConfig.addShortcode("today", function () {
        return dayjs(now).locale(LOCALE).tz(timezone).format("LL z");
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
