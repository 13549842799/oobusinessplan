<template>
  <div class="daskPanel" v-if="visable">
    <div class="self_dialog">
      <div class="title">
        <span>{{title}}</span>
        <el-button type="text" class="closeButton" @click="closeDialog">关闭</el-button>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {
      visable: false
    }
  },
  methods: {
    closeDialog () {
      this.visable = false
    }
  },
  created () {}
}
</script>

<style>
.daskPanel {
  position:fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #909399;
  z-index: 999;
  background: rgba(0, 0, 0, .3);
}

.self_dialog {
  background-color: #FFFFFF;
  width: 400px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /*向左向上分别平移自身的一半*/
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  border: 1px solid #EBEEF5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
  border-radius: 5px;
}

.title {
  width: 100%;
  height: 40px;
  box-shadow: 1px -1px 5px #bbb;
  font-size: 18px;
  line-height: 40px;
  background-color: #909399;
  color: #FFFFFF;
  position: relative;
}

.title span {
  margin-left: 5px;
}

.closeButton {
  position:absolute;
  right: 10px;
}

.content {
  overflow-y: auto;
  height: 450px;
}
</style>
