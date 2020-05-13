<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="100px">
        <div style="height:50px">
          <el-page-header @back="goBack" :content="pageTitle"></el-page-header>
        </div>
        <div>
          <el-input placeholder="请输入标题" v-model="diary.title" clearable>
          </el-input>
        </div>
      </el-header>
      <el-main>
        <editor ref="editor" :html="acceptHtml" style="margin-bottom: 15px;"></editor>
        <el-date-picker v-model="diary.date" align="right" type="date" placeholder="选择日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <div style="width: 100%; margin-top:10px">
          <el-input style="width: 220px" placeholder="请输入创建的标签名" v-model="labelEdit.labelName" clearable></el-input>
          <el-button type="text" size="mini" @click="addLabel" style="margin-right: 20px">添加</el-button>
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
        <div>
          <el-select v-model="diary.classify" filterable placeholder="请选择分类">
            <el-option
              v-for="item in classifies"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-main>
      <el-footer>
        <div style="width: 100%; margin-top:10px">
          <el-radio-group v-model="diary.status" size="small">
            <el-radio :label="0" border>草稿</el-radio>
            <el-radio :label="1" border>私密</el-radio>
            <el-radio :label="2" border>发布</el-radio>
          </el-radio-group>
          <el-button style="margin-left: 50px;" type="primary" plain @click="saveDiary" size="small">保存日记</el-button>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import util from '@/components/common/objUtil'
import {dateFormat} from '@/components/common/commonUtil'

import diaryApi from '@/components/article/diary/diaryApi'
import classifyApi from '@/components/article/classify/classifyApi'
import labelApi from '@/components/article/label/labelApi'

import editor from '@/components/common/form/MyEditor'

export default {
  props: ['diaryOrder'],
  components: {
    editor
  },
  data () {
    return {
      diary: blankDiary(),
      pickerOptions: {
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
      labelEdit: {
        labelName: null, // 输入的标签名
        labels: [] // 默认提供的常用标签
      },
      classifies: [] // 分类数组
    }
  },
  created () {
    let v = this
    labelApi.frequentlyUsedList(1).then(res => {
      v.labelEdit.labels = res === null ? [] : res
    }).catch(err => { console.log(err) })
    classifyApi.simpleList({childType: 1}).then(res => {
      v.classifies = res
    }).catch(err => { console.log(err) })
  },
  mounted () {
    let v = this
    if (!v.diaryOrder) {
      return
    }
    diaryApi.getDiary(v.diaryOrder).then(res => {
      v.diary = res
      v.$refs.editor.initHtml(v.diary.content)
    }).catch(err => { console.log(err) })
  },
  computed: {
    pageTitle () {
      return this.diary.id !== null ? '编辑日记' : '新建日记'
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    acceptHtml (html) {
      this.diary.content = html
    },
    addLabel (e) {
      let v = this
      let n = typeof e === 'string' ? e : v.labelEdit.labelName
      if (util.strNotEmpty(n)) {
        let index = v.diary.labelList.findIndex(o => { return o.name === n })
        if (index > -1) {
          v.$message.warning('已经存在同名的标签')
          return
        }
        v.diary.labelList.push({'name': n, 'delflag': 1})
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
        let index = this.diary.labelList.findIndex(o => { return o.name === label.name })
        this.diary.labelList.splice(index, 1)
      }
    },
    querySearch (queryString, cb) {
      let restaurants = this.labelEdit.labels
      let results = queryString ? restaurants.filter(createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
      console.log('查询')
    },
    saveDiary () {
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
      let params = util.newNotNullObject(v.diary)
      diaryApi.saveDiary(params, {complete: () => { loading.close() }}).then(res => {
        v.diary.id = res.id
        v.diary.labelList = util.validObjDef(res.labelList, [])
        v.$message.success('日记保存成功')
      }).catch(err => { err.data && err.data.message && v.$message.warning(err.data.message) })
    }
  }
}

function blankDiary () {
  return {
    id: null,
    title: null,
    content: null,
    classify: null, // 选中的分类的id
    labelList: [], // 当前文章被标上的标签
    source: 1,
    status: 0,
    date: dateFormat('yyyy-MM-dd', new Date())
  }
}

function createFilter (queryString) {
  return (restaurant) => {
    return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
  }
}
</script>

<style>
</style>
