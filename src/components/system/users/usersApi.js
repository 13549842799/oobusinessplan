import {ouserUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  deleteOuser (id) {
    return http.$axiosDel(ouserUrl + '/' + id + '/delete.do')
  }
}