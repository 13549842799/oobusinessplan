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
      <users-manager></users-manager>
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
import usersManager from './SystemAuthority/UserManager'

export default {
  components: {
    resourcesOption,
    rolesManager,
    usersManager
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
