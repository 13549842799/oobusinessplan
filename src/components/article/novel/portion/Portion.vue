<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="100px">
        <div style="height:50px"> <!-- 页头 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'articleNovel' }" replace>脑洞小说</el-breadcrumb-item>
            <el-breadcrumb-item >分卷管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <p class="portion-novel-title">作品名：{{novelTitle}}</p>
      </el-header>
      <el-main>
        <el-table
          :data="portions"
          style="width: 100%"
          max-height="800px"
          highlight-current-row
          @current-change="handleCurrentChange"
          @expand-change="expandChange"
          row-key="id">
          <el-table-column width="580" label="分卷名">
            <template slot-scope="scope">
              <div style="position: relative;display: inline-block; width: 80%">
                <span class="portion-content-title">{{scope.row.title}}·共&nbsp;{{scope.row.sectionNum}}&nbsp;章</span>
                <el-tag style="margin-left: 10px;margin-right: 10px;" :type="scope.row.type === 0 ? 'warning' : 'success'" effect="dark" size="mini">{{scope.row.type === 0 ? '提要' : '正文'}}</el-tag>
                <span style="font-size:13px;position: absolute; bottom: 0;color: #666">本卷共&nbsp;{{scope.row.wordsNum}}&nbsp;字</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="" v-for="s in props.row.sections" :key="s.id">
                  <span @click="goToSection(s.id, props.row.id)" style="cursor: pointer;">{{ s.title }}</span>
                  <el-button type="text" @click="deleteSection(s, props.row)">删除</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="modifyTimeStr"
            width="200"
            label="最后修改时间">
          </el-table-column>
          <el-table-column align="right">
        <template slot="header" slot-scope="scope">
            <el-button size="medium" type="text" @click="openPortionForm(1)">新建分卷</el-button>
        </template>
        <!-- <template slot-scope="scope">
        </template> -->
        </el-table-column>
        </el-table>
        <div style="margin-top: 20px; height: 50px">
          <div v-show="current != null" style="height: 100%; width: 50%;float: left">
            <el-button @click="goToSection" size="mini" type="primary">新建一章</el-button>
            <el-button @click="openPortionForm(2)" size="mini" type="primary" v-show="current != null && current.type !== 0">修改分卷</el-button>
            <el-button @click="deletePortion" size="mini" type="danger">删除当前分卷</el-button>
          </div>
        </div>
      </el-main>
      <el-footer>
      </el-footer>
    </el-container>
    <!-- =================== 分卷新增编辑对话框 =================== -->
    <el-dialog :title="portionItem.form.id === null ? '新建分卷' : '编辑分卷'" :visible.sync="portionItem.open" >
      <el-form :model="portionItem.form" :rules="portionItem.rules" v-loading="portionItem.loading" element-loading-text="奔走提交中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form-item label="分卷名称" label-width="80px" prop="title">
          <el-input v-model="portionItem.form.title"></el-input>
        </el-form-item>
        <el-form-item label="简介" label-width="80px">
          <el-input type="textarea" :rows="4" placeholder="请简单的介绍一下本分卷的内容吧" v-model="portionItem.form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="portionItem.open = false">取 消</el-button>
        <el-button type="primary" @click="submitPortion">确 定</el-button>
      </div>
    </el-dialog>
    <!-- =================== 分卷新增编辑对话框 end =================== -->
  </div>
</template>

<script>
import util from '@/components/common/objUtil'
import basicTable from '@/components/common/table/basicMethod'

import portionApi from '@/components/article/novel/portion/portionApi'
import sectionApi from '@/components/article/novel/section/sectionApi'

export default {
  props: ['novelOrder', 'novelTitle'],
  mixins: [basicTable],
  data () {
    return {
      portions: [],
      portionItem: {
        form: blankPortion(this.novelOrder),
        open: false,
        loading: false,
        rules: {
          title: [
            { required: true, message: '请输入分卷名称', trigger: 'blur' }
          ]
        }
      },
      current: null
    }
  },
  created () {
    let v = this
    portionApi.getPortionsList(this.novelOrder, {expand: 0}).then(res => {
      v.portions = res
    }).catch(err => { console.log(err) })
  },
  computed: {
  },
  methods: {
    expandChange (row, b) {
      if (!row.initSection) {
        portionApi.getPortionsList(this.novelOrder, {portion: row.id, expand: 1}).then(res => {
          let s = res && res.length === 1 && util.validObj(res[0].sections) ? res[0].sections : []
          row.sections = s
          row.initSection = true
        }).catch(err => { console.log(err) })
      }
    },
    load (tree, treeNode, resolve) {
      portionApi.getPortionsList(this.novelOrder, {portion: tree.id, expand: 1}).then(res => {
        let s = res && res.length === 1 && util.validObj(res[0].sections) ? res[0].sections : []
        console.log(s)
        resolve(s)
      }).catch(err => { console.log(err) })
    },
    handleCurrentChange (val) {
      this.current = val
    },
    goToSection (id, portionId) {
      let pid = portionId !== undefined && portionId !== null ? portionId : this.current.id
      let params = {
        novelTitle: this.novelTitle,
        portionOrder: pid,
        id: typeof id === 'number' ? id : null
      }
      this.$router.push({name: 'portionSection', params})
    },
    openPortionForm (type) {
      this.portionItem.form = type === 1 ? blankPortion(this.novelOrder) : {...this.current}
      this.portionItem.open = true
    },
    submitPortion () {
      let v = this
      v.portionItem.open = true
      portionApi.savePortion(v.portionItem.form, {'complete': () => { v.portionItem.open = false }}).then(res => {
        if (v.portionItem.form.id) {
          let p = v.portions.find(o => { return o.id === v.portionItem.form.id })
          p.title = v.portionItem.form.title
          p.content = v.portionItem.form.content
        } else {
          v.portions.push(res)
        }
        v.portionItem.open = false
        v.$message.success(v.portionItem.form.id === null ? '分卷创建成功' : '分卷修改成功')
      }).catch(err => { v.$message.warning(err.data.message) })
    },
    deletePortion () {
      let v = this
      const delMethod = () => {
        portionApi.deletePortion(v.current.id).then(res => {
          let index = v.portions.findIndex((o) => { return o.id === v.current.id })
          v.portions.splice(index, 1)
          v.current = null
          v.$message({ type: 'success', message: '删除成功!' })
        }).catch(err => { v.$message.error(err.data.message) })
      }
      v.basicDelete({obj: v.current, objName: 'title', delMethod})
    },
    deleteSection (section, portion) {
      let v = this
      const delMethod = () => {
        sectionApi.deleteSection(section.id).then(res => {
          let index = portion.sections.findIndex((o) => { return o.id === section.id })
          portion.sections.splice(index, 1)
          v.$message({ type: 'success', message: '删除成功!' })
        }).catch(err => { v.$message.error(err.data.message) })
      }
      console.log(section)
      v.basicDelete({obj: section, objName: 'title', delMethod})
    }
  }
}

function blankPortion (novelId) {
  return {
    id: null,
    title: '',
    content: '',
    novelId: novelId,
    type: 1
  }
}

</script>

<style scoped>
.portion-novel-title {
  font-family: "微软雅黑";
}

.demo-table-expand .el-form-item {
  width: 33% !important;
}

</style>
