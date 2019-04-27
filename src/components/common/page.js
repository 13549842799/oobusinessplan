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
    this.filter = {
      value: [],
      key: [['requestUrl', 'list']]
    }
  }
  handleSizeChange (val) {
  }
  handleCurrentChange (val) {
    this.searchPage(null, null, val)
  }
  /**
   * 添加下一行
   * @param {*} val
   */
  addNextLine (val) {
    if (this.list.length < this.pageSize) {
      this.list.push(val)
    } else {
      this.list = []
      this.list.push(val)
      this.pageNum++
      this.total++
    }
  }
  searchPage (filter, params) {
    this.requestList(filter, params, 1)
  }
  /**
   * 移除一行
   * 1.移除最后一行
   * 2.移除非最后一行
   * @param {*} o
   */
  removeLine (o) {
    let index = this.list.indexOf(o)
    if (index < 0) {
      return
    }
    if (index === this.list.length - 1) {
      if (this.list.length === 1 && this.total > 1) {
        this.requestList(null, null, this.pageNum - 1)
      } else {
        this.list.splice(index, 1)
      }
    }
  }
  /**
   *
   * @param {*} filter 过滤器
   * @param {*} params 自定义参数
   * @param {*} pageNum 跳转的页数
   */
  requestList (filter, params, pageNum) {
    let f = this.filter
    if (filter) {
      if (filter.key) {
        filter.key = filter.key.concat(f.key)
      } else {
        filter.key = f.key
      }
      f = filter
    }
    let p = this
    this.pageNum = pageNum
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
