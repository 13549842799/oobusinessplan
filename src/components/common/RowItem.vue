<template>
  <div class="rowItem">
    <label v-if="title" class="el-label" :class="{'row-inline': inline}">{{title}}</label>
    <div class="row-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'row-Item',
  props: ['title', 'inline']
}
</script>

<style scoped>
label {
  width: 80px;
}
.rowItem {
  margin-bottom: 15px;
  clear: both;
}
.el-label {
  text-align: right;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.row-content {
  margin-left: 80px;
}
.row-inline {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
</style>
