<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="100px">
        <div style="height:50px">
          <el-page-header @back="goBack" :content="pageTitle"></el-page-header>
        </div>
        <div>
          <el-input placeholder="请输入标题" v-model="entity.title" clearable>
          </el-input>
        </div>
      </el-header>
      <el-main>
        <editor ref="editor" :html="acceptHtml" style="margin-bottom: 15px;"></editor>
        <div style="width: 100%; margin-top:10px">
          <el-input style="width: 220px" placeholder="请输入创建的标签名" v-model="labelEdit.labelName" clearable></el-input>
          <el-button type="text" size="mini" @click="addLabel" style="margin-right: 20px">添加</el-button>
          <el-tag
            style="margin-right: 10px;"
            v-for="l in entity.labelList"
            :key="l.name"
            v-show="l.delflag === 1"
            @close="removeLabel(l)"
            closable
            type="success">
            {{l.name}}
          </el-tag>
          <el-divider content-position="left">常用标签</el-divider>
          <el-tag
            style="margin-right: 10px;cursor: pointer;"
            v-for="(l, index) in labelEdit.labels"
            :key="index"
            @click="addLabel(l)"
            type="danger">
            {{l}}
          </el-tag>
          <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
        </div>
      </el-main>
      <el-footer>
        <div style="width: 100%; margin-top:10px">
          <el-button type="primary" plain @click="saveEntity" size="small">保存文章</el-button>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import util from '@/components/common/objUtil'

import articleApi from '@/components/knowledge/article/knowledgeArticleApi'
import labelApi from '@/components/article/label/labelApi'

import editor from '@/components/common/form/MyEditor'

export default {
  props: ['id'],
  components: {
    editor
  },
  data () {
    return {
      entity: blankEntity(),
      labelEdit: {
        labelName: null, // 输入的标签名
        labels: [] // 默认提供的常用标签
      }
    }
  },
  created () {
    let v = this
    labelApi.frequentlyUsedList(5).then(res => {
      v.labelEdit.labels = res === null ? [] : res
    }).catch(err => { console.log(err) })
  },
  mounted () {
    let v = this
    if (!v.id) {
      return
    }
    articleApi.getEntity(v.id).then(res => {
      v.entity = res
      v.$refs.editor.initHtml(v.entity.content)
    }).catch(err => { console.log(err) })
  },
  computed: {
    pageTitle () {
      return this.entity.id !== null ? '编辑文章' : '新建文章'
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    acceptHtml (html) {
      this.entity.content = html
    },
    addLabel (e) {
      let v = this
      let n = typeof e === 'string' ? e : v.labelEdit.labelName
      if (util.strNotEmpty(n)) {
        let index = v.entity.labelList.findIndex(o => { return o.name === n })
        if (index > -1) {
          v.$message.warning('已经存在同名的标签')
          return
        }
        v.entity.labelList.push({'name': n, 'delflag': 1})
      }
      v.labelEdit.labelName = null
    },
    /**
     * 移除标签，如果是新增加的标签则直接移除，如果是已有标签，则设置delflag 为 0
     */
    removeLabel (label) {
      if (label.id) {
        label.delflag = 0
      } else {
        let index = this.entity.labelList.findIndex(o => { return o.name === label.name })
        this.entity.labelList.splice(index, 1)
      }
    },
    saveEntity () {
      let v = this
      if (v.title && v.title.trim().length === 0) {
        v.$message.warning('请输入标题')
        return
      }
      const loading = v.$loading({
        lock: true,
        text: '拼死保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let params = util.newNotNullObject(v.entity)
      articleApi.saveEntity(params, {complete: () => { loading.close() }}).then(res => {
        v.entity.id = res.id
        v.entity.labelList = util.validObjDef(res.labelList, [])
        v.$message.success('文章保存成功')
      }).catch(err => { err.data && err.data.message && v.$message.warning(err.data.message) })
    }
  }
}

function blankEntity () {
  return {
    id: null,
    title: null,
    content: null,
    labelList: [] // 当前文章被标上的标签
  }
}
</script>

<style>
</style>
