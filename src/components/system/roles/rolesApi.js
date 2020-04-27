import {roleUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  listUrl () {
    return roleUrl + '/page.re'
  },
  saveRole (params, config) {
    if (params.id) {
      return http.$axiosPat(roleUrl + '/edit.do', params, config)
    }
    return http.$axiosPost(roleUrl + '/add.do', params, config)
  },
  /**
   * 给用户添加角色
   * @param {*} userId
   * @param {*} addRoleIds 增加的角色
   * @param {*} removeRoleIds 移除的角色
   * @param {*} config
   */
  addRolesToOuser (userId, addRoleIds, removeRoleIds, config) {
    return http.$axiosPost(roleUrl + '/addToUser.do', {userId, addRoleIds, removeRoleIds}, config)
  },
  deleteRoles (id) {
    return http.$axiosDel(roleUrl + '/' + id + '/delete.do')
  },
  /**
   * 获取角色列表
   * @param {*} p
   * @param {*} config
   */
  getList (p, config) {
    return http.$axiosGet(roleUrl + '/list.re', p, config)
  }
}
