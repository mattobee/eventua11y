import { createClient } from "https://esm.sh/@sanity/client";
import { sanityDetails } from "./envar.mjs";

const client = createClient({
  // projectId: sanityDetails.projectId,
  projectId: '2g5zqxo3',
  dataset: "production",
  apiVersion: "2023-09-04",
});

async function getEvents() {
  const events = await client.fetch('*[_type == "event"]');
  return events;
}

console.log("Hello")

export let events = getEvents();
