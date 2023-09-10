// import dotenv from "dotenv"

export const sanityDetails = {
    projectId: process.env.SANITY_PROJECT,
    dataset: "production",
    token: process.env.SANITY_TOKEN
}

console.log("Hello from envar.mjs")

// module.exports = {
//     sanityDetails
// }