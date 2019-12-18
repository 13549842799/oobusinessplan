<template>
  <div class="divContiner">
    <div class="quartz-title"><h3>时钟管理</h3></div>
    <div class="quartz-search">    
    </div>
    <div class="quartz-content">
      <page-rolling :speed="8" :downRoll="downRoll">
        <el-table
        v-loading="loading"
        :data="list"
        height="300"
        style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="jobName"
            label="任务名称"
            width="200">
          </el-table-column>
          <el-table-column
            prop="cron"
            label="cron表达式"
            width="200">
          </el-table-column>
          <el-table-column
            prop="jobClassName"
            label="指定类全名"
            width="200">
          </el-table-column>
          <el-table-column
            label="状态"
            width="150">
            <template slot-scope="scope">
              <el-tag size="medium" :type="scope.row.enabled ? 'success' : 'warning'">{{ scope.row.jobStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="editQuartz(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delQuartz(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-rolling>
    </div>
  </div>
</template>

<script>
import http from '@/http.js'
import {quartzUrl} from '@/base_variable'
import util from '@/components/common/objUtil'
import pageRolling from '@/components/common/pageRolling'

export default {
  components: {pageRolling},
  data () {
    return {
      list: [],
      params: {
        delflag: 1
      },
      loading: false
    }
  },
  created () {
    let v = this
    // 初始化列表
    v.searchList()
  },
  methods: {
    searchList () {
      let v = this
      v.loading = true
      http.$axiosGet(quartzUrl + '/list.re', v.params, {complete: () => { v.loading = false }}).then(res => {
        v.list = res
      }).catch(err => { console.log(err) })
    },
    downRoll (e) {},
    /**
     * 
     */
    editQuartz (quartz) {

    },
    /**
     * 
     */
    delQuartz (quartz) {

    }
  }
}
</script>

<style scoped>
.quartz-title {
  width: 100%;
  height: 60px;
}
.quartz-search {
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
}
.quartz-content {
    width: 100%;
}
</style>
