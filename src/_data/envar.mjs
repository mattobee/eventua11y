export const sanityDetails = {
    projectId: Netlify.env.SANITY_PROJECT,
    dataset: "production",
    token: Netlify.env.SANITY_TOKEN
}

console.log("Hello from envar.mjs")

// module.exports = {
//     sanityDetails
// }