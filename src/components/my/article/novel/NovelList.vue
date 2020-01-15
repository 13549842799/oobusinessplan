<template>
  <div class="divContiner" style="margin-top: 15px;position: relative; height: 1000px">
    <div>
      <div class="novelHead">
        <div>
          <el-select size="mini" v-model="page.params.classify" clearable placeholder="分类" style="width:150px;">
            <el-option
              v-for="item in classify"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="page.params.labels" clearable placeholder="标签" size="mini" style="width:100px;">
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
              :data="page.list"
              tooltip-effect="dark"
              style="width: 99%"
              highlight-current-row
              @selection-change="handleSelectionChange">
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
                width="290">
                <template slot-scope="scope">
                  <span style="margin-left: 2px;" v-for="(l, index) in scope.row.labelList" :key="index">{{l.name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="wordsNumStr"
                label="字数"
                width="100"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                width="90"
                prop="createNikeName"
                label="作者">
              </el-table-column>
              <el-table-column
                width="120"
                prop="stateName"
                label="状态">
              </el-table-column>
            </el-table>
            <el-pagination
              v-if="page.total > 1"
              style="background: rgb(236, 245, 255);float: right;"
              :background="true"
              layout="prev, pager, next"
              :current-page.sync="page.pageNum"
              :page-size="page.pageSize"
              :total="page.total">
            </el-pagination>
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
    handleSelectionChange (selection) {
      console.log(selection)
    },
    searchNovel () {

    },
    newNovel () {
      this.$router.push({name: 'novelEdit'})
    },
    editNovel (n) {
      this.$router.push({name: 'novelEdit', params: {novelOrder: n.id}})
    },
    deleteNovel (n) {
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
</style>
