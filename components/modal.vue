<template lang="pug">
  div.image-modal(v-show="isModalOpen")
    div.columns.h100.m0
      div.column.is-9.h100.p0.center
        img#ImageInModal(:src="modalData.url")
      div.column.is-3
        button.button(@click="closeModal()") close
        p comment {{ modalData.comment }}
        p tags {{ modalData.tags }}
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "PhotoViewModal",
  computed: {
    ...mapState("modal", ["isModalOpen", "modalData"])
  },
  methods: {
    ...mapMutations('modal', ['openModal', "closeModal"])
  }
}
</script>

<style scoped>

.blur {
  -webkit-filter: blur(8px);
  -moz-filter: blur(8px);
  -ms-filter: blur(8px);
  filter: blur(8px);
}

.image-modal {
  width: 100%;
  max-width: 1200px;
  min-width: 300px;
  height: 100%;
  max-height: 550px;
  background-color: #050505;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 30;
}

.h100 {
  height: 100%;
}

.p0 {
  padding: 0;
}
.m0 {
  margin: 0;
}

.center {
  display:flex;
  justify-content:center;
  align-items:center;
}

#ImageInModal {
  max-height: 100%;
  margin: 0px auto;
}
</style>
