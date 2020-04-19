import {MyPage} from '@/components/common/page/page'

export default {
  data () {
    return {
      page: null
    }
  },
  methods: {
    /**
     * 创建page对象
     * @param {*} param0
     */
    createPage ({url, pageSize, total}) {
      return new MyPage(pageSize, {url, total})
    },
    /**
     * 调换页
     */
    currentChange (val) {
      this.page.requestList(null, null, val)
    },
    /**
     * 表格选择行时触发的方法
     */
    handleCurrentChange (currentRow, oldCurrentRow) {
      this.current = currentRow
    }
  }
}
