import { createClient } from "https://esm.sh/@sanity/client";

const envar = {
    sanityProjectId: Deno.env.get("SANITY_PROJECT"),
    sanityToken: Deno.env.get("SANITY_TOKEN"),
    sanityDataset: "production",
    sanityApiVersion: "2023-09-04"
}

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

export default function() {
    return getEvents();
  }