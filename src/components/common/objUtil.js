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

/**
 * 校验变量是否不为空并被定义
 * @param {*} obj
 */
function validObj (obj) {
  return obj !== null && obj !== undefined
}

/**
 * 校验字符串，判断是否有值
 * @param {str} str
 */
function strNotEmpty (str) {
  return str !== null && str !== undefined && typeof str === 'string' && str.trim() !== ''
}

export default {
  newObj,
  newNotNullObject,
  validObj,
  strNotEmpty
}
