<template>
  <div style="background: rgb(236, 245, 255);margin-top: 15px;position: relative;">
    <div class="diaryHead">
      <div>
        <span>分类： </span>
        <el-select v-model="page.classify" clearable placeholder="请选择分类">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
  </div>
</template>

<script>
import diaryList from '@/components/my/article/diary/DiaryList'
import {MyPage} from '@/components/common/page'
import {diaryUrl} from '@/base_variable'
import http from '@/http.js'

export default {
  components: {
    diaryList
  },
  data () {
    return {
      page: new MyPage(4),
      expand: false,
      options: []
    }
  },
  created () {
    this.page.list = [
      {id: 1, name: '测试日记', status: 1, createTime: '2019年10月10日', labels: ['测试', '空白']},
      {id: 2, name: '今天日记', status: 2, createTime: '2019年11月10日', labels: ['愉悦', '成功', '偷税']},
      {id: 3, name: '今天日记', status: 2, createTime: '2019年11月10日', labels: ['愉悦', '成功', '偷税']},
      {id: 4, name: '今天日记', status: 2, createTime: '2019年11月10日', labels: ['愉悦', '成功', '偷税']},
      {id: 5, name: '今天日记', status: 2, createTime: '2019年11月10日', labels: ['愉悦', '成功', '偷税']}
    ]
    this.page.total = 5
    this.options = [{id: 1, name: '默认分类'}, {id: 2, name: '个人分类'}, {id: 3, name: '私人分类'}, {id: 4, name: '超级分类'}]
    this.page.requestUrl = diaryUrl
    // this.page.searchPage()
  },
  methods: {
    selectA (v) {
      console.log(v)
      console.log('model:' + this.page.classify)
    },
    editDiary (d) {},
    deleteDiary (d) {
      if (!d && d.id == null) {
        this.$message({
          message: '请选择文章',
          type: 'warning'
        });
        return
      }
      this.$confirm('是否删除该日记?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        http.$delete(diaryUrl + '/s/' + d.id + '/delete.do')
      }).catch(() => {
        this.$message({
          type: 'info', message: '已取消删除'
        });          
      });
    }
  }
}
</script>

<style scoped>
.diaryHead {
  width: 100%;
  height: 80px;
  line-height: 80px;
}

.diaryHead > div {
  margin-left: 10px;
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
