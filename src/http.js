import $ from 'jquery'

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
  then (succ, err) {
    this.p.success = succ
    this.p.error = err
    $.ajax(this.p)
  }
}

var $http = function (params) {
  return new Http(params)
}

export default {
  $http,
  $get,
  $post,
  $patch,
  $delete,
  headers,
  $setHeadersFromLocal,
  $getlocal,
  getUser,
  getToken
}
