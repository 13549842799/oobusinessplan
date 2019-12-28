<template>
  <div class="back_ground">
    <div class="diary_content">
      <div class="diary_edit">
          <div class="diary_edit_head">
            <el-input
              placeholder="请输入标题"
              v-model="diary.title"
              clearable>
            </el-input>
          </div>
          <div class="diary_edit_content">
            <!-- <quill-editor
              style="height: 90%;"
              v-model="diary.content"
              :options="editorOption"
              ref="quillEditor"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
            >
            </quill-editor> -->
            <editor ref="editor" :html="acceptHtml"></editor>
          </div>
          <div class="diary_edit_foot">
            <div>
              <span >标签：</span>
              <el-tag
                style="margin-right: 10px;"
                v-for="l in diary.labelList"
                :key="l.name"
                v-show="l.delflag === 1"
                @close="removeLabel(l)"
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
              <el-select v-model="diary.classify" filterable placeholder="请选择">
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
              <el-radio-group v-model="diary.status" size="small">
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
import {dateFormat} from '@/components/common/commonUtil'
import util from '@/components/common/objUtil'

import editor from '@/components/common/form/MyEditor'

export default {
  props: ['diaryOrder'],
  components: {
    editor
  },
  data () {
    return {
      diary: {
        id: null,
        title: null,
        content: null,
        classify: null, // 选中的分类的id
        labelList: [], // 当前文章被标上的标签
        source: 1,
        status: 0
      },
      editorOption: {
        placeholder: '请输入内容'
      },
      labelEdit: {
        labelName: null, // 输入的标签名
        labelStatus: false, // 按钮和select的状态
        labels: [] // 当前用户创建过的所有标签内
      },
      classifies: [], // 分类数组
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
  created () {
    let v = this

    // 获取所有的分类
    http.$axiosGet(classifyUrl + '/list.re', {childType: 1}).then(res => {
      v.classifies = res
    })
    v.loadAllLabels()
  },
  mounted () {
    let v = this
    if (!v.diaryOrder) {
      return
    }
    // 获取日记内容
    http.$axiosGet(diaryUrl + '/s/' + v.diaryOrder + '/diary.re').then(res => {
      v.diary = res
      v.diaryDate = res.date
      v.$refs.editor.initHtml(v.diary.content)
    })
  },
  computed: {
    // editor () {
    //   return this.$refs.quillEditor.quill
    // }
  },
  methods: {
    acceptHtml (html) {
      this.diary.content = html
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
      http.$axiosGet(labelUrl + '/frequently-used.re', {'type': 1}).then(res => {
        res = res === null ? [] : res
        let temp = []
        res.forEach(o => {
          temp.push({'name': o})
        })
        v.labelEdit.labels = temp
      })
    },
    handleSelect (item) {
      let v = this
      v.labelEdit.labelStatus = false
      v.labelEdit.labelName = null
    },
    addLabel (e) {
      let v = this
      if (util.strNotEmpty(v.labelEdit.labelName)) {
        let index = v.diary.labelList.findIndex(o => { return o.name === v.labelEdit.labelName })
        if (index > -1) {
          v.$message.warning('已经存在同名的标签')
          return
        }
        v.diary.labelList.push({'name': v.labelEdit.labelName, 'delflag': 1})
      }
      v.labelEdit.labelStatus = false
      v.labelEdit.labelName = null
    },
    /**
     * 移除标签，如果是新增加的标签则直接移除，如果是已有标签，则设置delflag 为 0
     */
    removeLabel (label) {
      if (label.id) {
        label.delflag = 0
      } else {
        let index = this.diary.labelList.findIndex(o => { return o.name === label.name })
        this.diary.labelList.splice(index, 1)
      }
    },
    saveDiary () {
      let v = this
      if (v.title && v.title.trim().length === 0) {
        v.$message.warning('请输入标题')
        return
      }
      // 获取标签id字符串
      let params = util.newNotNullObject(v.diary)
      params.date = dateFormat('yyyy-MM-dd', v.diaryDate)
      // params.labels = arrToStr(v.diary.labelList, 'id')
      http.$axiosPost(diaryUrl + '/addOrUpdate.do', params).then(res => {
        v.diary.id = res.id
        v.diary.labelList = util.validObjDef(res.labelList, [])
        v.$message.success('日记保存成功')
      }).catch(err => {
        console.log(err)
        if (err.message) { v.$message.error(err.message) }
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.back_ground {
  position:absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1400px;
  z-index: 999;
  background: rgb(140, 197, 255);
  padding-top: 10px;
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
  height: 850px;
  background: #ffffff;
  position: relative;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
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
