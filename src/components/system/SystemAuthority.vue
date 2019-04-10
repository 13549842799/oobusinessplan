<template>
<div>
  <el-tabs type="border-card">
    <el-tab-pane label="资源操作">
      <resourcesOption></resourcesOption>
    </el-tab-pane>
    <el-tab-pane label="角色管理">
      <roles-manager></roles-manager>
    </el-tab-pane>
    <el-tab-pane label="用户角色分配">
      <users-role-manager></users-role-manager>
    </el-tab-pane>
    <el-tab-pane label="参数设置">
      <div class="tap"><param-manager></param-manager></div>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import resourcesOption from './SystemAuthority/ResourcesOption'
import rolesManager from './SystemAuthority/RolesManager'
import usersRoleManager from './SystemAuthority/UserRoleManager'
import paramManager from './SystemAuthority/ParamManager'

export default {
  components: {
    resourcesOption,
    rolesManager,
    usersRoleManager,
    paramManager
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
