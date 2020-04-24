export default {
  methods: {
    basicDelete ({obj, objName, delMethod}) {
      let v = this
      if (!obj) {
        v.$message.warning('请选择目标')
        return
      }
      v.$confirm('确定删除' + v.current[objName] + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMethod()
      }).catch(() => {
        v.$message({ type: 'info', message: '已取消删除' })
      })
    },
    simpleLoad (t) {
      return this.$loading({
        lock: true,
        text: t,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  }
}
