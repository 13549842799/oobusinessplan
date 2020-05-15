<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          技术文章
        </div>
        <div>
          <el-form :inline="true" :model="page.params">
            <el-form-item label="标题">
              <el-input size="medium" v-model="page.params.title" placeholder="标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="标签">
              <el-input size="medium" v-model="page.params.labels" placeholder="标签" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="goToAdd">创建文章</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="articlePageTable"
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
              <router-link :to="{name: 'knowledgeArticleReader', params: {id: scope.row.id}}">{{scope.row.title}}</router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="最后修改时间"
            prop="modifyTimeStr">
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
            <el-button size="mini" type="primary" @click="goToEdit">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteEntity">删除</el-button>
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

import articleApi from '@/components/knowledge/article/knowledgeArticleApi'

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
    v.page = v.createPage({url: articleApi.listUrl(), pageSize: 12, total: 12})
  },
  computed: {
  },
  methods: {
    /**
     * 行高亮的判断逻辑
     */
    tableRowClassName ({row, rowIndex}) {
      return ''
    },
    /**
     * 跳转到新增日记页面
     */
    goToAdd () {
      this.$router.push({name: 'knowledgeArticleEditor'})
    },
    /**
     * 跳转到编辑日记页面
     */
    goToEdit () {
      if (!this.current) {
        this.$message.warning('请选择文章')
        return
      }
      this.$router.push({name: 'knowledgeArticleEditor', params: {id: this.current.id}})
    },
    /**
     * 当表单保存成功时触发
     */
    formSuccess () {
      this.$message.success('保存成功')
      this.page.searchDefPage()
    },
    deleteEntity () {
      let v = this
      const delMethod = () => {
        articleApi.deleteEntity(v.current.id).then(res => {
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
