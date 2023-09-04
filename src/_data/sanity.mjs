import {createClient} from 'https://esm.sh/@sanity/client'

const client = createClient({
    projectId: '2g5zqxo3',
    dataset: 'production',
    apiVersion: '2023-09-04', // use current UTC date - see "specifying API version"!
    token: 'skezNMkDG0yFpnRWsK57A6afNfM9ILFH7z1JeCBxSLDRiuPvkhf9q7t2Qgwae70YLU7kg5susTb4wEcSM6PelQxg0ZnFowHzguUSWEnHlyGDodSCuL24WAsRrNUGJmvpGaJmJyjgsoShpPSHdJB4OvkypFZR7hKWHcfc6vjJaVlPWvSdPk8O'
  })

  export async function getEvents() {
    const events = await client.fetch('*[_type == "event"]')
    // console.log(events)
    return events
  }

  // const data = await client.fetch(`count(*)`)
  // console.log(`Number of documents: ${data}`)

  // export function hello() {
  //   console.log("hello from sanity.mjs")
  // }

