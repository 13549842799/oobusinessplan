<template>
  <div class="center-container">
    <div class="head"><span class="title">个人中心</span></div>
    <hr>
    <div class="center-body">
      <div class="center-left">
        <el-card>
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
          <component v-bind:is="activeNames"></component>
        </el-card>
      </div>
      <div class="center-right">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      moduleArr: [
        {name: '个人信息', key: 1}, {name: '工作相关', key: 2}
      ]
    }
  },
  methods: {
    handleChange () {}
  }
}
</script>

<style scoped>
.center-container{
  position: relative;
}

.center-body {
  position: relative;
  width: 100%;
  height: 500px;
}

.center-body > div {
  float: left;
  height: 100%;
}

.center-left {
 width: 80%
}

.center-right {
  width: 20%;
}

.head {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
}

.head .title {
  font-size: 18px;
  margin-left: 20px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

.avatar-img-div {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.clearfix:after {
  clear: both
}
</style>
