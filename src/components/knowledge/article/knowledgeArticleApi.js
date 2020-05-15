import {articleUrl} from '@/base_variable'
import http from '@/http.js'

/**
 * 日记的api接口
 */
export default {
  /**
   * 文章分页接口的请求路径
   */
  listUrl () {
    return articleUrl + '/page.re'
  },
  /**
   * 保存文章
   * @param {Object} p
   * @param {Object} config
   */
  saveEntity (p, config) {
    return http.$axiosPost(articleUrl + '/save.do', p, config)
  },
  /**
   * 删除文章
   * @param {*} id
   */
  deleteEntity (id) {
    return http.$axiosDel(articleUrl + '/' + id + '/delete.do')
  },
  /**
   * 获取指定的文章
   * @param {Number} id
   * @param {*} config
   */
  getEntity (id, config) {
    return http.$axiosGet(articleUrl + '/' + id + '/article.re', {}, config)
  }
}
