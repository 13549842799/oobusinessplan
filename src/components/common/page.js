/**
 * 分页的方法
 */
import commonM from '@/components/common/commonMixins'
import util from '@/components/common/objUtil'
import http from '@/http.js'

export default {
  mixins: [commonM],
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 1,
        list: [],
        requestUrl: null
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      let v = this
      v.page.pageNum = val
      v.searchPage(v.page)
    },
    addNextLine (val) {
      let p = this.page
      p.list.push(val)
      p.total++
    },
    searchPage (filter, params) {
      let v = this
      let f = {value: [], key: ['requestUrl']}
      if (filter) {
        if (filter.key) {
          filter.key = filter.key.concat(f.key)
        } else {
          filter.key = f.key
        }
        f = filter
      }
      let p = v.page
      if (params) {
        p = params
      }
      console.log('url:', p.requestUrl)
      p = util.newNotNullObject(p, f.value, f.key)
      http.$get(v.page.requestUrl, p).then(res => {
        v.simpleDealResult(res.status, function () {
          v.page.list = res.data.list
          v.page.total = res.data.total
        }, res.message)
      })
    }
  }
}
