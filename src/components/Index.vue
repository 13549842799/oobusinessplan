<template>
  <el-container>
    <el-header height="60px" style="padding: 0;">
      <head-menu></head-menu>
    </el-header>
    <el-main style="padding: 0">
      <div class="left-side-container">
        <left-side :width="leftside.width" :extendAble="true" v-bind:widthChange="widthChange"></left-side>
      </div>
      <div class="main-container" :style="{width: autoWidth}">
        <div class="main-container-main">
          <router-view></router-view>
        </div>
        <div class="foot-container">
          © 2019-2020 聊天鬼才 . All rights reserved.
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import http from './../http'
import router from './../router'
import headMenu from './HeadMenu'
import leftSide from './LeftSide'

export default {
  data () {
    return {
      leftside: {
        items: [],
        width: 150
      }
    }
  },
  components: {
    headMenu,
    leftSide
  },
  computed: {
    autoWidth () {
      return (1200 - this.leftside.width) + 'px'
    }
  },
  created () {
    // 中心页面跳转到首页
    router.push('/Home')
    // 设置头信息 header
    http.$setHeadersFromLocal()
  },
  methods: {
    widthChange (width) {
      this.leftside.width = width
    }
  }
}
</script>

<style>
.main-container, .left-side-container {
  float: left;
  height: 650px;
  transition: width 0.6s;
  -webkit-transition: width 0.6s; /* Safari */
}

.main-container-main {
  height: 95%;
}

.foot-container {
  width: 100%;
  height: 10px;
  text-align: center;
}

</style>
