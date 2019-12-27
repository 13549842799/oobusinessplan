<template>
  <!-- <div>{{$route.params.type}}</div> -->
  <div class="divContiner">
    <div class="classify_head">
      <el-radio-group v-model="classifyType" size="small" @change="selClassify">
        <el-radio :label="1" border>日记</el-radio>
        <el-radio :label="3" border>备忘</el-radio>
        <el-radio :label="4" border>灵感</el-radio>
        <el-radio :label="5" border>小说</el-radio>
      </el-radio-group>
      <!-- <el-input
        style="width:200px;"
        placeholder="请输入内容"
        v-model="page.params.name"
        clearable>
      </el-input>
      <el-button style="margin-left: 30px;" icon="el-icon-search" type="primary" @click="searchPageByCondition">搜索</el-button>
      <div style="float:right;">
        <el-button type="text" @click="addClassify">添加分类</el-button>
      </div> -->
    </div>
    <div class="classify_head">
      文章数：
      <el-input  size="small" style="width:70px;" v-model="realPage.params.minCount" clearable></el-input>&nbsp; &lt; &nbsp;
      <el-input size="small" style="width:70px;" v-model="realPage.params.maxCount" clearable></el-input>&nbsp;&nbsp;
      <el-input
        size="small"
        style="width:200px;"
        placeholder="请输入内容"
        v-model="realPage.params.name"
        clearable>
      </el-input>
      <el-button style="margin-left: 30px;" icon="el-icon-search" type="primary" size="small" @click="searchPageByCondition">搜索</el-button>
      <el-button type="text" @click="addClassify">添加分类</el-button>
    </div>
    <div class="classify_content">
      <page-rolling ref="pRoll" :downRoll="downR" :speed="2">
        <table>
          <thead>
            <tr>
              <th style="width:10%;">排序</th>
              <th style="width:60%;text-align:left;">类别</th>
              <th style="width:20%;">操作</th>
              <th style="width:10%;">文章数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in realPage.list" :key="index">
              <td>{{index + 1}}</td>
              <td style="text-align:left;">
                <template v-if="editStatus != item.id">{{item.name}}</template>
                <template v-else>
                  <input type="text" v-model="editName" />
                  <el-button size="mini" type="text" @click="saveEdit(item)">保存</el-button>
                  <el-button size="mini" type="text" @click="cancelEdit(item)">取消</el-button>
                </template>
              </td>
              <td>
                <el-button type="text" @click="edit(item)">编辑</el-button>
                <el-button v-if="item.type !== 1" type="text" @click="checkArticleCount(item)">删除</el-button>
              </td>
              <td>{{item.count}}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr><th colspan=4 style="text-align: right">
            </th></tr>
          </tfoot>
        </table>
      </page-rolling>
    </div>
  </div>
</template>

<script>
import http from '@/http.js'
import {classifyUrl} from '@/base_variable'
import {MyPage} from '@/components/common/page'
import util from '@/components/common/objUtil'
import pageRolling from '@/components/common/pageRolling'

export default {
  components: {pageRolling},
  data () {
    return {
      page: null,
      editStatus: 0,
      editName: null,
      pages: {1: null, 3: null, 4: null, 5: null},
      classifyType: 1
    }
  },
  created () {
    this.selClassify(this.classifyType)
  },
  mounted () {
  },
  computed: {
    curPage () {
      return this.pages[this.classifyType]
    },
    realPage () {
      return util.validObj(this.curPage) ? this.curPage : new MyPage(null, {})
    }
  },
  methods: {
    downR (e) {
      this.realPage.appendNextPage()
    },
    selClassify (type) {
      let v = this
      if (util.validObj(v.curPage)) {
        return
      }
      v.pages[type] = new MyPage(10, {'url': classifyUrl + '/page.re', params: {childType: type}})
    },
    addClassify () {
      let v = this
      this.$prompt('请输入分类名', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消'
      }).then(({ value }) => {
        http.$axiosPost(classifyUrl + '/add.do', {childType: v.realPage.params.childType, name: value}).then(res => {
          v.realPage.appendNextLine(res) && v.$message.success('新增分类: ' + value)
        }).catch(err => { v.$message.error('添加失败：' + err.data.message) })
      }).catch(() => { this.$message.info('取消输入') })
    },
    /**
     * 打开编辑模式
     */
    edit (item) {
      let v = this
      v.editName = item.name
      v.editStatus = item.id
    },
    /**
     * 发送edit请求
     */
    saveEdit (item) {
      let v = this
      let n = util.newNotNullObject(item, [null], ['creator', 'createTime', 'count'])
      n.name = v.editName
      http.$axiosPost(classifyUrl + '/edit.do', n).then(res => {
        item.name = n.name
        v.cancelEdit(item)
      }).catch(err => { v.$message.error('编辑失败:' + err.data.message) })
    },
    /**
     * 取消编辑
     */
    cancelEdit (item) {
      let v = this
      v.editName = null
      v.editStatus = 0
    },
    checkArticleCount (item) {
      let v = this
      if (item.count === 0) {
        v.deleteClassify(item)
      } else {
        this.$confirm('此分类还存在' + item.count + '篇日记, 是否继续? 删除后原文章将转到默认分类中', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          v.deleteClassify(item)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    deleteClassify (item) {
      let v = this
      http.axiDel(classifyUrl + '/s/' + item.id + '/delete.do').then(res => {
        v.searchPageByCondition()
        v.$message.success('删除成功')
      }).catch(err => { v.$message.error('删除失败:' + err) })
    },
    searchPageByCondition () {
      this.$refs.pRoll.backTop()
      this.realPage.searchPage({value: [null], key: ['list']})
    }
  },
  beforeRouteUpdate (to, from, next) { // 已被弃用, 只作为知识点案例保留
    // this.initPage(to.query.type)
    next() // 必须要调用next()方法才能刷新域名，如果不调用则会造成路由跳转了但域名不变，重新回到第一个域名时不生效
  }
}

</script>

<style scoped>

.classify_head {
  width: 100%;
  margin-top: 20px;
  text-align: center;
}

.classify_content {
  width: 100%;
  height: 750px;
  overflow-y: hidden;
}

table {
  width: 100%;
  text-align: center;
}

thead > tr, tbody > tr {
  border-bottom: 1px solid #e9e9e9;
}
thead > tr {
  height: 30px;
  color: #999999;
}
tbody > tr {
  height: 50px;
}
</style>
