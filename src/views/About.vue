<template>
  <div>
    <div class="box">
      <img class="img1" src="../assets/huashi.png" alt="" />
      <img class="img2" src="../assets/bottom.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    this.init();
  },

  methods: {
    init() {},
  },

  watch: {},
};
</script>
<style lang='less'  scoped>
.box {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  background: url("../assets/texture.png");
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .img1 {
    // width: 100%;
    height: 100%;
    // margin: 0 auto;
  }
}
.img2 {
  width: 6.5rem;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  // display: none;
}
</style>