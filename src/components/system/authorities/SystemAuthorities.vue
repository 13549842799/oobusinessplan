<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          权限管理
        </div>
        <div>
          <el-form :inline="true" :model="page.params">
            <el-form-item label="名称">
              <el-input size="medium" v-model="page.params.authName" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="权限真名">
              <el-input size="medium" v-model="page.params.displayName" placeholder="权限真名" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input size="medium" v-model="page.params.remark" placeholder="备注" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="authoritiesTable"
          :data="page.list"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="名称">
                  <span>{{ props.row.authName }}</span>
                </el-form-item>
                <el-form-item label="权限真名">
                  <span>{{ props.row.displayName }}</span>
                </el-form-item>
                <el-form-item label="备注">
                  <span>{{ props.row.describes }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            property="authName"
            label="名称"
            width="170">
          </el-table-column>
          <el-table-column
            property="displayName"
            label="权限真名"
            width="170">
          </el-table-column>
          <el-table-column
            property="remark"
            label="备注">
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div style="height: 100%; width: 50%;float: left">
            <el-button size="mini" type="primary" @click="openAddDialog">添加</el-button>
            <el-button size="mini" type="primary" @click="openEditDialog">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteAuths">删除</el-button>
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
    <auths-form ref="authForm" :submitSuccess="formSuccess"></auths-form>
  </div>
</template>

<script>
import pageBasic from '@/components/common/page/pagerequireBasic'
import basicTable from '@/components/common/table/basicMethod'

import authsApi from '@/components/system/authorities/authoritiesApi'

import authsForm from '@/components/system/authorities/SystemAuthoritiesForm'

export default {
  components: {
    authsForm
  },
  mixins: [pageBasic, basicTable],
  data () {
    return {
      current: null // 表格当前选择的行对象
    }
  },
  created () {
    let v = this
    v.page = v.createPage({url: authsApi.listUrl(), pageSize: 8, total: 8})
  },
  computed: {},
  methods: {
    openAddDialog () {
      this.$refs.authForm.initAddForm()
    },
    openEditDialog () {
      if (!this.current) {
        this.$message.warning('请选择目标资源')
        return
      }
      this.$refs.authForm.initEditForm(this.current)
    },
    deleteAuths () {
      let v = this
      const delMethod = () => {
        authsApi.deleteAuths(v.current.id).then(res => {
          v.page.searchPage()
          v.$message({ type: 'success', message: '删除成功!' })
        }).catch(err => {
          v.$message.error(err)
        })
      }
      v.basicDelete({obj: v.current, objName: 'displayName', delMethod})
    },
    formSuccess () {
      this.page.searchPage()
    }
  }
}
</script>

<style scoped>

</style>
