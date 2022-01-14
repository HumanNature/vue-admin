<template>
  <div class="login_bj">
    <div class="login_box">
      <div class="logo">
        <div class="logo_box">
          <img src="../assets/logo.png" alt="" />
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
        <el-form-item prop="name">
          <el-input
            prefix-icon="iconfont el-icon-s-custom"
            v-model="ruleForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont el-icon-lock"
            v-model="ruleForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      ruleForm: {
        name: "",
        password: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    this.init();
  },

  methods: {
    submitForm(formName) {
      //   console.log(this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          this.$message.success("登陆成功");
          console.log(this.ruleForm);
        } else {
          this.$message.error("登陆失败，请重新登录");
          console.log(this.ruleForm);
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    init() {},
  },

  watch: {},
};
</script>
<style lang="less" scoped>
.login_bj {
  background-color: #2a4b69;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .login_box {
    width: 7.5rem;
    height: 4.2rem;
    min-height: 250px;
    background-color: #fff;
    border-radius: 0.3rem;
    position: relative;
    .logo {
      position: absolute;
      top: -1.2rem;
      left: 50%;
      transform: translate(-50%, 0);
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
      box-shadow: 1px 1px 7px 1px #eee;
      background-color: #fff;
      overflow: hidden;
      .logo_box {
        width: 100%;
        height: 100%;
        transform: scale(0.9);
        border-radius: 50%;
        background-color: #eee;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.form {
  position: absolute;
  bottom: 0;
  margin: 0 auto;
  padding: 0 0.5rem;
  width: 7.5rem;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>