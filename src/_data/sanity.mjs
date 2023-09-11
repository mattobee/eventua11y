import { createClient } from "https://esm.sh/@sanity/client";
import envar from "./envar.mjs";

const client = createClient({
  projectId: envar.sanityProjectId,
  token: envar.sanityToken,
  dataset: envar.sanityDataset,
  apiVersion: envar.sanityApiVersion,
});

async function getEvents() {
  const events = await client.fetch('*[_type == "event"]');
  return events;
}

export let events = getEvents();
