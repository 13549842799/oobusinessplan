<template>
  <el-dialog title="资源赋予列表" :visible.sync="formVisible">
    
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
    }
  },
  methods: {
    open () {
      this.formVisible = true
    },
    submit () {
    }
  }
}
</script>

<style>

</style>
