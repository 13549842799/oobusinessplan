<template>
  <div>
    <div class="label_head">
      <div>
        <el-input
          placeholder="请输入名称"
          prefix-icon="el-icon-search"
          v-model="page.params.name">
        </el-input>
      </div>
      <div>
        <el-button icon="el-icon-search" clearable circle @click="searchLabel"></el-button>
      </div>
      <div style="width:300px;float:right;">
        <!-- <div style="width:60%;display:inline-block;"><el-input v-model="label.name" placeholder="请输入内容"></el-input></div>
        <el-popover
          placement="bottom"
          width="200"
          trigger="manual"
          v-model="label.visible"
          :content="label.content">
          <el-button slot="reference" type="primary" @click="addLabel">添加标签</el-button>
        </el-popover> -->
      </div>
    </div>
    <div class="label_content">
      <page-rolling :speed="8" :downRoll="downRoll">
        <el-table
        :data="page.list"
        style="width: 100%">
          <el-table-column
            type="index"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="250">
          </el-table-column>
          <el-table-column
            label="所属分类"
            width="200">
            <template slot-scope="scope">
              <el-tag size="medium" :type="getTypeMap(scope.row.targetType)['sign']">{{ getTypeMap(scope.row.targetType)['name'] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="count"
            label="使用次数"
            width="200">
          </el-table-column>
          <el-table-column
            label="操作"
            width="250">
            <template slot-scope="scope">
              <!-- <el-button @click="editLabel(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="removeLabel(scope.row)" type="text" size="small">删除</el-button> -->
              <el-button @click="editLabel(scope.row.name, scope.row.targetType)" type="text" size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="pageConfig.load" style="width:100%; height:50px" v-loading="pageConfig.load"></div>
      </page-rolling>
    </div>
  </div>
</template>

<script>
import http from '@/http.js'
import {labelUrl} from '@/base_variable'
import {MyPage} from '@/components/common/page'

import pageRolling from '@/components/common/pageRolling'

const typeMap = {1: {'name': '日记', 'sign': ''}, 4: {'name': '小说', 'sign': 'success'}}

export default {
  components: {pageRolling},
  data () {
    return {
      page: null,
      pageConfig: {loading: 'load', load: false},
      label: {
        name: null,
        visible: false,
        content: null
      }
    }
  },
  created () {
    // 初始化page
    this.page = new MyPage(6, {url: labelUrl + '/page.re'})
  },
  methods: {
    downRoll (e) {
      this.page.appendNextPage(this.pageConfig)
    },
    searchLabel () {
      this.page.searchPage()
    },
    addLabel () {
      let v = this
      if (v.label.name === null || v.label.name === '') {
        return
      }
      http.$axiosPost(labelUrl + '/add.do', {name: v.label.name}).then(res => {
        v.$message.success('创建成功') && v.page.appendNextLine(res) && (v.label.name = '')
      }).catch(res => {
        v.$message.warning(res.data.message)
      })
    },
    editLabel (o) {
      let v = this
      this.$prompt('请编辑名称', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputValue: o.name,
        closeOnClickModal: false
      }).then(({ value }) => {
        if (value === o.name) {
          return
        }
        http.$axiosPat(labelUrl + '/update.do', {id: o.id, name: value}).then((res) => {
          v.$message.success('编辑成功') && (o.name = value)
        }).catch(res => { console.log(res) })
      })
    },
    removeLabel (o) {
      let v = this
      http.$axiosGet(labelUrl + '/useCount.re', {id: o.id}).then(res => {
        let count = parseInt(res)
        if (count !== 0) {
          return count
        }
        v.deleteHttp(o)
        return new Promise(() => {})
      }).then(count => {
        this.$confirm('当前还有' + count + '篇文章使用此标签，是否继续删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          v.deleteHttp(o)
        })
      }).catch(res => {
        console.log('error', res)
      })
    },
    deleteHttp (o) {
      let v = this
      http.$axiosDel(labelUrl + '/s/' + o.id + '/delete.do').then(res => {
        v.page.removeLine(o)
        v.$message.success('删除成功')
      })
    },
    getTypeMap (type) {
      return typeMap[type]
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
