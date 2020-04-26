<template>
  <el-dialog ref="dia" :title="dialogTitle" :visible.sync="formVisible" width="620px">
    <el-table
    id="resourceCheckTable"
    ref="authResTable"
    :data="resources"
    tooltip-effect="dark"
    style="width: 100%"
    max-height="500px"
    @selection-change="handleSelectionChange">
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
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogSupport from '@/components/common/form/DialogTableSupport'

import resourcesApi from '@/components/system/resources/resourcesApi'

export default {
  mixins: [dialogSupport],
  data () {
    return {
      resources: [],
      auth: {
        displayName: ''
      },
      auRes: []
    }
  },
  created () {
    let v = this
    resourcesApi.resourcesList({}).then(res => {
      v.resources = res
    }).catch(err => { console.log(err) })
  },
  computed: {
    dialogTitle () {
      return this.auth.displayName + '资源管理'
    }
  },
  methods: {
    handleSelectionChange () {
    },
    open (auth) {
      let v = this
      v.auth = auth
      v.formVisible = true
      resourcesApi.resourcesList({authId: auth.id}).then(res => {
        v.auRes = res
        if (!res) {
          return
        }
        res.forEach((r) => {
          v.$refs.authResTable.toggleRowSelection(r)
        })
      }).catch(err => { console.log(err) })
    }
  }
}
</script>

<style scoped>

</style>
