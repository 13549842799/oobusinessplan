<template>
  <el-dialog ref="userAuthsDia" :title="title" :visible.sync="open" @open="openEvent" @opened="openFinish" width="1050px">
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
      <el-table-column
        label="关联资源"
        width="550">
        <template slot-scope="scope">
          <el-tag
            style="margin-left: 5px;margin-bottom:5px"
            v-for="r in scope.row.resources"
            :key="r.url"
            :type="r.type === 1 ? 'success' : (r.type === 2 ? 'info' : 'warning')"
            effect="dark">
            {{ r.displayName + (r.url !== null ? '(' + r.url + ')' : '') }}
          </el-tag>
        </template>
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
      inAuth: new Map(),
      reAuth: new Map()
    }
  },
  created () {
    let v = this
    authsApi.getSimpleAuthsList({withRes: 1}).then(res => {
      v.auths = res
    }).catch(err => { console.log(err) })
  },
  computed: {
    title () {
      return '直连权限管理[当前用户：' + (this.obj !== null ? this.obj.username : '') + ']'
    }
  },
  methods: {
    alterSelect (selection, row) {
      let v = this
      let state = selection.includes(row)
      let a = state ? v.inAuth : v.reAuth
      let b = state ? v.reAuth : v.inAuth
      a.set(row.id, row) && b.has(row.id) && b.delete(row.id)
    },
    handleSelectionChange (val) {
      // console.log(val)
    },
    openFinish () {
    },
    openEvent () {
      let v = this
      authsApi.getSimpleAuthsList({userId: v.obj.id}).then(res => {
        if (v.$refs.authTable && res !== null && res.length > 0) {
          res.forEach(r => {
            let t = v.auths.find((a) => { return r.id === a.id })
            v.$refs.authTable.toggleRowSelection(t, true)
          })
        }
      }).catch(err => { console.log(err) })
    },
    submit () {
      let v = this
      let ar = [...v.inAuth.keys()].join(',')
      let br = [...v.reAuth.keys()].join(',')
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
      authsApi.addAuthsToOuser(v.obj.id, ar, br, {complete: () => { loading.close() }}).then(res => {
        v.$message.success('修改成功')
      }).catch(err => { err.data && err.data.message && v.$message.warning(err.data.message) })
    },
    filterHandler () {

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
