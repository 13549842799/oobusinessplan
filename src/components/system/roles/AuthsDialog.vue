<template>
  <el-dialog ref="authDia" :title="title" :visible.sync="open" @open="openEvent" @opened="openFinish" width="500px">
    <el-table
      ref="authTable"
      :data="auths"
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
        prop="authName"
        label="权限名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="displayName"
        label="权限真名"
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

import authsApi from '@/components/system/authorities/authoritiesApi'

export default {
  mixins: [dialogSupport],
  data () {
    return {
      auths: [],
      inAuthIds: '',
      reAuthIds: '',
      inAuth: new Map(),
      reAuth: new Map()
    }
  },
  created () {
    let v = this
    authsApi.getSimpleAuthsList().then(res => {
      v.auths = res
    }).catch(err => { console.log(err) })
  },
  computed: {
    title () {
      return '权限管理[' + (this.obj !== null ? this.obj.displayName : '') + ']'
    }
  },
  methods: {
    alterSelect (selection, row) {
      let v = this
      // console.log(selection)
      // console.log(row)
      let state = selection.includes(row)
      let a = state ? v.inAuth : v.reAuth
      let b = state ? v.reAuth : v.inAuth
      a.set(row.id, row) && b.has(row.id) && b.delete(row.id)
      console.log('新增', v.inAuth)
      console.log('删除', v.reAuth)
    },
    handleSelectionChange (val) {
      // console.log(val)
    },
    openFinish () {
    },
    openEvent () {
      let v = this
      authsApi.getSimpleAuthsList({roleId: v.obj.id}).then(res => {
        if (v.$refs.authTable && res !== null && res.length > 0) {
          res.forEach(r => {
            let t = v.auths.find((a) => { return r.id === a.id })
            v.$refs.authTable.toggleRowSelection(t)
          })
        }
      }).catch(err => { console.log(err) })
    },
    submit () {

    }
  },
  watch: {
    obj: function (val, old) {
      if (this.$refs['authTable']) {
        this.$refs['authTable'].clearSelection()
      }
    }
  }
}
</script>

<style>

</style>
