import {accountUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  listUrl () {
    return accountUrl + '/page.re'
  },
  saveAccount (p, config) {
    return http.$axiosPost(accountUrl + '/save.do', p, config)
  },
  deleteAccount (id) {
    return http.$axiosDel(accountUrl + '/' + id + '/delete.do')
  }
}