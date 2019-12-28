<template>
  <div style="height: 100%;">
    <div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">{{getSupName(1)}}</template>
          <el-menu-item index="1-1"><router-link :to="{name: 'diary'}">所有日记</router-link></el-menu-item>
          <!-- <el-menu-item index="1-2"><router-link :to="{name: 'classify', query: {type: '1'}}">分类管理</router-link></el-menu-item> -->
        </el-submenu>
        <!-- <el-submenu index="2">
          <template slot="title">{{getSupName(2)}}</template>
          <el-menu-item index="2-1">所有总结</el-menu-item>
        </el-submenu> -->
        <el-submenu index="3">
          <template slot="title">{{getSupName(3)}}</template>
          <el-menu-item index="3-1">所有备忘</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">{{getSupName(4)}}</template>
          <el-menu-item index="4-1">所有灵感</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">{{getSupName(5)}}</template>
          <el-menu-item index="5-1">所有小说</el-menu-item>
        </el-submenu>
        <el-submenu index="7">
          <template slot="title">{{getSupName(7)}}</template>
          <el-menu-item index="7-1"><router-link :to="{name: 'classify'}">分类列表</router-link></el-menu-item>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">{{getSupName(6)}}</template>
          <el-menu-item index="6-1"><router-link :to="{name: 'label'}">标签管理</router-link></el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div>
      <el-breadcrumb style="margin-top:10px;margin-left:20px;" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{superName}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentTag}}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const nameArr = ['日记管理', '总结管理', '备忘管理', '灵感管理', '小说管理', '标签管理', '分类管理']

export default {
  data () {
    return {
      activeIndex: '1',
      currentIndex: 1,
      currentTag: null
    }
  },
  created () {
    this.$router.push({name: 'diary'})
  },
  computed: {
    superName () {
      return this.getSupName(this.currentIndex)
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.currentIndex = parseInt(keyPath[0])
    },
    getSupName (index) {
      return nameArr[index - 1]
    }
  },
  watch: {
    '$route': function (to, from) {
      this.currentTag = to.meta.name
    }
  }
}
</script>

<style scoped>

</style>
