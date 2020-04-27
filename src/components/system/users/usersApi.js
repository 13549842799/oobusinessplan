import {ouserUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  /**
   * 获取分页接口的请求路径
   */
  listUrl () {
    return ouserUrl + '/page.re'
  },
  /**
   * 保存用户
   * @param {*} param
   * @param {*} config
   */
  saveOuser (param, config) {
    if (param.id) {
      return http.$axiosPost(ouserUrl + '/add.do', param, config)
    }
    return http.$axiosPost(ouserUrl + '/update.do', param, config)
  },
  deleteOuser (id) {
    return http.$axiosDel(ouserUrl + '/' + id + '/delete.do')
  },
  logout () {
    return http.$axiosPost(ouserUrl + '/logout')
  },
  /**
  * 获取当前登录的个人信息
  */
  getUsers () {
    return http.$axiosGet(ouserUrl + '/loginUser.re')
  }
}
