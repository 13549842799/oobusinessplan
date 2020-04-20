<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          用户管理
        </div>
        <div>
          <el-form :inline="true" :model="page.params">
            <el-form-item label="用户名">
              <el-input size="medium" v-model="page.params.username" placeholder="用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="资源真名">
              <el-input size="medium" v-model="page.params.nikename" placeholder="昵称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="ouserTable"
          :data="page.list"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="用户名">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="昵称">
                  <span>{{ props.row.nikename }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            property="username"
            label="用户名"
            width="170">
          </el-table-column>
          <el-table-column
            property="nikename"
            label="昵称"
            width="170">
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div style="height: 100%; width: 50%;float: left">
            <el-button size="mini" type="primary" @click="openAddDialog">添加</el-button>
            <el-button size="mini" type="primary" @click="openEditDialog">修改</el-button>
            <el-button size="mini" type="primary" >角色</el-button>
            <el-button size="mini" type="primary" >权限</el-button>
            <el-button size="mini" type="danger" @click="deleteResources">删除</el-button>
          </div>
          <div style="height: 100%; width: 50%;float: left;display: flex;flex-direction: row-reverse">
            <el-pagination
              small
              layout="prev, pager, next"
              @current-change="currentChange"
              :current-page.sync="page.pageNum"
              :page-size="page.pageSize"
              :total="page.total">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- <ouser-form ref="resForm" :auths="auths" :submitSuccess="formSuccess"></ouser-form> -->
  </div>
</template>

<script>
import pageBasic from '@/components/common/page/pagerequireBasic'
import basicTable from '@/components/common/table/basicMethod'

import ouserApi from '@/components/system/users/usersApi'
import authsApi from '@/components/system/authorities/authoritiesApi'

export default {
  components: {},
  mixins: [pageBasic, basicTable],
  data () {
    return {
      current: null // 表格当前选择的行对象
    }
  },
  created () {
    let v = this
    v.page = v.createPage({url: resourcesApi.listUrl(), pageSize: 8, total: 8})
  },
  computed: {
  },
  methods: {
    /**
     * 打开新增资源的表单弹框
     */
    openAddDialog () {
      // this.$refs.resForm.initAddForm()
    },
    /**
     * 打开修改资源的表单弹框
     */
    openEditDialog () {
      if (!this.current) {
        this.$message.warning('请选择目标资源')
        return
      }
      // this.$refs.resForm.initEditForm(this.current)
    },
    /**
     * 当表单保存成功时触发
     */
    formSuccess () {
      this.page.searchPage()
    },
    deleteOuser () {
      let v = this
      const delMethod = () => {
        ouserApi.deleteOuser(v.current.id).then(res => {
          v.page.searchPage()
          v.$message({ type: 'success', message: '删除成功!' })
        }).catch(err => {
          v.$message.error(err)
        })
      }
      v.basicDelete({obj: v.current, objName: 'username', delMethod})
    }
  }
}
</script>

<style>

</style>
