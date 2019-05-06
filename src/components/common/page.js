/**
 * 分页的方法
 */
import util from '@/components/common/objUtil'
import http from '@/http.js'

export class MyPage {
  constructor (size) {
    this.pages = 1 // 总页数
    this.pageNum = 1
    if (size) {
      this.pageSize = size
    } else {
      this.pageSize = 15
    }
    this.total = 1 // 总条数
    this.list = []
    this.requestUrl = null
    this.config = {
      status: false // page状态 true表示增在请求页面中 false 表示请求结束或无请求
    }
    this.filter = {
      value: [null],
      key: ['requestUrl', 'list', 'pages', 'filter', 'config']
    }
  }
  handleSizeChange (val) {
  }
  /**
   * 跳转到目标的页
   * @param {*} val 页数
   */
  handleCurrentChange (val) {
    this.searchPage(null, null, val)
  }
  /**
   * 添加下一行, 如果添加后当前页的总条数没有超过最大条数pageSize，则只添加当天的记录，
   * 否则添加记录的同时页数和总页数都自增1
   * @param {*} val
   */
  addNextLine (val) {
    if (this.list.length < this.pageSize) {
      this.list.push(val)
    } else {
      this.list = []
      this.list.push(val)
      this.pageNum++
      this.pages++
    }
  }
  /**
   * 根据过滤和条件查询第一页
   * @param {Object} filter 过滤的参数或者值
   * @param {Object} params 查询的条件
   */
  searchPage (filter, params) {
    this.requestList(filter, params, 1)
  }
  /**
   * 追加一行，不是替换原本的list，而是把新查询出来的一页追加到原本的list后面
   * 如果新查询的一页大于总页数，则不执行
   * @param {Object} filter 过滤的参数或者值
   * @param {Object} params 查询的条件
   * @param {Number} pageNum 追加哪一页
   * @param {Object} config 配置信息
   */
  appendPage (filter, params, pageNum, config) {
    if (pageNum > this.pages) {
      return
    }
    config.append = true
    this.requestList(filter, params, pageNum, config)
    if (config.changePage === true) {
      this.pageNum = pageNum
    }
  }
  /**
   * 在原本列表的基础上追加下一页的列表，并把页数+1
   * @param {Object} filter 过滤的参数或者值
   * @param {Object} params 查询的条件
   */
  appendNextPage (filter, params, config) {
    config = config ? config : {}
    config.changePage = true
    this.appendPage(filter, params, this.pageNum + 1, config)
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
    if (index === this.list.length - 1 && this.list.length === 1 && this.total > 1) {
      this.requestList(null, null, this.pageNum - 1)
    } else {
      this.list.splice(index, 1)
    }
  }
  /**
   *
   * @param {*} filter 过滤器
   * @param {*} params 自定义参数
   * @param {*} pageNum 跳转的页数
   * @param {*} config 配置对象  存放配置信息  append:Boolean loading:Boolean
   */
  requestList (filter, params, pageNum, config) {
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
    let par = p // 参数
    this.pageNum = pageNum
    if (params) {
      par = params
    }
    par = util.newNotNullObject(par, f.value, f.key)
    let append = false
    if (config) {
      p.config.status = config.loading === true ? true : false // 是否开启加载显示的配置
      append = config.append === true ? true : false //是否开启追加的配置
    }
    http.$get(this.requestUrl, par).then(res => {
      this.list = append === true ? this.list.concat(res.data.list) : res.data.list
      this.total = res.data.total
      this.pages = res.data.pages
    }, null, res => {
      p.config.status = false   
    })
  }
}
