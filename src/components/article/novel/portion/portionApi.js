import {portionUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  savePortion (p, config) {
    return http.$axiosPost(portionUrl + '/save.do', p, config)
  },
  deletePortion (id) {
    return http.$axiosDel(portionUrl + '/' + id + '/delete.do')
  },
  /**
   * @param {Number} novel
   * @param {Object} p
   * @param {*} config
   */
  getPortionsList (novel, p, config) {
    return http.$axiosGet(portionUrl + '/' + novel + '/list.re', p, config)
  },
  getPortion (id) {
    return http.$axiosGet(portionUrl + '/' + id + '/portion.re')
  }
}
