<template>
  <div>
    <div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">日记管理</template>
          <el-menu-item index="1-1"><router-link to="Article/Diary">所有日记</router-link></el-menu-item>
          <el-menu-item index="1-2"><router-link :to="{name: 'classify', params: {type: '1'}}">分类管理</router-link></el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">总结管理</template>
          <el-menu-item index="2-1">所有总结</el-menu-item>
          <el-menu-item index="2-2"><router-link :to="{name: 'classify', params: {type: '2'}}">分类管理</router-link></el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">备忘管理</template>
          <el-menu-item index="3-1">所有备忘</el-menu-item>
          <el-menu-item index="3-2"><router-link :to="{name: 'classify', params: {type: '3'}}">分类管理</router-link></el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">灵感管理</template>
          <el-menu-item index="4-1">所有灵感</el-menu-item>
          <el-menu-item index="4-2"><router-link :to="{name: 'classify', params: {type: '4'}}">分类管理</router-link></el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">小说管理</template>
          <el-menu-item index="5-1">所有小说</el-menu-item>
          <el-menu-item index="5-2"><router-link :to="{name: 'classify', params: {type: '5'}}">分类管理</router-link></el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div><router-view></router-view></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '1'
    }
  },
  created () {
    this.$router.push({name: 'classify', params: {type: '1'}})
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>

</style>
