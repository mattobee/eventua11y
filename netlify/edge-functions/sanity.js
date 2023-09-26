import { createClient } from "https://esm.sh/@sanity/client";
import getEnvar from "./envar.js";

const envar = getEnvar();

const client = createClient({
  projectId: envar.sanityProjectId,
  token: envar.sanityToken,
  dataset: envar.sanityDataset,
  apiVersion: envar.sanityApiVersion,
});

async function getEvents() {
    try {
      const events = await client.fetch('*[_type == "event"]');
      return events;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch events");
    }
  }

export default function() {
  return getEvents();
}