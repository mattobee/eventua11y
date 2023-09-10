const sanityDetails = {
    projectId: process.env.SANITY_PROJECT,
    dataset: "production",
    token: process.env.SANITY_TOKEN
}

module.exports = {
    sanityDetails
}