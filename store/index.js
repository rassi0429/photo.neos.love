export const state = () => ({
  version: '1.0.0:' + process.env.buildTime,
  buildTime: process.env.buildTime,
  endpoint: process.env.api_host || "http://localhost:3080"
})
