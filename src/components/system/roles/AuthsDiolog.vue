<template>
  <el-dialog title="资源赋予列表" :visible.sync="formVisible">
    <el-table
      ref="resAuthTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="资源名">
              <span>{{ props.row.resources }}</span>
            </el-form-item>
            <el-form-item label="请求">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="权限名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="displayName"
        label="权限真名"
        width="120">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      formVisible: false, // 表单显示和隐藏的开关
      list: []
    }
  },
  methods: {
    open () {
      this.formVisible = true
    },
    handleSelectionChange (val) {
      
    },
    submit () {
    }
  }
}
</script>

<style>

</style>
