/**
 * 公共的方法
 */

export default {
  methods: {
    simpleDealResult (status, success, fail, error, mes) {
      switch (status) {
        case 200:
          let res = success()
          if (res) {
            this.$message({
              message: res,
              type: 'success'
            })
          }
          break
        case 100:
          if (mes) {
            console.log(mes)
            break
          }
          this.$message({
            message: fail, type: 'warning'
          })
          break
        case 400:
          if (mes) {
            console.log(mes)
            break
          }
          this.$message({
            message: error,
            type: 'error'
          })
          break
      }
    }
  }
}
