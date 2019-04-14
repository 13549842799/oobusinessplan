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

/**
 *
 * @param {*} o
 * @param {*} arr 数组,当存在以下值时不加入
 * @param {*} karr 数组,当存在以下key时不加入
 */
function newNotNullObject (o, arr, karr) {
  let v = {}
  $.each(o, k => {
    if ($.inArray(o[k], arr) < 0 && $.inArray(k, karr) < 0) {
      v[k] = o[k]
    }
  })
  return v
}

export default {
  newObj,
  newNotNullObject
}
