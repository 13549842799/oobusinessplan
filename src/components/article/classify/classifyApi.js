import {classifyUrl} from '@/base_variable'
import http from '@/http.js'

/**
 * 分类接口的api文件
 */
export default {
  /**
   * 分页接口的请求路径
   */
  listUrl () {
    return classifyUrl + '/page.re'
  },
  /**
   * 保存分类
   * @param {*} p
   * @param {*} config
   */
  saveClassify (p, config) {
    return http.$axiosPost(classifyUrl + '/save.do', p, config)
  },
  /**
   * 删除分类
   * @param {*} id
   */
  deleteClassify (id) {
    return http.$axiosDel(classifyUrl + '/' + id + '/delete.do')
  },
  simpleList (p, config) {
    return http.$axiosGet(classifyUrl + '/simples.re', p, config)
  }
}
