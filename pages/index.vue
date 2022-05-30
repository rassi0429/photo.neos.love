<template lang="pug">
  div#root
    img#headImg(src="/head.png")
    img#loginBtn(src="/login_btn.png")
    img#uploadBtn(src="/upload_btn.png")
    button.button#test(@click="getImage") add Images
    div#imageroot
      div.grid-parent(ref="reference")
        div.grid
          img(:src="image.url" v-for="(image, i) in shuffle(images)" :key="i")
        div.grid
          img(:src="image.url" v-for="(image, i) in shuffle(images)" :key="i")
        div.grid
          img(:src="image.url" v-for="(image, i) in shuffle(images)" :key="i")
        div.grid
          img(:src="image.url" v-for="(image, i) in shuffle(images)" :key="i")

</template>
<style>
#root {
  background-color: black;
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
  padding-top: 120px;
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

img {
}

</style>
<script>
import {mapActions} from "vuex";
import axios from "axios";

export default {
  name: 'IndexPage',
  data() {
    return {
      hoge: "hage",
      images: []
    }
  },
  methods: {
    ...mapActions('auth', ['getUserInfo', "twitterLogin"]),
    async getImage() {
      const {data} = await axios.get("http://localhost:3001/photos")
      this.images.push(...data)
      console.log(data)
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
