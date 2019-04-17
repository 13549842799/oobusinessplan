/**
 * 分页的方法
 */
import util from '@/components/common/objUtil'
import http from '@/http.js'

export class MyPage {
  constructor (size) {
    this.pageNum = 1
    if (size) {
      this.pageSize = size
    } else {
      this.pageSize = 15
    }
    this.total = 1
    this.list = []
    this.requestUrl = null
  }
  handleSizeChange (val) {
  }
  handleCurrentChange (val) {
    this.pageNum = val
    this.searchPage()
  }
  addNextLine (val) {
    this.list.push(val)
    this.total++
  }
  searchPage (filter, params) {
    let f = {value: [], key: ['requestUrl']}
    if (filter) {
      if (filter.key) {
        filter.key = filter.key.concat(f.key)
      } else {
        filter.key = f.key
      }
      f = filter
    }
    let p = this
    this.pageNum = 1
    if (params) {
      p = params
    }
    p = util.newNotNullObject(p, f.value, f.key)
    http.$get(this.requestUrl, p).then(res => {
      this.list = res.data.list
      this.total = res.data.total
    })
  }
}
