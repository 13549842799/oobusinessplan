import {upLoadUrl, fileUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  uploadUrl () {
    return upLoadUrl + '/upload.do'
  },
  fileUrl () {
    return fileUrl
  },
  getFile (id) {
    return upLoadUrl + '/' + id + '/file.re'
  },
  deleteFile (id) {
    return http.$axiosDel(upLoadUrl + '/' + id + '/delete.do')
  },
  getHeader () {
    return http.$getHeadersFromLocal()
  }
}
