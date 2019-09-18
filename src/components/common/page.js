/**
 * 分页的方法
 */
import util from '@/components/common/objUtil'
import http from '@/http.js'

export class MyPage {
  constructor (size, {url, total, params}) {
    this.pages = 1 // 总页数
    this.pageNum = 1
    if (size) {
      this.pageSize = size
    } else {
      this.pageSize = 15
    }
    this.loading = false // 是否正在请求加载列表
    this.params = util.validObj(params) ? params : {}
    this.total = util.validObj(total) ? total : 1 // 总条数
    this.list = []
    this.requestUrl = util.validObj(url) ? url : null
    this.filter = {
      value: [null],
      key: ['requestUrl', 'list', 'pages', 'filter', 'config']
    }
    this.searchPage()
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
    config = util.validObj(config) ? config : {}
    config.append = true
    this.requestList(filter, params, pageNum, config)
  }
  /**
   * 在原本列表的基础上追加下一页的列表，并把页数+1
   * @param {Object} filter 过滤的参数或者值
   * @param {Object} params 查询的条件
   */
  appendNextPage (config) {
    config = util.validObj(config) ? config : {}
    this.appendPage(config.filter, config.params, this.pageNum + 1, config)
  }
  /**
   * 追加模式下的增加一行
   * 1.判断当前页是否正常： 没有大于最大页 ，错误返回false
   * 2.如果当前页不是最大页，则直接返回true
   * 3.当前页为最后一页，则在列表末尾添加val，并且判断当前总条数是否小于最大可容纳条数
   *   如果超过了，则总页数和当前页自增1
   * @param {Object} val
   */
  appendNextLine (val) {
    this.total++
    return this.pageNum <= this.pages && (this.pageNum < this.pages || (this.list.push(val) && (this.total < this.pageNum * this.pageSize || (this.pages++ && this.pageNum++))))
  }
  /**
   * 移除一行
   * 1.移除最后一行
   * 2.移除非最后一行
   * @param {*} o
   */
  removeLine (o, type = false) {
    let index = this.list.indexOf(o)
    if (index < 0) {
      return
    }
    if (this.pageNum === this.pages && this.list.length > 1) { // 如果是最后一页并且当页条数大于1，则只需要移除行
      this.list.splice(index, 1)
      return
    }
    // 如果当页的条数大于1则刷新页面，如果等于1则向前翻一页
    let pn = this.list.length === 1 ? this.pageNum - 1 : this.pageNum
    this.requestList(null, null, pn)
  }
  /**
   *请求一页，如果传入了过滤器，则过滤发送请求中包含的字段
   *如果传入了参数，则把传入的params替换page的params。
   *修改当前page的pageNum， 如果传入了config则根据需要开启config
   *获取返回结果后，替换或追加list，替换总页数(pages)，替换总条数(total)
   * @param {*} filter 过滤器
   * @param {*} params 自定义参数
   * @param {*} pageNum 跳转的页数
   * @param {*} config 配置对象  存放配置信息  append:Boolean loading:Boolean
   */
  requestList (filter, params, pageNum, config) {
    if (this.loading) {
      return
    }
    this.loading = true
    let f = this.filter
    if (filter) {
      filter.key = util.validObj(filter.key) ? filter.key.concat(f.key) : f.key
      f = filter
    }
    let p = this
    let par = util.validObj(params) ? params : p.params // 参数
    par.pageNum = pageNum
    par.pageSize = p.pageSize
    par = util.newNotNullObject(par, f.value, f.key)
    let append = false
    let changePage = true
    if (config) {
      if (config.loading) {
        config[config.loading] = true // 是否开启加载显示的配置
      }
      append = config.append === true // 是否开启追加的配置
      changePage = config.changePage === null || config.changePage === undefined || config.changePage === true
    }
    http.$axiosGet(p.requestUrl, par, {complete: pageComplete(config)}).then(res => {
      p.list = append === true ? p.list.concat(res.list) : res.list
      p.total = res.total
      p.pages = res.pages
      p.pageNum = changePage ? res.pageNum : p.pageNum
      p.pageSize = res.pageSize
      p.loading = false
    }).catch(err => {
      p.loading = false
      console.log(err)
    })
  }
}

let pageComplete = config => {
  return () => {
    if (config) {
      if (config.loading) {
        config[config.loading] = false
      }
    }
  }
}
