/**
 * 工具类
 */

function newObj (o) {
  let v = {}
  // $.each(o, k => {
  //   v[k] = o[k]
  // })
  for (const key in o) {
    v[key] = o[key]
  }
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
  for (const key in o) {
    if ((!arr || !arr.includes(o[key])) && (!karr || !karr.includes(key))) {
      v[key] = o[key]
    }
  }
  // $.each(o, k => {
  //   if ($.inArray(o[k], arr) < 0 && $.inArray(k, karr) < 0) {
  //     v[k] = o[k]
  //   }
  // })
  return v
}

/**
 * 校验变量是否不为空并被定义
 * @param {*} obj
 */
function validObj (obj) {
  return obj !== null && obj !== undefined
}

function validObjDef (obj, def) {
  return validObj(obj) ? obj : def
}

function coryObjText (o) {
  // for (const key in o) {
  // if (object.hasOwnProperty(key)) {
  // const element = object[key];
  // }
  // }
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
  strNotEmpty,
  coryObjText,
  validObjDef
}
