<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          分类管理
        </div>
        <div>
          <el-form :inline="true" :model="page.params">
            <el-form-item label="标题">
              <el-input size="medium" v-model="page.params.name" placeholder="标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="最小文章数">
              <el-input-number size="medium" v-model="page.params.minCount" controls-position="right"  :min="0" style="width: 100px"></el-input-number>
            </el-form-item>
            <el-form-item label="最大文章数">
              <el-input-number size="medium" v-model="page.params.maxCount" controls-position="right"  :min="1" style="width: 100px"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
            <el-form-item label="类别">
              <el-radio-group v-model="page.params.childType" size="medium">
                <el-radio border label="">所有</el-radio>
                <el-radio border :label="1">日记</el-radio>
                <el-radio border :label="2">备忘</el-radio>
                <el-radio border :label="3">灵感</el-radio>
                <el-radio border :label="4">小说</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="diaryPageTable"
          :data="page.list"
          style="width: 100%">
          <el-table-column
            property="name"
            label="分类名"
            width="350">
          </el-table-column>
          <el-table-column
            label="类别"
            width="190">
            <template slot-scope="scope">
            <el-tag :type="scope.row.childType === 1 ? 'success' : (scope.row.childType === 4 ? '' : 'info')" effect="dark" size="mini"> {{ scope.row.childTypeName }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            property="count"
            label="文章数"
            width="150">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="openAddClass(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div style="height: 100%; width: 50%;float: left">
            <el-button size="mini" type="primary" @click="openAddClass">添加</el-button>
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
  </div>
</template>

<script>
import pageBasic from '@/components/common/page/pagerequireBasic'
import basicTable from '@/components/common/table/basicMethod'

import classifyApi from '@/components/article/classify/classifyApi'

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
    v.page = v.createPage({url: classifyApi.listUrl(), pageSize: 12, total: 12, params: {childType: 1}})
  },
  computed: {
  },
  methods: {
    openAddClass (row) {
      let v = this
      let id = row.id !== undefined ? row.id : null
      let initValue = id !== undefined ? row.name : ''
      let showTitle = id !== undefined ? '修改' : '创建'
      this.$prompt('请' + showTitle + '[' + childTypeMap[v.page.params.childType] + ']分类名', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', inputValue: initValue
      }).then(({ value }) => {
        classifyApi.saveClassify({childType: v.page.params.childType, name: value, id}).then(res => {
          v.page.searchPage()
          v.$message.success(showTitle + '成功')
        }).catch(err => { v.$message.error('添加失败：' + err.data.message) })
      }).catch(() => { this.$message.info('取消输入') })
    },
    handleDelete (index, row) {
      let v = this
      if (row.count === 0) {
        deleteClassify(v, row.id)
      } else {
        v.$confirm('此分类还存在' + row.count + '篇日记, 是否继续? 删除后原文章将转到默认分类中', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteClassify(v, row.id)
        }).catch(() => {
          v.$message({ type: 'info', message: '已取消删除' })
        })
      }
    }
  }
}

function deleteClassify (v, id) {
  classifyApi.deleteClassify(id).then(res => {
    v.page.searchPage()
    v.$message.success('删除成功')
  }).catch(err => { v.$message.error('删除失败:' + err.data.message) })
}

const childTypeMap = {1: '日记', 2: '备忘', 3: '灵感', 4: '备注'}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
