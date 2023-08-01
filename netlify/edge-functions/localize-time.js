import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";

export default async (request, context) => {
    const locale = request.headers["accept-language"] || "en-GB";
    const { timezone } = context.geo;

    // capture the HTTP response so we can modify it
   const response = await context.next();

   return new HTMLRewriter()
     .on(".event time", {
       element(element) {
         // get the date value as a string from the HTML data attribute
         const dateString = element.getAttribute("datetime");

         // convert the string to a JavaScript date
         const date = new Date(dateString);

         // use toLocaleString() with the locale from the request
         // and the timezone from context.geo
         const localizedTime = date.toLocaleString(locale, {
           timeZone: timezone,
           hour: "numeric",
           minute: "numeric",
           day: "numeric",
           weekday: "short",
           month: "short",
           timeZoneName: "short",
         });

         // modify the HTML element
         element.setInnerContent(`${localizedTime}`);
       },
     })
     // transform the original response!
     .transform(response);
   
  };