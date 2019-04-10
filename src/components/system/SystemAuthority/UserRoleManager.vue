<template>
  <div class="tap">
    <div class="head"></div>
    <div class="content">
      <el-table
    :data="adminlist" height="350" border ref="adminTable" style="width: 100%"
    :row-class-name="stateClassName"
    @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="35">
    </el-table-column>
    <el-table-column
      width="35"
      fixed
      type="index"
      :index="1">
    </el-table-column>
    <el-table-column
      fixed
      prop="accountname"
      label="用户名"
      width="100">
    </el-table-column>
    <el-table-column
      fixed
      prop="employeeName"
      label="职员"
      width="100">
    </el-table-column>
    <el-table-column
      :formatter="getState"
      prop="state"
      label="状态"
      width="80">
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      prop="roles"
      :formatter="getRolesName"
      label="拥有角色"
      width="400">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">角色分配</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="1000">
    </el-pagination>
  </div>
    </div>
  </div>
</template>

<script>
import http from '@/http.js'
import base from '@/base_variable'

export default {
  name: 'userManager',
  created () {

  },
  methods: {
    handleClick (row) {
      row.roles = [{name: '超级管理员'}, {name: '管理员'}]
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cancelrSelected () {
      this.$refs.adminTable.clearSelection()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    stateClassName ({row, rowIndex}) {
      return row.state === 1 ? '' : 'forbidden-row'
    },
    getState (row, column, cellValue) {
      return String(cellValue) === '0' ? '禁用' : '启用'
    },
    getRolesName (row, column, cellValue) {
      let str = ''
      for (let i = 0; i < cellValue.length; i++) {
        str = str + cellValue[i].name + ', '
      }
      str = str.length > 1 ? str.substring(0, str.length-2) : ''
      return str
    },
    alterRole () {
      console.log('1')
    }
  },
  data () {
    return {
      currentPage: 5,
      adminlist: [{
        accountname: 'OB1000',
        employeeName: '游人',
        roles: [{name: '超级管理员'}, {name: '管理员'}, {name: '用户'}, {name: '老板'}, {name: '上帝'}, {name: '管理员'}, {name: '管理员'}],
        state: 0
      }],
      multipleSelection: []
    }
  }
}
</script>

<style scoped>
@import './common.css';

.head, .content {
  width: 95%;
  margin-left: 2.5%
}

.head {
  height: 10%;
  margin-bottom: 10px;
}

.content {
  height: 80%;
}
.el-table .forbidden-row {
  background: gray;
}
</style>
