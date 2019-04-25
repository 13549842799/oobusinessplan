// 一些公共的方法

/**
 * 把数组中对应的属性组成一个字符串
 * @param {*} arr 数组
 * @param {*} field  指定拼接的属性
 * @param {*} separate 分隔符
 */
const arrToStr = function (arr, field, separate) {
  if (arr.length === 1) {
    return ''
  }
  let sep = separate === null || separate === undefined ? ',' : separate
  let str = arr[0][field]
  for (let i = 0; i < arr.length; i++) {
    str += sep + arr[i][field]
  }
  return str
}

export {
  arrToStr
}
