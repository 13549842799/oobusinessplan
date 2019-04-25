<template>
  <div style="background: rgb(236, 245, 255);margin-top: 15px;position: relative;">
    <div class="diaryHead">
      <div>
        <el-select size="mini" v-model="page.classify" clearable placeholder="分类" style="width:150px;">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="page.status" clearable placeholder="状态" size="mini" style="width:100px;">
          <el-option
            v-for="s in statuss"
            :key="s.val"
            :label="s.name"
            :value="s.val">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-date-picker
          size="mini"
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div>
        <el-input
          style="width:100px;"
          size="mini"
          placeholder="标题"
          v-model="page.title"
          clearable>
        </el-input>
      </div>
      <div>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchDiary"></el-button>
        <el-tooltip class="item" effect="dark" content="写新日记" placement="top-start">
          <el-button size="mini" round icon="el-icon-edit" type="success" @click="newDiary"></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="diary_content">
      <div class="diary_list">
        <diary-list v-for="d in page.list" :key="d.id" :diary="d" :default-expand="expand">
          <span style="color: #E4E7ED;">|</span>
          <el-button type="text" size="mini" @click="editDiary(d)">编辑</el-button>
          <span style="color: #E4E7ED;">|</span>
          <el-button type="text" size="mini" style="color:red" @click="deleteDiary(d)">删除</el-button>
        </diary-list>
      </div>
      <el-pagination
        v-if="page.total > 1"
        style="background: rgb(236, 245, 255);float: right;"
        :background="true"
        layout="prev, pager, next"
        @size-change="page.handleSizeChange"
        @current-change="page.handleCurrentChange"
        :current-page.sync="page.pageNum"
        :page-size="page.pageSize"
        :total="page.total">
      </el-pagination>
    </div>
    <router-link :to="{name: 'test'}"></router-link>
  </div>
</template>

<script>
import diaryList from '@/components/my/article/diary/DiaryList'
import {MyPage} from '@/components/common/page'
import {diaryUrl} from '@/base_variable'
import http from '@/http.js'
import commonM from '@/components/common/commonMixins'
// import axios from 'axios'

export default {
  mixins: [commonM],
  components: {
    diaryList
  },
  data () {
    return {
      page: new MyPage(4),
      expand: false,
      options: [],
      statuss: [{name: '草稿', val: 0}, {name: '私密', val: 1}, {name: '发布', val: 2}],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      timeRange: ''
    }
  },
  created () {
    console.log(this.statuss)
    this.page.list = [
      {id: 1, name: '测试日记', status: 1, createTime: '2019年10月10日', labels: ['测试', '空白'], content: ''},
      {id: 2, name: '今天日记', status: 2, createTime: '2019年11月10日', labels: ['愉悦', '成功', '偷税']},
      {id: 3, name: '今天日记', status: 2, createTime: '2019年11月10日', labels: ['愉悦', '成功', '偷税']},
      {id: 4, name: '今天日记', status: 2, createTime: '2019年11月10日', labels: ['愉悦', '成功', '偷税']},
      {id: 5, name: '今天日记', status: 2, createTime: '2019年11月10日', labels: ['愉悦', '成功', '偷税']}
    ]
    this.page.total = 5
    this.options = [{id: 1, name: '默认分类'}, {id: 2, name: '个人分类'}, {id: 3, name: '私人分类'}, {id: 4, name: '超级分类'}]
    this.page.requestUrl = diaryUrl + '/list.re'
    // this.page.searchPage()
  },
  methods: {
    searchDiary () {
      let v = this
      v.page.startTime = v.timeRange[0]
      v.page.endTime = v.timeRange[1]
      this.page.searchPage()
    },
    selectA (v) {
      console.log(v)
      console.log('model:' + this.page.classify)
    },
    newDiary () {
      console.log('进入新的路径')
      this.$router.push({name: 'diaryEdit'})
    },
    editDiary (d) {},
    deleteDiary (d) {
      if (!d && d.id == null) {
        this.$message({
          message: '请选择文章',
          type: 'warning'
        })
        return
      }
      let v = this
      this.$confirm('是否删除该日记?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        http.$delete(diaryUrl + '/s/' + d.id + '/delete.do').then(res => {
          v.simpleDealResult(res.status, () => {
            return '删除成功'
          }, res.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info', message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.diaryHead {
  width: 100%;
  height: 90px;
  line-height: 80px;
}

.diaryHead > div {
  margin-left: 10px;
  float: left;
}

.diary_content {
  width:100%;
  height: 455px;
}
.diary_list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 400px;
}
</style>
