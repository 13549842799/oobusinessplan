import {authUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  listUrl () {
    return authUrl + '/page.re'
  },
  saveAuth (params, config) {
    if (params.id) {
      return http.$axiosPat(authUrl + '/edit.do', params, config)
    }
    return http.$axiosPost(authUrl + '/add.do', params, config)
  },
  /**
   * 为角色添加权限
   * @param {*} roleId
   * @param {*} inAuthIds 新增的权限id字符串
   * @param {*} reAuthIds 移除的权限id字符串
   * @param {*} config
   */
  addAuthsToRoles (roleId, inAuthIds, reAuthIds, config) {
    return http.$axiosPost(authUrl + '/addAuthstoRole.do', {roleId, inAuthIds, reAuthIds}, config)
  },
  /**
   * 为用户添加权限
   * @param {*} userId 用户id
   * @param {*} inAuthIds 新增的权限id字符串
   * @param {*} reAuthIds 移除的权限id字符串
   * @param {*} config
   */
  addAuthsToOuser (userId, inAuthIds, reAuthIds, config) {
    return http.$axiosPost(authUrl + '/addAuthstoUser.do', {userId, inAuthIds, reAuthIds}, config)
  },
  deleteAuths (id) {
    return http.$axiosDel(authUrl + '/' + id + '/delete.do')
  },
  /**
   * 获取简单的权限列表接口
   * @param {*} params 接口参数
   * @param {*} config 额外配置
   */
  getSimpleAuthsList (params, config) {
    return http.$axiosGet(authUrl + '/simpleList.re', params, config)
  }
}
