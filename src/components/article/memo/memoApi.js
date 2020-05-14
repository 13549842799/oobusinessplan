import {memoUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  saveMemo (p, config) {
    return http.$axiosPost(memoUrl + '/save.do', p, config)
  },
  deleteMemo (id) {
    return http.$axiosDel(memoUrl + '/' + id + '/delete.do')
  },
  getList (p, config) {
    return http.$axiosGet(memoUrl + '/list.re', p, config)
  }
}
