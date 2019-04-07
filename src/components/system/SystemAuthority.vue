<template>
<div>
  <el-tabs type="border-card">
    <el-tab-pane label="资源操作">
      <resourcesOption></resourcesOption>
    </el-tab-pane>
    <el-tab-pane label="角色管理">
      <roles-manager></roles-manager>
    </el-tab-pane>
    <el-tab-pane label="用户管理">
      <div class="tap">用户管理</div>
    </el-tab-pane>
    <el-tab-pane label="参数设置">
      <div class="tap">参数设置</div>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import resourcesOption from './SystemAuthority/ResourcesOption'
import rolesManager from './SystemAuthority/RolesManager'

export default {
  components: {
    resourcesOption,
    rolesManager
  },
  created () {
  },
  methods: {
  },
  data () {
    return {
    }
  }
}

</script>

<style scoped>
</style>
