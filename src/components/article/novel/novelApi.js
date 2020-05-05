import {novelUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  listUrl () {
    return novelUrl + '/page.re'
  },
  /**
   * 保存小说介绍
   * @param {*} p
   * @param {*} config
   */
  saveNovel (p, config) {
    return http.$axiosPost(novelUrl + '/save.do', p, config)
  },
  /**
   * 删除小说
   * @param {*} id
   */
  deleteNovel (id) {
    return http.$axiosDel(novelUrl + '/' + id + '/delete.do')
  },
  /**
   * 获取指定的小说
   * @param {*} id
   * @param {*} config
   */
  getNovel (id, config) {
    return http.$axiosGet(novelUrl + '/' + id + '/novel.re', {}, config)
  }
}
