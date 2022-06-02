<template lang="pug">
  div
    div.grid-parent
      div.grid( v-for="(a, k) in  separate(images)" :key="k" :style="{'max-width': `${100 / rows}%`}")
        img.grid-image(:src="img.url.replace('public','thumbnail')" v-for="(img, i) in a" :key="i" @click="openModal(img)")
    div.bottom_point(ref="bottomPoint")
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "GridImage",
  props: {
    images: {
      type: Array,
      default: () => [],
      required: true
    },
    rows: {
      type: Number,
      default: 4,
      required: false
    },
  },
  mounted() {
  },
  data() {
    return {
      imagerow: [],
    }
  },
  computed: {
    ...mapState("modal", ["isModalOpen", "modalData"])
  },
  methods: {
    ...mapMutations('modal', ['openModal', "closeModal"]),
    separate() {
      const img = []
      for (let i = 0; i < this.images.length; i++) {
        if (img[i % (this.rows)]) {
          img[i % this.rows].push(this.images[i])
        } else {
          img[i % this.rows] = [this.images[i]]
        }
      }
      return img
    },
  }
}
</script>

<style scoped>
.grid-parent {
  display: flex;
  flex-direction: row;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: flex-start;
  gap: 4px 0px;
  margin-right: 4px;
}

.grid-image {
  width: 100%;
}
</style>
