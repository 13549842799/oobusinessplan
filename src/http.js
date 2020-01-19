import $ from 'jquery'
import axios from 'axios'
// import {loginUrl} from '@/base_variable'
import router from './router'

var headers = {}

function $get (url, params) {
  return $http({url, params, type: 'GET', dataType: 'JSON'})
}

function $post (url, params) {
  let obj = {url, params, type: 'POST', dataType: 'JSON'}
  dealContentType(obj, params)
  return $http(obj)
}

function $patch (url, params) {
  let obj = {url, params, type: 'PATCH', dataType: 'JSON'}
  dealContentType(obj, params)
  return $http(obj)
}

function $delete (url, params) {
  return $http({url, params, type: 'DELETE', dataType: 'JSON'})
}

function dealContentType (httpAttr, params) {
  if (params === null) {
    return
  }
  if (toString.call(params) === '[object String]') {
    httpAttr['contentType'] = 'application/json;charse=UTF-8'
  }
}

function $setHeadersFromLocal () {
  headers = {
    'X-user': localStorage.getItem('X-user'),
    'X-token': localStorage.getItem('X-token')
  }
  axiosInstance.defaults.headers['X-user'] = headers['X-user']
  axiosInstance.defaults.headers['X-token'] = headers['X-token']
}

/**
 * 获取本地存储中的token和user
 */
function $getHeadersFromLocal () {
  return {'X-user': localStorage.getItem('X-user'), 'X-token': localStorage.getItem('X-token')}
}

function $getlocal (key) {
  return localStorage.getItem(key)
}

function getUser () {
  return $getlocal('X-user')
}

function getToken () {
  return $getlocal('X-token')
}

class Http {
  p = {}
  constructor (p) {
    this.p.url = p.url
    this.p.type = p.type
    this.p.data = p.params
    this.p.dataType = p.dataType
    this.p.headers = headers
    if (p.contentType) {
      this.p.contentType = p.contentType
    }
  }
  then (succ, err, complete) {
    this.p.success = function (res) {
      if (res.status === 400) {
        console.log('修改后')
        router.push({name: 'login'})
        // window.location.href = loginUrl
        return
      }
      succ(res)
    }
    this.p.error = err
    this.p.complete = complete
    $.ajax(this.p)
  }
}

var $http = function (params) {
  return new Http(params)
}

var axiDel = function (url, params) {
  return axios.delete(url, {params: params, headers: headers})
}

class HttpObj {
  constructor (p) {
    this.url = p.url
    this.data = p.data
    this.type = p.type
    this.dataType = p.dataType
    this.headers = headers
    if (this.data !== null && toString.call(this.data) === '[object String]' && (this.type === 'POST' || this.type === 'PATCH')) {
      console.log('contextType:', this.params)
      this.contentType = 'application/json;charse=UTF-8'
    }
    if (p.dataFilter) {
      this.dataFilter = p.dataFilter
    }
    if (p.context) {
      this.context = p.context
    }
    this.success = p.success
    if (p.error) {
      this.error = p.error
    } else {
      this.error = (res) => { console.log(res) }
    }
    if (p.complete) {
      this.complete = p.complete
    }
  }
}

/**
 *get请求
 * @param {String} url
 * @param {*} params
 * @param {config: Object[error: Function, complete: Function, context: Object]} config 请求的配置信息，值可选
 */
const $getP = function (url, params, config) {
  return $AjaxPromise(url, params, 'GET', 'JSON', config)
}

/**
 * Post请求
 * @param {String} url
 * @param {*} params
 * @param {config: Object[error: Function, complete: Function, context: Object]} config 请求的配置信息，值可选
 */
const $postP = function (url, params, config) {
  return $AjaxPromise(url, params, 'POST', 'JSON', config)
}

/**
 * 删除请求
 * @param {String} url
 * @param {*} params
 * @param {config: Object[error: Function, complete: Function, context: Object]} config
 */
const $deleteP = function (url, params, config) {
  return $AjaxPromise(url, params, 'DELETE', 'JSON', config)
}

const $patchP = function (url, params, config) {
  return $AjaxPromise(url, params, 'PATCH', 'JSON', config)
}

const $AjaxPromise = function (url, params, type, dataType, config) {
  config = config !== null && config !== undefined ? config : {}
  return new Promise(function (resolve, reject) {
    let obj = new HttpObj({
      url: url,
      data: params,
      type: type,
      dataType: dataType,
      complete: config.complete ? config.complete : () => {},
      error: config.error,
      context: config.context,
      success: (res) => {
        console.log(res)
        switch (res.status) {
          case 200:
            resolve(res)
            break
          case 100:
          case 300:
            reject(res)
            break
          case 400:
            // window.location.href = loginUrl
            router.push({name: 'login'})
            reject(res)
        }
      }
    })
    // console.log('obj', obj)
    $.ajax(obj)
  })
}

/** axios  */
var axiosInstance = axios.create({
  timeout: 3000,
  headers: headers
})

/**
 * 发送请求时拦截处理
 */
axiosInstance.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})

/**
 * 接受响应的时候进行处理
 */
axiosInstance.interceptors.response.use(response => {
  switch (response.data.status) {
    case 200:
      return response.data.data
    case 100:
    case 300:
      return Promise.reject(response)
    case 400:
      router.push({name: 'login'})
      return Promise.reject(response.data.message)
  }
  return response
}, err => {
  return Promise.reject(err)
})

const axiosI = function ({url, data, method, config = {}}) {
  let obj = {}
  obj.url = url
  obj.method = method
  switch (method) {
    case 'get':
    case 'delete':
      obj.params = data
      break
    case 'post':
    case 'patch':
      obj.data = data
  }
  return new Promise(function (resolve, reject) {
    axiosInstance(obj).then(res => {
      exComplete(config)
      resolve(res)
    }).catch(err => {
      exComplete(config)
      reject(err)
    })
  })
}

function exComplete (config) {
  if (config && config.complete) {
    config.complete()
  }
}

const $axiosGet = function (url, data, config) {
  return axiosI({url: url, data: data, config: config, method: 'get'})
}

const $axiosPost = function (url, data, config) {
  return axiosI({url: url, data: data, config: config, method: 'post'})
}

const $axiosPat = function (url, data, config) {
  return axiosI({url: url, data: data, config: config, method: 'patch'})
}

const $axiosDel = function (url, data, config) {
  return axiosI({url: url, data: data, config: config, method: 'delete'})
}
/** axios end  */

export default {
  $http,
  $get,
  $post,
  $patch,
  $delete,
  headers,
  $setHeadersFromLocal,
  $getHeadersFromLocal,
  $getlocal,
  getUser,
  getToken,
  axiDel,
  $getP,
  $postP,
  $patchP,
  $deleteP,
  $axiosGet,
  $axiosPost,
  $axiosPat,
  /**
   * 删除类型请求
   */
  $axiosDel
}
