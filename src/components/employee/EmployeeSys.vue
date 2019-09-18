<template>
    <div></div>
</template>

<script>
import http from '../../http'
import {employeeUrl} from '../../base_variable'
import {MyPage} from '../common/page.js'

export default {
  data () {
    return {
      page: {}
    }
  },
  created () {
    this.employeeList()
  },
  methods: {
    initPage () {
      let v = this
      v.page = new MyPage(7)
      v.page.requestUrl = employeeUrl + '/page.re'
      v.searchPageByCondition()
    },
    employeeList (params) {
      http.$axiosGet(employeeUrl + '/page.re', {pageNum: 1, pageSize: 10}).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>
