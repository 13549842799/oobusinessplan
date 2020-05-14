import {memoUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  getList (p, config) {
    return http.$axiosGet(memoUrl + '/list.re', p, config)
  }
}
