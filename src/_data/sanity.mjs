import { createClient } from "https://esm.sh/@sanity/client";
import envar from "./envar.mjs";

const client = createClient({
  // projectId: sanityDetails.projectId,
  projectId: envar.projectId,
  dataset: envar.dataset,
  apiVersion: envar.apiVersion,
});

async function getEvents() {
  const events = await client.fetch('*[_type == "event"]');
  return events;
}

console.log("Hello from sanity.mjs")

export let events = getEvents();
