<template lang="pug">
  div
    div.grid-parent
      div.grid( v-for="(a, k) in  separate(images, rows)" :key="k" :style="{'max-width': `${100 / rows}%`}")
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
  },
  mounted() {
    window.addEventListener('resize', this.calcRows)
    this.calcRows()
  },
  data() {
    return {
      imagerow: [],
      rows: 4
    }
  },
  computed: {
    ...mapState("modal", ["isModalOpen", "modalData"])
  },
  methods: {
    ...mapMutations('modal', ['openModal', "closeModal"]),
    separate(_, rows) {
      const img = []
      for (let i = 0; i < this.images.length; i++) {
        if (img[i % (this.rows)]) {
          img[i % rows].push(this.images[i])
        } else {
          img[i % rows] = [this.images[i]]
        }
      }
      return img
    },
    calcRows() {
      if (window.innerWidth > 1800) {
        this.rows = 5
      } else if (window.innerWidth > 1000) {
        this.rows = 4
      } else if (window.innerWidth > 700) {
        this.rows = 3
      } else if (window.innerWidth > 500) {
        this.rows = 2
      } else {
        this.rows = 1
      }
    }
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
