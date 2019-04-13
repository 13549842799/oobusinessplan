<template>
  <div class="tap">
    <div class="head">
      <div class="selectDiv">
        <el-input
        placeholder="请输入用户名"
        v-model="page.accountname">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      </div>
      <div class="selectDiv">
        <el-input
        placeholder="请输入职员名"
        v-model="page.relatedName">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      </div>
      <div class="selectDiv" style="250px;">
        <el-radio-group v-model="page.state" size="small">
          <el-radio-button :label="-1">全部</el-radio-button>
          <el-radio-button :label="1">启用</el-radio-button>
          <el-radio-button :label="0">禁用</el-radio-button>
        </el-radio-group>
      </div>
      <div class="selectDiv" style="100px;">
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchList"></el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        :data="adminlist" height="350" border ref="adminTable" style="width: 100%"
        :row-class-name="stateClassName"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35"></el-table-column>
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
          prop="relatedName"
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
          :current-page.sync="page.pageNum"
          :page-size="page.pageSize"
          layout="prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </div>
    <Dialog title="角色分配" ref="mydialog">
      <div>
        <el-checkbox-group v-model="dialog.checkList">
          <el-checkbox v-for="r in dialog.hasRoles" :key="r.rid" :label="r.name" :disabled="r.state === 0">{{r.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <el-button type="text" @click="saveRoleRelate">保存修改</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import http from '@/http.js'
import base from '@/base_variable'
import commonM from '@/components/common/commonMixins'
import Dialog from '@/components/common/Dialog'
import $ from 'jquery'
import util from '@/components/common/objUtil'

function pageAdminRole (v, param) {
  let p = util.newNotNullObject(param, [null])
  p.state = p.state === -1 ? null : p.state
  http.$get(base.adminUrl + '/adminsys/admins.re', p).then(res => {
    v.simpleDealResult(res.status, function () {
      v.adminlist = res.data.list
      v.page.total = res.data.total
    }, res.message)
  })
}

export default {
  name: 'userManager',
  mixins: [commonM],
  components: {Dialog},
  data () {
    return {
      page: {
        pageNum: 1,
        total: 1,
        pageSize: 15,
        accountName: null,
        state: -1,
        relatedName: null
      },
      adminlist: [],
      dialog: {
        hasRoles: [], // 所有角色组成的数组，其中delflag=0表示当前用户没有这个角色
        checkList: [],
        row: null, // 当前选中的行
        admin: null
      },
      multipleSelection: []
    }
  },
  created () {
    let v = this
    pageAdminRole(v, v.page)
    http.$get(base.roleUrl + '/list.re').then(res => {
      v.simpleDealResult(res.status, function () {
        $.each(res.data, (i, val) => {
          v.dialog.hasRoles.push({rid: val.id, state: val.state, name: val.name})
        })
      }, res.message)
    })
  },
  methods: {
    searchList () {
      let v = this
      v.page.pageNum = 1
      pageAdminRole(v, v.page)
    },
    handleClick (row) {
      let v = this
      v.dialog.checkList = []
      for (let i = 0; i < row.roles.length; i++) {
        v.dialog.checkList.push(row.roles[i].name)
      }
      v.dialog.admin = row.id
      v.dialog.row = row
      v.$refs.mydialog.visable = true
    },
    saveRoleRelate () {
      let v = this
      let row = v.dialog.row
      let adminId = row.id
      let or = row.roles
      let cl = v.dialog.checkList
      let newr = [] // 需要提交的数组
      let temp = {}
      $.each(v.dialog.hasRoles, (i, r) => {
        temp[r.name] = r
      })
      // 获取增加的角色
      let flag = true
      if (cl != null && cl.length > 0) {
        $.each(cl, (i, c) => {
          for (let j = 0; j < or.length; j++) {
            if (c === or[j].name) {
              flag = false
              break
            }
          }
          if (flag) {
            newr.push({aid: adminId, rid: temp[c].rid, delflag: 1})
          }
          flag = true
        })
      }
      $.each(or, (i, c) => {
        for (let j = 0; j < cl.length; j++) {
          console.log(c.name + ',' + cl[j])
          if (c.name === cl[j]) {
            flag = false
            break
          }
        }
        if (flag) {
          newr.push({aid: adminId, rid: temp[c.name].rid, delflag: 0})
        }
        flag = true
      })
      if (newr.length === 0) {
        v.$refs.mydialog.visable = false
        return
      }
      http.$post(base.roleUrl + '/addToUser.do', JSON.stringify(newr)).then(res => {
        v.simpleDealResult(res.status, function () {
          row.roles = res.data
          v.$refs.mydialog.visable = false
          return '角色分配成功'
        }, res.message)
      })
    },
    cancelrSelected () {
      this.$refs.adminTable.clearSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      let v = this
      pageAdminRole(v, v.page)
      v.page.pageNum = val
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
      str = str.length > 1 ? str.substring(0, str.length - 2) : ''
      return str
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

.selectDiv {
  width: 200px;
  float: left;
  margin-right: 20px;
}
</style>
