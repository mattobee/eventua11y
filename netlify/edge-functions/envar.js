const getEnvar = () => ({
  sanityProjectId: Deno.env.get("SANITY_PROJECT"),
  sanityToken: Deno.env.get("SANITY_TOKEN"),
  sanityDataset: Deno.env.get("SANITY_DATASET") || "production",
  sanityApiVersion: Deno.env.get("SANITY_API_VERSION") || "2023-09-04",
});

export default getEnvar;