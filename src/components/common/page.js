/**
 * 分页的方法
 */

export default {
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 1,
        list: []
      }
    }
  },
  methods: {
    handleCurrentChange (val) {
      let v = this
      v.page.pageNum = val
    },
  }
}
