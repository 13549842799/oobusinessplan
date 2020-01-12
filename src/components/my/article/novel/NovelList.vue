<template>
  <div class="divContiner" style="background: rgb(236, 245, 255);margin-top: 15px;position: relative; height: 1000px">
    <div>
      <div class="novelHead">
        <div>
          <el-select size="mini" v-model="page.params.classify" clearable placeholder="分类" style="width:150px;">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="page.params.labels" clearable placeholder="标签" size="mini" style="width:100px;">
            <el-option
              v-for="l in labels"
              :key="l.id"
              :label="s.name"
              :value="s.name">
            </el-option>
          </el-select>
        </div>
        <div>    
          <div>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchNovel"></el-button>
            <el-tooltip class="item" effect="dark" content="创建小说" placement="top-start">
              <el-button size="mini" round icon="el-icon-edit" type="success" @click="newDiary"></el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="novel_content">
          <div class="novel_list">
            <diary-list v-for="d in page.list" :key="d.id" :diary="d" >
              <el-button type="text" size="mini" @click="editNovel(d)">编辑</el-button>
              <span style="color: #E4E7ED;">|</span>
              <el-button type="text" size="mini" style="color:red" @click="deleteNovel(d)">删除</el-button>
            </diary-list>
            <el-pagination
              v-if="page.total > 1"
              style="background: rgb(236, 245, 255);float: right;"
              :background="true"
              layout="prev, pager, next"
              @size-change="sizeChange"
              @current-change="currentChange"
              :current-page.sync="page.pageNum"
              :page-size="page.pageSize"
              :total="page.total">
            </el-pagination>
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
      page: null
    }
  },
  created () {
  
  },
  computed: {

  },
  methods: {
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
