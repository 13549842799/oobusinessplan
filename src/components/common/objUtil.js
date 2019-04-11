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
function newNotNullObject(o, arr, karr) {
  let v = {}
  $.each(o, k => {
    if (arr.includes(o[k]) || karr.includes(k)) {
      v[k] = o[k]
    }
  })
}

export default {
  newObj
}
