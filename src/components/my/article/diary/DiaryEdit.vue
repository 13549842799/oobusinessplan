<template>
  <div class="diary_edit">
      <div class="diary_edit_head">
        <el-input
          placeholder="请输入标题"
          v-model="title"
          clearable>
        </el-input>
      </div>
      <div class="diary_edit_content">
        <quill-editor
          style="height: 90%;"
          v-model="content"
          :options="editorOption"
          ref="quillEditor"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
        >
        </quill-editor>
      </div>
      <div class="diary_edit_foot">
        <span>标签：</span>
        <el-tag
          v-for="l in labelSelfs"
          :key="l.name"
          closable
          type="success">
          {{l.name}}
        </el-tag>
        <el-button v-if="!labelStatus" class="el-icon-plus"
          size="mini" circle type="success" @click="labelStatus = true">
        </el-button>
        <el-autocomplete
          v-if="labelStatus"
          class="inline-input"
          v-model="labelName"
          :fetch-suggestions="querySearch"
          placeholder="请选择标签或创建标签名"
          @select="handleSelect"
          @blur="addLabel">
        </el-autocomplete>
        <div style="text-align:center;"><el-button>保存</el-button></div>
      </div>
  </div>
</template>

<script>
import http from '@/http.js'
import {diaryUrl, labelUrl} from '@/base_variable'
import commonM from '@/components/common/commonMixins'

export default {
  mixins: [commonM],
  props: ['diaryOrder'],
  data () {
    return {
      id: null,
      title: null,
      content: null,
      editorOption: {
        placeholder: '请输入内容'
      },
      labelStatus: false,
      labelName: null,
      labels: [],
      labelSelfs: []
    }
  },
  methods: {
    onEditorBlur (e) {
      console.log(e)
    },
    onEditorFocus (e) {
      console.log(e)
    },
    onEditorReady (e) {
      console.log(e)
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAllLabels () {
      let v = this
      http.$get(labelUrl + '/list.re').then(res => {
        v.simpleDealResult(res.status, () => {
          this.labels = res.data
        })
      })
      // return [
      //   { 'value': "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
      //   { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
      //   { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
      //   { "value": "泷千家(天山西路店)", "address": "天山西路438号" }
      // ]
    },
    handleSelect (item) {
      console.log(item)
    },
    addLabel () {
      let v = this
      if (v.labelName !== null && v.labelName.replace(/(^\s*)|(\s*$)/g, '') !== '') {
        
      }
      v.labelStatus = false
    }
  },
  computed: {
    editor () {
      return this.$refs.quillEditor.quill
    }
  },
  created () {
    let v = this
    if (!v.diaryOrder) {
      return
    }
    http.$get(diaryUrl + '/s/' + v.diaryOrder + '/diary.re').then(res => {
      v.simpleDealResult(res.status, () => {
        v.title = res.title
        v.labelSelfs = res.labels
        v.content = res.content
      })
    })
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
    this.loadAllLabels()
  }
}
</script>

<style scoped>
.diary_edit {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 800px;
  background: #ffffff;
  position: relative;
  padding: 20px;
}

.diary_edit_head {
}

.diary_edit_content {
  margin-top: 20px;
  height: 600px;
}

.diary_edit_foot {
  height: 100px;
}

.diary_edit_foot span {
  font-size: 16px;
}
</style>
