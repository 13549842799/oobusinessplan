/**
 * 工具类
 */

function newObj (o) {
  let v = {}
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
  return validObj(str) && str.trim() !== ''
}

/**
 * 判断str是否有值，如果没有值则用默认值代替
 * @param {String} str 校验值
 * @param {String} def 默认值
 */
function strDef (str, def) {
  return strNotEmpty(str) ? str : (def !== undefined ? def : null)
}

export default {
  newObj,
  newNotNullObject,
  validObj,
  strNotEmpty,
  coryObjText,
  validObjDef,
  strDef
}
