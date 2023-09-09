import { createClient } from "https://esm.sh/@sanity/client";
import { sanityDetails } from "./envar";

const client = createClient({
  // projectId: process.env.SANITY_PROJECT,
  projectId: '2g5zqxo3',
  dataset: "production",
  apiVersion: "2023-09-04",
});

async function getEvents() {
  const events = await client.fetch('*[_type == "event"]');
  return events;
}

export let events = getEvents();
