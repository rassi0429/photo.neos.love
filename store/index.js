export const state = () => ({
  version: '1.0.0:' + process.env.buildTime,
  buildTime: process.env.buildTime,
  endpoint: process.env.api_host || "https://photo-api.neos.love"
})
