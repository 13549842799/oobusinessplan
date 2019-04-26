<template>
  <div class="back_ground">
    <div class="diary_content">
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
            <div>
              <span>标签：</span>
              <el-tag
                style="margin-right: 10px;"
                v-for="l in labelSelfs"
                :key="l.name"
                closable
                type="success">
                {{l.name}}
              </el-tag>
              <el-button v-if="!labelEdit.labelStatus" class="el-icon-plus"
                size="mini" circle type="success" @click="labelEdit.labelStatus = true">
              </el-button>
              <template v-if="labelEdit.labelStatus">
              <el-autocomplete
                class="inline-input"
                v-model="labelEdit.labelName"
                valueKey="name"
                :fetch-suggestions="querySearch"
                placeholder="请选择标签或创建标签名">
              </el-autocomplete>
              <el-button type="text" size="mini" @click="addLabel">添加</el-button>
              </template>
              <div style="float:right;">
                <span>日记日期&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <el-date-picker
                  v-model="diaryDate"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </div>
            </div>
            <div>
              <span>分类：</span>
              <el-select v-model="classify" filterable placeholder="请选择">
                <el-option
                  v-for="item in classifies"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div>
              <span>保存类型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-radio-group v-model="status" size="small">
                <el-radio :label="0" border>存为草稿</el-radio>
                <el-radio :label="1" border>私密发布</el-radio>
                <el-radio :label="2" border>发布</el-radio>
              </el-radio-group>
            </div>
            <div style="text-align:center;">
              <el-button @click="saveDiary">保存</el-button>
              <el-button @click="goBack">返回</el-button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/http.js'
import {diaryUrl, labelUrl, classifyUrl} from '@/base_variable'
import commonM from '@/components/common/commonMixins'
import $ from 'jquery'
import {arrToStr, dateFormat} from '@/components/common/commonUtil'

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
      labelEdit: {
        labelName: null, // 输入的标签名
        labelStatus: false, // 按钮和select的状态
        labels: [] // 当前用户创建过的所有标签内
      },
      labelSelfs: [], // 当前文章被标上的标签
      classifies: [], // 分类数组
      classify: null, // 选中的分类的id
      status: 0,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      diaryDate: null
    }
  },
  methods: {
    onEditorBlur (e) {
      console.log(e)
      console.log(this.content)
    },
    onEditorFocus (e) {
      // console.log(e)
    },
    onEditorReady (e) {
      // console.log(e)
    },
    querySearch (queryString, cb) {
      var restaurants = this.labelEdit.labels
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAllLabels () {
      let v = this
      http.$get(labelUrl + '/list.re', {status: 1}).then(res => {
        v.simpleDealResult(res.status, () => {
          this.labelEdit.labels = res.data === null ? [] : res.data
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
      let v = this
      console.log(v.labelSelfs.includes(item))
      v.labelEdit.labelStatus = false
      v.labelEdit.labelName = null
    },
    addLabel (e) {
      let v = this
      if (v.labelEdit.labelName !== null && $.trim(v.labelEdit.labelName) !== '') {
        let arr = v.labelEdit.labels.filter(v.checkLabelExists(v.labelEdit.labelName))
        if (arr.length === 0) {
          http.$post(labelUrl + '/add.do', JSON.stringify({name: v.labelEdit.labelName})).then(res => {
            v.labelEdit.labels.push(res.data)
            v.labelSelfs.push(res.data)
          })
        } else {
          v.labelSelfs.push(arr[0])
        }
      }
      v.labelEdit.labelStatus = false
      v.labelEdit.labelName = null
    },
    checkLabelExists (name) {
      return (l) => {
        return l.name === name
      }
    },
    saveDiary () {
      let v = this
      if ($.trim(v.title).length === 0) {
        v.$message({message: '请输入标题', type: 'warning'})
        return
      }
      // 获取标签id字符串
      let labelIds = arrToStr(v.labelSelfs, 'id')
      let params = {
        id: v.id,
        title: v.title,
        content: v.content,
        classify: v.classify,
        date: dateFormat('yyyy-MM-dd', v.diaryDate),
        labels: labelIds,
        status: v.status
      }
      http.$post(diaryUrl + '/addOrUpdate.do', JSON.stringify(params)).then(res => {
        v.simpleDealResult(res.status, () => {
          if (v.id === null) {
            v.id = res.data.id
          }
          return '日记保存成功'
        }, res.message)
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  computed: {
    editor () {
      return this.$refs.quillEditor.quill
    }
  },
  created () {
    let v = this
    // 获取所有的分类
    http.$get(classifyUrl + '/list.re', {childType: 1}).then(res => {
      v.classifies = res.data
    })
    if (!v.diaryOrder) {
      return
    }
    // 获取日记内容
    http.$get(diaryUrl + '/s/' + v.diaryOrder + '/diary.re').then(res => {
      v.simpleDealResult(res.status, () => {
        v.id = res.id
        v.title = res.title
        v.labelSelfs = res.labels
        v.content = res.content
        v.diaryDate = res.date
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
.back_ground {
  position:absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 999;
}

.diary_content {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 1200px;
  height: 1200px;
  margin: 0 auto;
}

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

.diary_edit_foot > div {
  margin-bottom: 10px;
}
</style>
