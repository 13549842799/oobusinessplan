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
              <el-input size="medium" v-model="page.params.title" placeholder="标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-select size="medium" v-model="page.params.classify" placeholder="请选择分类" clearable>
                <el-option v-for="c in classifies" :key="c.id" :label="c.name" :value="c.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select size="medium" v-model="page.params.status" placeholder="请选择状态" clearable>
                <el-option label="草稿" :value="0"></el-option>
                <el-option label="私密" :value="1"></el-option>
                <el-option label="发布" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-input size="medium" v-model="page.params.labels" placeholder="标签" clearable></el-input>
            </el-form-item>
            <el-form-item label="时间">
              <el-date-picker size="mini" v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeSearch">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="diaryPageTable"
          :data="page.list"
          highlight-current-row
          :row-class-name="tableRowClassName"
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column type="expand" fixed>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="标题">
                  <span>{{ props.row.title }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            label="标题"
            width="350">
            <template slot-scope="scope">
              [{{scope.row.classifyName}}]{{' ' + scope.row.title}}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            width="190">
            <template slot-scope="scope">
            <el-tag :type="scope.row.status === 2 ? 'success' : (scope.row.status === 1 ? 'danger' : 'info')" effect="dark" size="mini"> {{ scope.row.statusName }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            property="dateStr"
            label="日期"
            width="150">
          </el-table-column>
          <el-table-column
            label="标签">
            <template slot-scope="scope">
              <el-tag v-for="(l, index) in scope.row.simpleLabls" :key="index" effect="plain" size="mini" style="margin-right: 10px">{{l}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div style="height: 100%; width: 50%;float: left">
            <el-button size="mini" type="primary" @click="goToAdd">添加</el-button>
            <el-button size="mini" type="primary" @click="goToEdit">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteDiary">删除</el-button>
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
import {dateFormat} from '@/components/common/commonUtil'

import classifyApi from '@/components/article/classify/classifyApi'

export default {
  components: {},
  mixins: [pageBasic, basicTable],
  data () {
    return {
      current: null, // 表格当前选择的行对象
      classifies: [],
      timeRange: ''
    }
  },
  created () {
    let v = this
    v.page = v.createPage({url: diaryApi.listUrl(), pageSize: 12, total: 12})
    classifyApi.simpleList({childType: 1}).then(res => {
      v.classifies = res
    }).catch(err => { console.log(err) })
  },
  computed: {
  },
  methods: {
    timeSearch (val) {
      val = val !== null ? val.map((a) => { return dateFormat('yyyy-MM-dd', a) }) : [null, null]
      console.log(val[0])
      this.page.params.startTime = val[0]
      this.page.params.endTime = val[1]
    },
    /**
     * 行高亮的判断逻辑
     */
    tableRowClassName ({row, rowIndex}) {
      if (row.status === 1) {
        return 'warning-row'
      }
      if (row.status === 2) {
        return 'success-row'
      }
      return ''
    },
    /**
     * 跳转到新增日记页面
     */
    goToAdd () {
      this.$router.push({name: 'diaryEditor'})
    },
    /**
     * 跳转到编辑日记页面
     */
    goToEdit () {
      if (!this.current) {
        this.$message.warning('请选择日记')
        return
      }
      this.$router.push({name: 'diaryEditor', params: {diaryOrder: this.current.id}})
    },
    /**
     * 当表单保存成功时触发
     */
    formSuccess () {
      this.$message.success('保存成功')
      this.page.searchPage()
    },
    deleteDiary () {
      let v = this
      const delMethod = () => {
        diaryApi.deleteDiary(v.current.id).then(res => {
          v.page.searchPage()
          v.$message({ type: 'success', message: '删除成功!' })
        }).catch(err => { v.$message.error(err) })
      }
      v.basicDelete({obj: v.current, objName: 'title', delMethod})
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>