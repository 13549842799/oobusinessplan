<template>
  <!-- <div>{{$route.params.type}}</div> -->
  <div>
    <div class="classify_head">
      <el-input
        style="width:200px;"
        placeholder="请输入内容"
        v-model="page.name"
        clearable>
      </el-input>
      <el-button style="margin-left: 30px;" icon="el-icon-search" type="primary" @click="searchPageByCondition">搜索</el-button>
      <div style="float:right;">
        <el-button type="text" @click="addClassify">添加分类</el-button>
      </div>
    </div>
    <div class="classify_content">
      <page-rolling :downRoll="downR" :speed="8">
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
            <tr v-for="(item, index) in page.list" :key="index">
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
                <el-button type="text" @click="checkArticleCount(item)">删除</el-button>
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
import commonM from '@/components/common/commonMixins'
import {MyPage} from '@/components/common/page'
import util from '@/components/common/objUtil'
import pageRolling from '@/components/common/pageRolling'

export default {
  components: {pageRolling},
  mixins: [commonM],
  data () {
    return {
      page: new MyPage(7),
      editStatus: 0,
      editName: null
    }
  },
  created () {
    this.initPage(this.$route.query.type)
  },
  mounted () {
  },
  methods: {
    downR (e) {
      this.page.appendNextPage()
    },
    /**
     * 初始化page
     */
    initPage (type) {
      let v = this
      v.page = new MyPage(7)
      v.page.requestUrl = classifyUrl + '/page.re'
      v.page.childType = type
      v.searchPageByCondition()
    },
    addClassify () {
      let v = this
      this.$prompt('请输入分类名', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消'
      }).then(({ value }) => {
        let param = JSON.stringify({childType: v.page.childType, name: value})
        http.$post(classifyUrl + '/add.do', param).then(res => {
          v.simpleDealResult(res.status, function () {
            v.page.appendNextLine(res.data)
            return '新增分类: ' + value
          }, '添加失败' + res.message)
          this.$message({
            type: 'success',
            message: '新增分类: ' + value
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
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
      let n = util.newNotNullObject(item, [null], ['creator', 'createTime'])
      n.name = v.editName
      http.$post(classifyUrl + '/edit.do', JSON.stringify(n)).then(res => {
        v.simpleDealResult(res.status, function () {
          item.name = n.name
          v.cancelEdit(item)
        }, '编辑失败' + res.message)
      })
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
      // http.$delete(classifyUrl + '/s/' + item.id + '/delete.do').then(res => {
      //   v.simpleDealResult(res.status, function () {
      //     v.page.list.splice(item, 1)
      //     v.page.total--
      //     return '删除成功'
      //   }, '删除失败' + res.message)
      // })
      http.axiDel(classifyUrl + '/s/' + item.id + '/delete.do').then(res => {
        v.simpleDealResult(res.status, function () {
          v.page.list.splice(item, 1)
          v.page.total--
          return '删除成功'
        }, '删除失败' + res.message)
      })
    },
    searchPageByCondition () {
      this.page.searchPage({value: [null], key: ['list']})
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.initPage(to.query.type)
    next() // 必须要调用next()方法才能刷新域名，如果不调用则会造成路由跳转了但域名不变，重新回到第一个域名时不生效
  }
}
</script>

<style scoped>
.classify_head {
  width: 100%;
  height: 80px;
  margin-top: 20px;
}

.classify_content {
  width: 100%;
  height: 350px;
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
