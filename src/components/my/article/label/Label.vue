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
      <div style="width:300px;float:right;">
        <div style="width:60%;display:inline-block;"><el-input v-model="label.name" placeholder="请输入内容"></el-input></div>
        <el-popover
          placement="bottom"
          width="200"
          trigger="manual"
          v-model="label.visible"
          :content="label.content">
          <el-button slot="reference" type="primary" @click="addLabel">添加标签</el-button>
        </el-popover>
      </div>
    </div>
    <div class="label_content">
      <page-rolling :speed="8" :downRoll="downRoll">
        <el-table
        :data="page.list"
        style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
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
            width="250">
            <template slot-scope="scope">
              <el-button @click="editLabel(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="removeLabel(scope.row)" type="text" size="small">删除</el-button>
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
import commonM from '@/components/common/commonMixins'
import {MyPage} from '@/components/common/page'
// import util from '@/components/common/objUtil'
import pageRolling from '@/components/common/pageRolling'

export default {
  mixins: [commonM],
  components: {pageRolling},
  data () {
    return {
      page: new MyPage(6),
      pageConfig: {loading: 'load', load: false},
      label: {
        name: null,
        visible: false,
        content: null
      }
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
      http.$postP(labelUrl + '/add.do', JSON.stringify({name: v.label.name})).then(res => {
        v.label.name = null
        v.$message.success('创建成功')
        v.page.appendNextLine(res.data)
      }).catch(res => {
        v.$message.warning(res.message)
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
        http.$patchP(labelUrl + '/update.do', JSON.stringify({id: o.id, name: value})).then((res) => {
          o.name = value
          v.$message.success('编辑成功')
        }).catch(res => { console.log(res) })
      })
    },
    removeLabel (o) {
      let v = this
      http.$getP(labelUrl + '/useCount.re', {id: o.id}).then(res => {
        let count = parseInt(res.data)
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
      http.$deleteP(labelUrl + '/s/' + o.id + '/delete.do').then(res => {
        v.page.removeLine(o)
        v.$message.success('删除成功')
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
