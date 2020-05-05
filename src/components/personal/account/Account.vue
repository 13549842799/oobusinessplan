<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          账号密码箱
        </div>
        <div>
          <el-form :inline="true" :model="page.params">
            <el-form-item label="来源">
              <el-input size="medium" v-model="page.params.source" placeholder="来源" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="accountTable"
          :data="page.list"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="来源">
                  <span>{{ props.row.source }}</span>
                </el-form-item>
                <el-form-item label="用户名">
                  <span>{{ props.row.username }}</span>
                </el-form-item>
                <el-form-item label="绑定邮箱">
                  <span>{{ props.row.bind_email }}</span>
                </el-form-item>
                <el-form-item label="绑定手机">
                  <span>{{ props.row.bind_phone }}</span>
                </el-form-item>
                <el-form-item label="备注">
                  <span>{{ props.row.remark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            width="170"
            property="source"
            label="来源">
          </el-table-column>
          <el-table-column
            property="username"
            label="用户名"
            width="170">
          </el-table-column>
          <el-table-column
            property="bind_email"
            label="绑定邮箱">
          </el-table-column>
          <el-table-column
            property="bind_phone"
            label="绑定手机">
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div style="height: 100%; width: 50%;float: left">
            <el-button size="mini" type="primary" @click="openAddDialog">添加</el-button>
            <el-button size="mini" type="primary" @click="openEditDialog">修改</el-button>
            <el-button size="mini" type="primary" @click="openEditDialog">修改密码</el-button>
            <el-button size="mini" type="danger" @click="deleteAccount">删除</el-button>
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
    <account-form ref="accountForm" :obj="current" :submitSuccess="formSuccess"></account-form>
  </div>
</template>

<script>
import pageBasic from '@/components/common/page/pagerequireBasic'
import basicTable from '@/components/common/table/basicMethod'

import accountApi from '@/components/personal/account/accountApi'

import AccountForm from '@/components/personal/account/AccountForm'

export default {
  components: {
    AccountForm
  },
  mixins: [pageBasic, basicTable],
  data () {
    return {
      current: null // 表格当前选择的行对象
    }
  },
  created () {
    let v = this
    v.page = v.createPage({url: accountApi.listUrl(), pageSize: 8, total: 8})
  },
  computed: {},
  methods: {
    openAddDialog () {
      this.$refs.accountForm.openForm()
    },
    openEditDialog () {
      if (!this.current) {
        this.$message.warning('请选择目标')
        return
      }
      this.$refs.accountForm.openForm(this.current)
    },
    deleteAccount () {
      let v = this
      const delMethod = () => {
        accountApi.deleteAccount(v.current.id).then(res => {
          v.page.searchPage()
          v.$message({ type: 'success', message: '删除成功!' })
        }).catch(err => {
          v.$message.error(err)
        })
      }
      v.basicDelete({obj: v.current, objName: 'source', delMethod})
    },
    formSuccess () {
      this.page.searchPage()
      this.$message.success('保存成功')
    }
  }
}
</script>

<style scoped>

</style>
