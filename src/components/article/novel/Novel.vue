<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          脑洞小说
        </div>
        <div>
          <el-form :inline="true" :model="page.params">
            <el-form-item label="分类">
              <el-select filterable default-first-option size="mini"
                v-model="page.params.classify" clearable placeholder="请选择分类">
                <el-option
                v-for="item in classifies"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-select v-model="page.params.labels" default-first-option
                filterable allow-create
                clearable placeholder="请选择标签" size="mini">
                <el-option
                  v-for="(l, index) in labels"
                  :key="index"
                  :label="l"
                  :value="l">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="page.searchPage()">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="创建新小说" placement="top-start">
                <el-button size="mini" round icon="el-icon-edit" type="success" @click="newNovel"></el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="novelPageTable"
          highlight-current-row
          @current-change="handleCurrentChange"
          :data="page.list"
          style="width: 100%">
          <el-table-column
            label="书名/最新更新章节"
            show-overflow-tooltip
            width="430">
            <template slot-scope="scope">
              <span style="color:#a6a6a6; font-weight: bold; font-size: 14px;">『{{scope.row.classifyName}}』</span>
              <span style="font-weight: bold; font-size: 14px;">{{scope.row.title}}</span>
              <span style="font-weight: 400;font-size: 12px;color: #3f5895;">{{scope.row.lastetSection === null ? '' : scope.row.lastetSection.title}}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="updateTime"
            label="更新时间"
            width="140">
            <template slot-scope="scope">
              {{scope.row.lastetSection === null ? '' : scope.row.lastetSection.createTimeStr}}
            </template>
          </el-table-column>
          <el-table-column
            prop="wordsNumStr"
            label="字数"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            width="135"
            prop="authorName"
            label="作者">
          </el-table-column>
          <el-table-column
            width="140"
            label="状态">
            <template slot-scope="scope">
              <el-tag size="small" :type="statusStyle[scope.row.novelState]" effect="dark" >
                {{ scope.row.stateName }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div style="height: 100%; width: 50%;float: left">
            <el-button type="primary" size="mini" @click="editNovel">编辑</el-button>
            <el-button type="warning" size="mini" @click="editPortion">管理</el-button>
            <el-button type="danger" size="mini" @click="deleteNovel">删除</el-button>
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
    <novel-form ref="novelForm" :obj="current" :classifies="classifies" :labels="labels" :submitSuccess="submitNovel"></novel-form>
  </div>
</template>

<script>
import pageBasic from '@/components/common/page/pagerequireBasic'
import basicTable from '@/components/common/table/basicMethod'
// import util from '@/components/common/objUtil'

import novelApi from '@/components/article/novel/novelApi'
import labelApi from '@/components/article/label/labelApi'
import classifyApi from '@/components/article/classify/classifyApi'

import NovelForm from '@/components/article/novel/NovelForm'

export default {
  components: {
    NovelForm
  },
  mixins: [pageBasic, basicTable],
  data () {
    return {
      statusStyle: {0: '', 1: 'success', 2: 'info', 3: 'warning'},
      classifies: [],
      labels: [],
      current: null
    }
  },
  created () {
    let v = this
    v.page = v.createPage({url: novelApi.listUrl(), pageSize: 12, total: 12})
    // 获取分类列表
    classifyApi.simpleList({childType: 4}).then(res => {
      v.classifies = res
    }).catch(err => { console.log(err) })
    // 获取标签列表
    labelApi.frequentlyUsedList(4).then(res => {
      v.labels = res
    }).catch(err => { console.log(err) })
  },
  computed: {
  },
  methods: {
    /**
     * 跳转到创建小说页面
     */
    newNovel () {
      this.$refs.novelForm.openForm()
    },
    submitNovel () {
      this.$message.success('保存成功')
      this.page.searchPage()
    },
    /**
     * 跳转到小说编辑页
     */
    editNovel () {
      if (!this.current) {
        this.$message.warning('请选择小说')
        return
      }
      this.$refs.novelForm.openForm(this.current.id)
    },
    editPortion () {
      if (!this.current) {
        this.$message.warning('请选择小说')
        return
      }
      this.$router.push({name: 'novelPortions', params: {novelOrder: this.current.id, novelTitle: this.current.title}})
    },
    deleteNovel () {
      let v = this
      const delMethod = () => {
        novelApi.deleteNovel(v.current.id).then(res => {
          v.page.searchPage()
          v.$message({ type: 'success', message: '删除成功!' })
        }).catch(err => { v.$message.error(err.data.message) })
      }
      v.basicDelete({obj: v.current, objName: 'title', delMethod})
    }
  }
}

</script>

<style>
</style>
