import {labelUrl} from '@/base_variable'
import http from '@/http.js'

/**
 * 日记的api接口
 */
export default {
  /**
   * 标签分页接口的请求路径
   */
  listUrl () {
    return labelUrl + '/page.re'
  },
  /**
   * 标签的类型
   * @param {Number} type
   */
  frequentlyUsedList (type) {
    return http.$axiosGet(labelUrl + '/frequently-used.re', {type})
  }
}
