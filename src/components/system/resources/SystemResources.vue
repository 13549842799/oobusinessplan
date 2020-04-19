<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          资源管理
        </div>
        <div>
          <el-form :inline="true" :model="page.params">
            <el-form-item label="名称">
              <el-input size="medium" v-model="page.params.name" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="资源真名">
              <el-input size="medium" v-model="page.params.displayName" placeholder="资源真名" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select size="medium" v-model="page.params.type" placeholder="资源类型" clearable>
                <el-option label="一级模块" :value="1"></el-option>
                <el-option label="二级模块" :value="2"></el-option>
                <el-option label="接口" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="resourcesTable"
          :data="page.list"
          highlight-current-row
          :row-class-name="tableRowClassName"
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="资源真名">
                  <span>{{ props.row.displayName }}</span>
                </el-form-item>
                <el-form-item label="类型">
                  <span>{{ props.row.typeStr }}</span>
                </el-form-item>
                <el-form-item label="请求路径">
                  <span>{{ props.row.path }}</span>
                </el-form-item>
                <el-form-item label="锁定状态">
                  <span>{{ props.row.locking == 1 ? '已锁定' : '释放'}}</span>
                </el-form-item>
                <el-form-item label="资源状态">
                  <span>{{ props.row.state == 0 ? '可用' : '禁用'}}</span>
                </el-form-item>
                <el-form-item label="资源描述">
                  <span>{{ props.row.describes }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            property="name"
            label="名称"
            width="170">
          </el-table-column>
          <el-table-column
            property="displayName"
            label="资源真名"
            width="170">
          </el-table-column>
          <el-table-column
            property="typeStr"
            label="类型"
            width="150">
          </el-table-column>
          <el-table-column
            property="path"
            label="请求路径">
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div style="height: 100%; width: 50%;float: left">
            <el-button size="mini" type="primary" @click="openAddDialog">添加</el-button>
            <el-button size="mini" type="primary" @click="openEditDialog">修改</el-button>
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
    <resources-form ref="resForm" :auths="auths" :submitSuccess="formSuccess"></resources-form>
  </div>
</template>

<script>
import {MyPage} from '@/components/common/page'

import resourcesApi from '@/components/system/resources/resourcesApi'
import authsApi from '@/components/system/authorities/authoritiesApi'

import resourcesForm from '@/components/system/resources/SystemResourcesForm'

export default {
  components: { resourcesForm },
  data () {
    return {
      page: null,
      current: null, // 表格当前选择的行对象
      // resourcesList: [
      //   {
      //     name: 'R_TEST', displayName: '测试资源', locking: 1, state: 1, typeStr: '一级菜单',
      //     path: '/api/resources/add.do', describes: '这是一个测试资源啊啊啊', authId: 1, type: 1
      //   },
      //   {
      //     name: 'R_TEST', displayName: '测试资源', locking: 1, state: 1, typeStr: '一级菜单',
      //     path: '/api/resources/add.do', describes: '这是一个测试资源啊啊啊', authId: 1, type: 1
      //   }
      // ],
      auths: [{id: 1, name: 'A_TEST', displayName: '测试权限'}]
    }
  },
  created () {
    let v = this
    v.page = new MyPage(8, {url: resourcesApi.listUrl(), total: 8})
    authsApi.getSimpleAuthsList().then(res => {
      v.auths = res
    }).catch(err => { console.log(err) })
  },
  computed: {
  },
  methods: {
    /**
     * 调换页
     */
    currentChange (val) {
      this.page.requestList(null, null, val)
    },
    /**
     * 表格选择行时触发的方法
     */
    handleCurrentChange (currentRow, oldCurrentRow) {
      this.current = currentRow
    },
    /**
     * 行高亮的判断逻辑
     */
    tableRowClassName ({row, rowIndex}) {
      if (row.state === 0) {
        return 'warning-row'
      }
      if (row.type === 1 || row.type === 2) {
        return 'success-row'
      }
      return ''
    },
    /**
     * 打开新增资源的表单弹框
     */
    openAddDialog () {
      this.$refs.resForm.initAddForm()
    },
    /**
     * 打开修改资源的表单弹框
     */
    openEditDialog () {
      if (!this.current) {
        this.$message.warning('请选择目标资源')
        return
      }
      this.$refs.resForm.initEditForm(this.current)
    },
    /**
     * 当表单保存成功时触发
     */
    formSuccess () {
      this.page.searchPage()
    },
    deleteResources () {
      let v = this
      if (!v.current) {
        v.$message.warning('请选择目标资源')
        return
      }
      v.$confirm('确定删除' + v.current.displayName + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resourcesApi.deleteResources(v.current.id).then(res => {
          v.$message({ type: 'success', message: '删除成功!' })
        }).catch(err => {
          v.$message.error(err)
        })
      }).catch(() => {
        v.$message({ type: 'info', message: '已取消删除' })
      })
    }
  }
}
</script>

<style>

</style>
