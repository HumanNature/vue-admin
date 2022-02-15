<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row class="isrow" :getter="20">
        <el-alert
          center
          :closable="false"
          title="添加商品信息"
          type="info"
          show-icon
        >
        </el-alert>
      </el-row>
      <el-row class="isrow" :getter="20">
        <el-steps :active="activeIndex - 0" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </el-row>
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="tabclicked()"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- <el-input v-model="addForm.goods_cat"></el-input> -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProp"
                @change="goodsCatChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('addForm')"
                >立即创建</el-button
              >
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1"
            >商品参数
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="ca"
                  v-for="(ca, i) in item.attr_vals"
                  :key="i"
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- {{manyTableData}} -->
            <!-- {{ manyTableData[0].attr_id }}
            {{ manyTableData[0].attr_name }}
            {{ manyTableData[0].attr_vals }} -->
            <!-- {{manyTableData.attr_id}} -->
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadurl"
              :headers="headerobj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-dialog
              title="图片预览"
              :visible.sync="previewDialogVisible"
              width="50%"
            >
              <!-- <el-image :src="previewPath" fit="fill" :lazy="true"></el-image> -->
              <img class="previewImg" :src="previewPath" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" class="addBtn" @click="addGuill"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { postGoods } from "../../network/goods/goods";
import {
  getCategories,
  getCategoriesList,
} from "../../network/goods/categories";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      activeIndex: "0", //steps选中的序号
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "", //商品介绍
        attrs: [],
      },
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { max: 50, message: "请输入50个字符以下的商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { max: 20, message: "请输入20个字符以下的商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { max: 20, message: "请输入20个字符以下的商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { max: 20, message: "请输入20个字符以下的商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        // fileList: [
        //   {
        //     name: "food.jpeg",
        //     url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        //   },
        //   {
        //     name: "food2.jpeg",
        //     url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        //   }, //上传图片
        // ],
      },
      catelist: [], //商品分类数据
      cateProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTableData: [], //动态参数列表
      onlyTableData: [], //静态属性列表
      uploadurl: "http://127.0.0.1:8888/api/private/v1/upload", // 上传地址
      headerobj: {
        Authorization: window.localStorage.getItem("token"),
      }, //图片上传请求头
      previewPath: "", //点击图片的路径
      previewDialogVisible: false, //点击图片弹出的对话框
    };
  },

  components: {},

  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },

  beforeMount() {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      getCategories().then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        this.catelist = res.data;
        console.log(this.catelist);
        this.$message.success(res.meta.msg);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //商品分类选择项变化事件
    goodsCatChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
        return;
      } else {
        console.log(1);
      }
    },
    //获取当前激活的tab
    tabclicked() {
      if (this.activeIndex === "1") {
        console.log("动态参数面板");
        getCategoriesList(this.cateId, "many").then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
          }
          console.log(res);
          // console.log(res.data.attr_vals.length);
          // this.catelist = res.data;
          // console.log(this.catelist);
          res.data.forEach((item) => {
            console.log(item);
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          });
          this.manyTableData = res.data;
          this.$message.success(res.meta.msg);
        });
      } else if (this.activeIndex === "2") {
        getCategoriesList(this.cateId, "only").then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
          }
          console.log(res);
          // console.log(res.data.attr_vals.length);
          // this.catelist = res.data;
          // console.log(this.catelist);
          // res.data.forEach((item) => {
          //   console.log(item);
          //   item.attr_vals =
          //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          // });
          this.onlyTableData = res.data;
          this.$message.success(res.meta.msg);
        });
      }
    },
    beforeLeave(a, b) {
      console.log("离开" + b + "进入" + a);
      // console.log(this.activeIndex);
      // return false
      //这里不完善，应该判断表单全写完再切换的
      if (b === "0" && this.addForm.goods_cat.length != 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    //点击图片的事件
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true;
      console.log(file);
    },
    //关闭图片事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log(this.addForm);
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => {
        x.pic = filePath;
      });
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    handleSuccess(e) {
      console.log(e);
      if (e.meta.status !== 200) {
        this.$message.error(e.meta.msg);
      }
      const picInfo = {
        pic: e.data.tmp_path,
      };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
      this.$message.success(e.meta.msg);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    addGuill() {
      this.$refs.addFormRef.validate((val) => {
        if (!val) {
          return this.$message.error("请填写必要的表单项");
        }

        const form = _.cloneDeep(this.addForm);
        form.goods_cat = this.addForm.goods_cat.join(",");
        //处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        //处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        console.log(form);
        //发起添加商品请求
        postGoods(form).then(res=>{
           if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
          }
          console.log(res);
          this.$message.success(res.meta.msg);
          this.$router.push('/goods')
        })
      });
    },
  },

  watch: {},
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.isrow {
  margin-bottom: 15px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>