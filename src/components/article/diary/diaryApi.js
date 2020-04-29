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
  /**
   * 保存日记
   * @param {Object} p
   * @param {Object} config
   */
  saveDiary (p, config) {
    return http.$axiosPost(diaryUrl + '/save.do', p, config)
  },
  /**
   * 删除日记
   * @param {*} id
   */
  deleteDiary (id) {
    return http.$axiosDel(diaryUrl + '/' + id + '/delete.do')
  },
  /**
   * 获取指定的日志
   * @param {Number} id
   * @param {*} config
   */
  getDiary (id, config) {
    return http.$axiosGet(diaryUrl + '/' + id + '/diary.re', {}, config)
  }
}
