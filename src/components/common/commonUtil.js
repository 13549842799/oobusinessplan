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
  for (let i = 1; i < arr.length; i++) {
    str += sep + arr[i][field]
  }
  return str
}

/**
 * 把date对象转化成字符串
 * @param {*} fmt 
 * @param {*} date 时间对象
 */
const dateFormat =  function (fmt,date)
{ //author: meizz
  let o = {
    "M+" : date.getMonth() + 1, //月份
    "d+" : date.getDate(), //日
    "h+" : date.getHours(), //小时
    "m+" : date.getMinutes(), //分
    "s+" : date.getSeconds(), //秒
    "q+" : Math.floor((date.getMonth() + 3) / 3), //季度
    "S"  : date.getMilliseconds() //毫秒
  }
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for(let k in o)
    if(new RegExp('('+ k +')').test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (('00'+ o[k]).substr((''+ o[k]).length)))
  return fmt
} 

export {
  arrToStr,
  dateFormat
}
