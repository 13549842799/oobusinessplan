<template>
  <!-- <div>{{$route.params.type}}</div> -->
  <div>
    <div class="classify_head">
      <el-input
        style="width:200px;"
        placeholder="请输入内容"
        v-model="page.searchText"
        clearable>
      </el-input>
      <el-button style="margin-left: 30px;" icon="el-icon-search" type="primary">搜索</el-button>
      <div style="float:right;">
        <el-button type="text" @click="addClassify">添加分类</el-button>
      </div>
    </div>
    <div class="classify_content">
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
            <td>{{index}}</td>
            <td style="text-align:left;">{{item.name}}</td>
            <td>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </td>
            <td>{{item.count}}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><th colspan=4 style="text-align: right">
            <el-pagination
              layout="prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page.pageNum"
              :page-size="page.pageSize"
              :total="page.total">
            </el-pagination>
          </th></tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import http from '@/http.js'
import base from '@/base_variable'
import commonM from '@/components/common/commonMixins'
import pagePlug from '@/components/common/page'

export default {
  mixins: [commonM, pagePlug],
  data () {
    return {
      childType: null
    }
  },
  created () {
    let v = this
    v.page.childType = v.$route.params.type
    v.page.requestUrl = base.classifyUrl + '/list.re'
    v.searchPage({value: [null]})
  },
  methods: {
    addClassify () {
      let v = this
      this.$prompt('请输入分类名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let param = JSON.stringify({childtype: 1, name: value})
        http.$post(base.classifyUrl + '/add.do', param).then(res => {
          v.simpleDealResult(res.status, function () {
            v.page.list.push(res.data)
            v.page.total++
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
    }
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
