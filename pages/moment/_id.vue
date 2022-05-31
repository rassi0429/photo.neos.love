<template lang="pug">
  div {{ $route.params.id }}
</template>

<script>
export default {
  name: "_id.vue",
  head () {
    return {
      title: "hogehage",
      meta: [
        { hid: 'description', name: 'description', content: "OGP siteru wane" },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:title', property: 'og:title', content: this.$route.params.id },
        { hid: 'og:description', property: 'og:description', content: "OGP siteru wayo"},
        { hid: 'og:url', property: 'og:url', content: "http://localhost" },
        { hid: 'og:image', property: 'og:image', content: "https://media.discordapp.net/attachments/765809256129495062/980938539732705330/PXL_20220530_205913740.jpg?width=363&height=484" },
      ],
    }
  }
}
</script>

<style scoped>

</style>
