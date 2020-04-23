import {resouUrl} from '@/base_variable'
import http from '@/http.js'

/**
 * 资源模块的api
 */
export default {
  /**
   * 获取资源分页接口的请求url路径
   */
  listUrl () {
    return resouUrl + '/page.re'
  },
  /**
   * 保存资源，根据参数中的id是否存在值为依据
   * 判断是请求新增还是请求修改
   * @param {*} p
   * @param {*} config
   */
  saveResource (p, config) {
    if (p.id) {
      return http.$axiosPost(resouUrl + '/add.do', p, config)
    }
    return http.$axiosPost(resouUrl + '/update.do', p, config)
  },
  /**
   * 删除资源
   * @param {*} id
   */
  deleteResources (id) {
    return http.$axiosPost(resouUrl + '/delete.do', {id})
  },
  /**
   * 获取左侧菜单树形列表
   */
  resourcesMenu () {
    return http.$axiosGet(resouUrl + '/resources.re')
  },
  /**
   * 
   * @param {*} p 
   */
  resourcesList (p) {
    return http.$axiosGet(resouUrl + '/list.re', p)
  }
}
