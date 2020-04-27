<template>
  <el-dialog ref="userRoles" :title="title" :visible.sync="open" @open="openEvent" @opened="openFinish" width="500px">
    <el-table
      ref="rolesTable"
      :data="roles"
      tooltip-effect="dark"
      @select="alterSelect"
      @selection-change="handleSelectionChange"
      :max-height="700"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="displayName"
        label="显示名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名"
        width="205">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogSupport from '@/components/common/form/DialogTableSupport'

import rolesApi from '@/components/system/roles/rolesApi'

export default {
  mixins: [dialogSupport],
  data () {
    return {
      roles: [],
      inRole: new Map(),
      reRole: new Map()
    }
  },
  created () {
    let v = this
    rolesApi.getList().then(res => {
      v.roles = res
    }).catch(err => { console.log(err) })
  },
  computed: {
    title () {
      return '角色管理[当前用户：' + (this.obj !== null ? this.obj.username : '') + ']'
    }
  },
  methods: {
    alterSelect (selection, row) {
      let v = this
      let state = selection.includes(row)
      let a = state ? v.inRole : v.reRole
      let b = state ? v.reRole : v.inRole
      a.set(row.id, row) && b.has(row.id) && b.delete(row.id)
    },
    handleSelectionChange (val) {
      // console.log(val)
    },
    openFinish () {
    },
    openEvent () {
      let v = this
      rolesApi.getList({userId: v.obj.id}).then(res => {
        if (v.$refs.rolesTable && res !== null && res.length > 0) {
          res.forEach(r => {
            let t = v.roles.find((a) => { return r.id === a.id })
            v.$refs.rolesTable.toggleRowSelection(t, true)
          })
        }
      }).catch(err => { console.log(err) })
    },
    submit () {
      let v = this
      let ar = [...v.inRole.keys()].join(',')
      let br = [...v.reRole.keys()].join(',')
      if (ar === '' && br === '') {
        v.$message.warning('没有进行修改')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '拼死保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      rolesApi.addRolesToOuser(v.obj.id, ar, br, {complete: () => { loading.close() }}).then(res => {
        v.$message.success('修改成功')
      }).catch(err => { err.data && err.data.message && v.$message.warning(err.data.message) })
    },
    filterHandler () {

    }
  },
  watch: {
    obj: function (val, old) {
      if (this.$refs['rolesTable']) {
        this.$refs['rolesTable'].clearSelection()
      }
    }
  }
}
</script>

<style>

</style>
