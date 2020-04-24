import {ouserUrl} from '@/base_variable'
import http from '@/http.js'

export default {
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
    console.log('111')
    return http.$axiosGet(ouserUrl + '/loginUser.re')
  }
}
