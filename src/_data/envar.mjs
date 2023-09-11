export default {
    sanityProjectId: Deno.env.get("SANITY_PROJECT"),
    sanityToken: Deno.env.get("SANITY_TOKEN"),
    sanityDataset: "production",
    sanityApiVersion: "2023-09-04"
}
