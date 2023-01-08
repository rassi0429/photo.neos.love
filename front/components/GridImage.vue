<template lang="pug">
  div
    div.grid-parent
      div.grid( v-for="(a, k) in  separate(images, rows)" :key="k" :style="{'max-width': `${100 / rows}%`}")
        img.grid-image(:src="getlink(img)" v-for="(img, i) in a" :key="i" :class="{'last': i === (a.length - 1)}" @click="openModal(img)" loading="lazy")
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
  data() {
    return {
      imagerow: [],
      rows: 4
    }
  },
  computed: {
    ...mapState("modal", ["isModalOpen", "modalData"])
  },
  mounted() {
    window.addEventListener('resize', this.calcRows)
    this.calcRows()
  },
  methods: {
    ...mapMutations('modal', ['openModal', "closeModal","setWidth"]),
    getlink(image) {
      const nsfwTags = ['nsfw', 'r18'];
      const name = image.tags.map(t => t.name)
      if(name.includes(nsfwTags[0]) || name.includes(nsfwTags[1])) {
        return image.url.replace('public','nsfw')
      } else {
        return image.url.replace('public','thumbnail')
      }
    },
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
      this.setWidth(window.innerWidth)
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
  gap: 4px 0;
  margin-right: 4px;
}

.grid-image {
  width: 100%;
  max-height: 2000px;
}
</style>
