<template>
  <div class="divContiner child-Continer">
    <div>
      <div class="novelHead">
        <div>
          <el-select filterable default-first-option size="mini" v-model="page.params.classify" clearable placeholder="分类" style="width:150px;">
            <el-option
              v-for="item in classify"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="page.params.labels"
            default-first-option
            filterable
            allow-create
            clearable placeholder="标签" size="mini"
            style="width:100px;">
            <el-option
              v-for="(l, index) in labels"
              :key="index"
              :label="l"
              :value="l">
            </el-option>
          </el-select>
        </div>
        <div>
          <div>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchNovel"></el-button>
            <el-tooltip class="item" effect="dark" content="创建小说" placement="top-start">
              <el-button size="mini" round icon="el-icon-edit" type="success" @click="newNovel"></el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="novel_content">
          <div class="novel_list">
            <el-table
              ref="novelList"
              v-loading="loading"
              :data="page.list"
              tooltip-effect="dark"
              style="width: 99%"
              highlight-current-row
               @current-change="handleSelectionChange">
              <el-table-column
                label="书名/最新更新章节"
                show-overflow-tooltip
                width="400">
                <template slot-scope="scope">
                  <span style="color:#a6a6a6; font-weight: bold; font-size: 14px;">『{{scope.row.classifyName}}』</span>
                  <span style="font-weight: bold; font-size: 14px;">{{scope.row.title}}</span>
                  <span style="font-weight: 400;font-size: 12px;color: #3f5895;">{{scope.row.lastetSection === null ? '' : scope.row.lastetSection.title}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="标签"
                prop="labels"
                width="270">
              </el-table-column>
              <el-table-column
                prop="wordsNumStr"
                label="字数"
                width="100"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                width="100"
                prop="createNikeName"
                label="作者">
              </el-table-column>
              <el-table-column
                width="130"
                prop="stateName"
                label="状态">
              </el-table-column>
            </el-table>
            <div style="margin-top: 20px;position:relative">
              <div class="novel-list-edit-buttons">
                <el-button type="primary" size="mini" @click="editNovel">编辑</el-button>
                <el-button type="warning" size="mini">置顶</el-button>
                <el-button type="danger" size="mini" @click="deleteNovel">删除</el-button>
              </div>
              <el-pagination
                style="float: right;"
                :background="true"
                layout="prev, pager, next"
                @current-change="goToPage"
                :current-page.sync="page.pageNum"
                :page-size="page.pageSize"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {MyPage} from '@/components/common/page'
import {novelUrl, classifyUrl, labelUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  data () {
    return {
      loading: false, // 加载开关
      page: null,
      novel: null, // 当前选择的小说
      classify: null, // 分类列表
      labels: null // 标签列表
    }
  },
  created () {
    let v = this
    // 获取分类列表
    http.$axiosGet(classifyUrl + '/list.re', {childType: 4}).then(res => {
      v.classify = res !== null && res.length > 0 ? res : []
    }).catch(err => { console.log(err) })

    // 获取常用标签
    http.$axiosGet(labelUrl + '/frequently-used.re', {type: 4}).then(res => {
      v.labels = res !== null && res.length > 0 ? res : []
    }).catch(err => { console.log(err) })

    // 获取小说列表
    v.page = new MyPage(10, {url: novelUrl + '/list.re'})
  },
  computed: {

  },
  methods: {
    /**
     * 表格选择行时出发方法
     */
    handleSelectionChange (row) {
      this.novel = row
    },
    searchNovel () {
      let v = this
      v.novel = null // 清空选择
      v.loading = true
      this.page.searchPage(null, null, {'method': () => { v.loading = false }})
    },
    /**
     * 翻页时触发的方法
     */
    goToPage (page) {
      let v = this
      v.novel = null // 清空选择
      v.loading = true
      v.page.requestList(null, null, page, {'method': () => { v.loading = false }})
    },
    /**
     * 跳转到新建小说的页面
     */
    newNovel () {
      this.$router.push({name: 'novelEdit'})
    },
    /**
     * 跳转到编辑小说的页面（与新建页面为同一页面，只是初始化逻辑不同）
     */
    editNovel () {
      if (this.novel == null) {
        this.$message.warning('请先选择目标小说')
        return
      }
      this.$router.push({name: 'novelEdit', params: {novelOrder: this.novel.id}})
    },
    deleteNovel () {
      let v = this
      if (v.novel == null) {
        v.$message.warning('请先选择目标小说')
        return
      }
      v.$confirm('确定要永久删除' + v.novel.title + '这本小说吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        v.loading = true
        http.$axiosDel(novelUrl + '/s/' + v.novel.id + '/novel.re').then(res => {
          v.page.requestList(null, null, v.page.pageNum, {'method': () => { v.loading = false }})
        }).catch(err => {
          console.log(err)
          v.loading = false
          v.$message.error(err)
        })
      }).catch(() => { v.$message.info('已取消删除') })
    }
  }
}
</script>

<style scoped>
.novelHead {
  width: 100%;
  height: 90px;
  line-height: 80px;
}

.novelHead > div {
  margin-left: 10px;
  float: left;
}

.novel_content {
  width:100%;
  height: 855px;
}
.novel_list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 800px;
}

.novel-list-edit-buttons {
  position: absolute;
  display: flex;
  flex-direction: row;
  left: 0;
  top:0;
  width: 300px;
  height: 28px;
}
</style>
