import {diaryUrl} from '@/base_variable'
import http from '@/http.js'

/**
 * 日记的api接口
 */
export default {
  /**
   * 日记分页接口的请求路径
   */
  listUrl () {
    return diaryUrl + '/page.re'
  },
  saveDiary () {
  },
  /**
   * 删除日记
   * @param {*} id
   */
  deleteDiary (id) {
    return http.$axiosDel(diaryUrl + '/' + id + '/delete.do')
  }
}
