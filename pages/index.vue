<template lang="pug">
  div#root
    img#headImg(src="/head.png")
    img#loginBtn(src="/login_btn.png")
    img#uploadBtn(src="/upload_btn.png")
    button.button#test(@click="addImage") add Images)
    button.button#test(@click="twitterLogin") Login
    div#imageroot
      div.grid-parent
        div.grid( v-for="(a, k) in images" :key="k")
          img(:src="img.url" v-for="(img, i) in a" :key="i")

</template>
<script>
import {mapActions, mapState} from "vuex";
import axios from "axios";

export default {
  name: 'IndexPage',
  data() {
    return {
      hoge: "hage",
      images: [],
      rows: 4
    }
  },
  computed: {
    ...mapState(["endpoint"])
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
    async getImage() {
      const {data} = await axios.get(`${this.endpoint}/v1/photos`)
      for (let i = 0; i < data.length; i++) {
        if (this.images[i % this.rows]) {
          this.images[i % this.rows].push(data[i])
        } else {
          this.images[i % this.rows] = [data[i]]
        }
      }
      this.images.splice()
    },
    async addImage() {
      const {data} = await axios.get(`${this.endpoint}/v1/photos`)


      for (let i = 0; i < data.length; i++) {
        if (this.images[i % this.rows]) {
          this.images[i % this.rows].push(data[i])
        } else {
          this.images[i % this.rows] = [data[i]]
        }
      }
      this.images.splice()
    },
    shuffle(array) {
      let currentIndex = array.length
      let randomIndex = 0;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    },
  },
  mounted() {
    this.getUserInfo()
    this.getImage()
  }
}
</script>

<style>
#root {
  background-color: black;
  min-height: 100vh;
}

#headImg {
  position: fixed;
  width: 7%;
}

#loginBtn {
  position: fixed;
  right: 10px;
  bottom: 30px;
  max-width: 70px;
}

#uploadBtn {
  position: fixed;
  right: 10px;
  bottom: 120px;
  max-width: 70px;
}

#imageroot {
  width: 80vw;
  margin: auto;
  padding-top: 5em;
}

#test {
  position: fixed;
  right: 0;
}

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

</style>
