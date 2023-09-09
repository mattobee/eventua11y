// module.exports = {
//     sanityProject: process.env.SANITY_PROJECT,
//     sanityToken: process.env.SANITY_TOKEN,
// };

const sanityDetails = {
    projectId: process.env.SANITY_PROJECT,
    dataset: "production",
    token: process.env.SANITY_TOKEN
}

module.exports = {
    sanityDetails
  };