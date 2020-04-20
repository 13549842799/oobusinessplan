import {roleUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  listUrl () {
    return roleUrl + '/page.re'
  },
  saveRole (params, config) {
    if (params.id) {
        return http.$axiosPatch(roleUrl + '/edit.do', params, config)
    }
    return http.$axiosPost(roleUrl + '/add.do', params, config)
  },
  deleteRoles (id) {
    return http.$axiosDel(roleUrl + '/' + id + '/delete.do')
  }
}