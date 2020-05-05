import {sectionUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  saveSection (p, config) {
    return http.$axiosPost(sectionUrl + '/save.do', p, config)
  },
  deleteSection (id) {
    return http.$axiosDel(sectionUrl + '/' + id + '/delete.do')
  },
  getSection (id, config) {
    return http.$axiosGet(sectionUrl + '/' + id + '/section.re', {}, config)
  }
}
