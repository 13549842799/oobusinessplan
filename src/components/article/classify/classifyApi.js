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
  simpleList (p, config) {
    return http.$axiosGet(classifyUrl + '/simples.re', p, config)
  }
}
