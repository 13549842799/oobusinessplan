/**
 * 工具类
 */
import $ from 'jquery'

function newObj (o) {
  let v = {}
  $.each(o, k => {
    v[k] = o[k]
  })
  return v
}

export default {
  newObj
}
