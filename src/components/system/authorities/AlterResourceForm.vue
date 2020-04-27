<template>
  <el-dialog ref="dia" :title="title" :visible.sync="open" @open="openEvent" @opened="openFinish" width="620px">
    <el-table
    ref="authResTable"
    :data="resources"
    tooltip-effect="dark"
    style="width: 100%"
    @select="alterSelect"
    @selection-change="handleSelectionChange"
    max-height="500px">
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
      prop="typeStr"
      label="类型"
      width="120">
      </el-table-column>
      <el-table-column
      label="显示名"
      prop="displayName"
      width="170">
      </el-table-column>
      <el-table-column
      prop="url"
      label="请求路径"
      width="210">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogSupport from '@/components/common/form/DialogTableSupport'
import {arrToStr} from '@/components/common/commonUtil'

import resourcesApi from '@/components/system/resources/resourcesApi'

export default {
  mixins: [dialogSupport],
  data () {
    return {
      resources: [],
      auRes: [],
      selects: []
    }
  },
  created () {
    let v = this
    resourcesApi.resourcesList({}).then(res => {
      v.resources = res
    }).catch(err => { console.log(err) })
  },
  computed: {
    title () {
      return '资源管理[当前权限：' + (this.obj !== null ? this.obj.displayName : '') + ']'
    }
  },
  methods: {
    handleSelectionChange () {
    },
    alterSelect (selection, row) {
      this.selects = selection
    },
    openEvent () {
      let v = this
      resourcesApi.resourcesList({authId: v.obj.id}).then(res => {
        if (v.$refs.authResTable && res !== null && res.length > 0) {
          res.forEach(r => {
            let t = v.resources.find((a) => { return r.id === a.id })
            v.$refs.authResTable.toggleRowSelection(t, true)
          })
        }
      }).catch(err => { console.log(err) })
    },
    openFinish () {
    },
    submitForm () {
      let v = this
      if (v.selects.length === 0) {
        v.$message.warning('没有进行修改')
        return
      }
      const loading = v.$loading({
        lock: true,
        text: '拼死保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let ids = arrToStr(v.selects, 'id')
      resourcesApi.alterResourcesAuth(v.obj.id, ids, {complete: () => { loading.close() }}).then(res => {
        v.$message.success('修改成功')
      }).catch(err => { err.data && err.data.message && v.$message.warning(err.data.message) })
    }
  },
  watch: {
    obj: function (val, old) {
      if (this.$refs['authResTable']) {
        this.$refs['authResTable'].clearSelection()
      }
    }
  }
}
</script>

<style scoped>

</style>
