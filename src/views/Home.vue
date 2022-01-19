<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header class="home_header">
      <div class="header_logo_box">
        <div class="header_logo">
          <img src="" alt="" />
        </div>
        <div class="header_name">后台管理系统</div>
      </div>
      <div class="header_quit">
        <el-button type="info" @click="quit">退出</el-button>
      </div>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左部区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button" @click="isCollapse = !isCollapse">|||</div>
        <el-menu
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
          background-color="#323743"
          text-color="#E7F3FF"
          active-text-color="#E7F3FF"
          :unique-opened="true"
          :collapse-transition="false"
          router
        >
          <el-submenu
            :index="item.id + ' '"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>

              <!-- <span>{{ item }}</span> -->
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <i :class="iconsObj[subitem.id]"></i>
              <span slot="title">{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右部区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      isCollapse: false,
      menuList: [],
      iconsObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-check",
        101: "el-icon-s-shop",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",

        110: "el-icon-menu",
        111: "el-icon-menu",
        112: "el-icon-menu",
        104: "el-icon-menu",
        115: "el-icon-menu",
        121: "el-icon-menu",
        107: "el-icon-menu",
        146: "el-icon-menu",
      },
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    this.init();
  },
  created() {
    this.getMenu();
  },
  methods: {
    quit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenu() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.menuList = res.data;
      console.log(res);
    },
    init() {},
  },

  watch: {},
};
</script>
<style>
/* .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
} */
</style>
<style lang="less" scoped>
.el-header {
  background-color: #373d3f;
  color: #eee;
  padding: 0 10px 0 0;
}
.el-aside {
  background-color: #323743;
  color: #eee;
}
.el-main {
  background-color: #e9edf0;
  color: #333;
  padding: 0;
}
.el-icon {
  margin-right: 10px;
}
.el-menu {
  border-right: none; //解决侧边栏展开没对齐的bug
}
.home_container {
  height: 100vh;
  .home_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header_logo_box {
      display: flex;
      align-items: center;
      .header_logo {
        width: 60px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
          background-color: #f00;
          border-radius: 50%;
        }
      }
      .header_name {
        margin-left: 10px;
        font-size: 25px;
      }
    }
  }
}
.toggle_button {
  background-color: rgb(65, 65, 65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 2px;
  letter-spacing: 5px;
  color: #fff;
  cursor: pointer;
}
</style>