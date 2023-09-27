import { createClient } from "https://esm.sh/@sanity/client";
import getEnvar from "./envar.js";

const envar = getEnvar();

const sanityClient = createClient({
  projectId: envar.SANITY_PROJECT_ID,
  token: envar.SANITY_TOKEN,
  dataset: envar.SANITY_DATASET,
  apiVersion: envar.SANITY_API_VERSION,
});

async function getEvents() {
    try {
      const events = await sanityClient.fetch('*[_type == "event"]');
      return events;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch events");
    }
  }

export default function() {
  return getEvents();
}