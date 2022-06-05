export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  mode: 'universal',
  server: {
    port: 3081,
    host: "0.0.0.0"
  },
  head: {
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#'
    },
    titleTemplate: '%s - NeosFrames',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'description', name: 'description', content: 'NeosVR Photo Upload site' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'NeosFrames' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://photo.neos.love/' },
      { hid: 'og:title', property: 'og:title', content: 'NeosFrames' },
      { hid: 'og:description', property: 'og:description', content: 'NeosVR Photo Upload site' },
      { hid: 'og:image', property: 'og:image', content: 'https://imagedelivery.net/n_TCh9IYDQry4G-U7jzPdQ/99b77e43-38d8-4623-0a7a-efd967ebe300/thumbnail' },

      { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'NeosFrames' },
      { hid: 'twitter:description', property: 'twitter:description', content: 'NeosVR Photo Upload site' },
      { hid: 'twitter:image', property: 'twitter:image', content: 'https://imagedelivery.net/n_TCh9IYDQry4G-U7jzPdQ/99b77e43-38d8-4623-0a7a-efd967ebe300/thumbnail' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/fav.png' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["bulma"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-masonry', ssr: false }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'nuxt-webfontloader',
    'nuxt-lazy-load'
  ],
  webfontloader: {
    google: {
      families: ['Lato:400,700', 'Noto+Sans+JP:400,700']
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
