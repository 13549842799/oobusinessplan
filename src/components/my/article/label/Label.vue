<template>
  <div>
    <div class="label_head">
      <div>
        <el-input
          placeholder="请输入名称"
          prefix-icon="el-icon-search"
          v-model="page.name">
        </el-input>
      </div>
      <div>
        <el-button icon="el-icon-search" clearable circle @click="searchLabel"></el-button>
      </div>
    </div>
    <div class="label_content">
      <page-rolling :speed="8" :downRoll="downRoll">
        <el-table
        :data="page.list"
        style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            width="200">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="450">
          </el-table-column>
          <el-table-column
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button @click="editLabel(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="removeLabel(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="page.config.status" style="width:100%; height:50px" v-loading="page.config.status"></div>
      </page-rolling>
    </div>
  </div>
</template>

<script>
import http from '@/http.js'
import {labelUrl} from '@/base_variable'
import commonM from '@/components/common/commonMixins'
import {MyPage} from '@/components/common/page'
import util from '@/components/common/objUtil'
import pageRolling from '@/components/common/pageRolling'

export default {
  mixins: [commonM],
  components: {pageRolling},
  data () {
    return {
      page: new MyPage(6),
    }
  },
  created () {
    let v = this
    // 初始化page
    v.page.requestUrl = labelUrl + '/page.re'
    v.page.searchPage()
  },
  methods: {
    downRoll (e) {
      this.page.appendNextPage()
    },
    searchLabel () {
      this.page.searchPage()
    },
    editLabel (o) {
      let v = this
      this.$prompt('请编辑名称', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputValue: o.name
      }).then(({ value }) => {
        if (value === o.name) {
          return
        }
        http.$patch(labelUrl + '/update.do', JSON.stringify({id: o.id, name: value})).then((res) => {
          v.simpleDealResult(res.status, () => {
            o.name = value
            return '编辑成功'
          }, res.message)
        })
      })
    },
    removeLabel (o) {
      let v = this
      http.$get(labelUrl + '/useCount.re', {id: o.id}).then(res => {
        v.simpleDealResult(res.status, () => {
          let count = parseInt(res.data)
          if (count === 0) {
            v.deleteHttp(o)
            return
          }
          this.$confirm('当前还有' + count + '篇文章使用此标签，是否继续删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            v.deleteHttp(o)
          })
        }, res.message)
      })
    },
    deleteHttp (o) {
      let v = this
      http.$delete(labelUrl + '/s/' + o.id + '/delete.do').then(res => {
        v.page.removeLine(o)
        return '删除成功'
      })
    }
  }
}
</script>

<style scoped>
.label_head, .label_content {
  width: 100%;
}
.label_head {
  height: 60px;
  margin-top: 20px;
}
.label_content {
  height: 350px;
}
.label_head > div {
  float: left;
  margin-right: 10px;
}
</style>
