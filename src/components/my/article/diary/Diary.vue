<template>
  <div style="background: rgb(236, 245, 255);margin-top: 15px;position: relative;">
    <div v-show="state === 0">
      <div class="diaryHead">
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
          <el-select v-model="page.params.status" clearable placeholder="状态" size="mini" style="width:100px;">
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
            v-model="page.params.title"
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
            <el-button type="text" size="mini" @click="readDiary(d)">查看</el-button>
            <template v-if="d.source === 1">
              <span style="color: #E4E7ED;">|</span>
              <el-button type="text" size="mini" @click="editDiary(d)">编辑</el-button>
            </template>
            <span style="color: #E4E7ED;">|</span>
            <el-button type="text" size="mini" style="color:red" @click="deleteDiary(d)">删除</el-button>
          </diary-list>
        </div>
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
    <div v-show="state === 1">
      <diary-read :diary="currentDiary" v-on:goBack="readGoBack"></diary-read>
    </div>
  </div>
</template>

<script>
import diaryList from '@/components/my/article/diary/DiaryList'
import diaryRead from '@/components/my/article/diary/DiaryRead'
import {MyPage} from '@/components/common/page'
import {diaryUrl, classifyUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  mixins: [],
  components: {
    diaryList,
    diaryRead
  },
  data () {
    return {
      state: 0,
      currentDiary: {},
      page: null,
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
    // 获取日记列表
    this.page = new MyPage(4, {url: diaryUrl + '/list.re', total: 5})
  },
  mounted () {
    let v = this
    // 获取分类列表
    http.$axiosGet(classifyUrl + '/list.re', {childType: 1}).then(res => {
      v.options = res !== null && res.length > 0 ? res : []
    }).catch(err => { console.log(err) })
  },
  methods: {
    sizeChange (size) {

    },
    currentChange (val) {
      this.page.requestList(null, null, val)
    },
    searchDiary () {
      let v = this
      v.page.params.startTime = v.timeRange[0]
      v.page.params.endTime = v.timeRange[1]
      this.page.searchPage()
    },
    selectA (v) {
      console.log(v)
      console.log('model:' + this.page.params.classify)
    },
    newDiary () {
      console.log('进入新的路径')
      this.$router.push({name: 'diaryEdit'})
    },
    readDiary (d) {
      this.state = 1
      this.currentDiary = d
    },
    editDiary (d) {
      this.$router.push({name: 'diaryEdit', params: {diaryOrder: d.id}})
    },
    readGoBack () {
      this.state = 0
      this.currentDiary = {}
    },
    deleteDiary (d) {
      if (!d && d.id == null) {
        this.$message.warning('请选择文章')
        return
      }
      let v = this
      this.$confirm('是否删除该日记?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        http.$axiosDel(diaryUrl + '/s/' + d.id + '/delete.do').then(res => {
          v.page.removeLine(d)
          v.$message.success('删除成功')
        }).catch(err => { v.$message.error(err.message) })
      }).catch(() => {
        this.$message.info('已取消删除')
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
