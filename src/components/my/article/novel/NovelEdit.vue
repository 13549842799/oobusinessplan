<template>
  <div class="divContiner child-Continer">
    <el-form ref="form" :model="novel" :rules="rules" label-position="left" label-width="100px" style="width: 600px;float: left" size="small">
      <el-form-item label="作品名称" prop="title">
        <el-input v-model="novel.title" placeholder="请选择一个有趣的名称吧"></el-input>
      </el-form-item>
      <el-form-item label="连载状态">
        <el-input :value="novel.stateName" readonly></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="classify">
        <el-select v-model="novel.classify" placeholder="请选择作品分类">
          <el-option v-for="c in classifies" :key="c.id" :label="c.name" :value="c.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作品简介" prop="content">
        <el-input type="textarea" v-model="novel.content" :rows="5" placeholder="用一段引人入胜的话语来描述你的作品吧!"></el-input>
      </el-form-item>
      <el-form-item label="作品标签">
        <el-form-item label="已选标签">
          <el-tag type="danger" effect="dark" size="mini" style="margin-right: 10px" disable-transitions @close="removeLabel(l.name)"
            v-for="(l, index) in novel.labelList" :key="index" v-show="l.delflag === 1" closable>{{l.name}}</el-tag>
        </el-form-item>
        <el-form-item label="新增标签" prop="label">
          <el-input v-model="labelEdit.labelName" placeholder="如果没有喜欢的标签，那就创建一个吧!" style="width:260px;"></el-input>
          <el-button type="text" @click="addLabel()">添加</el-button>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="常用标签">
          <el-tag class="usedLabel" type="danger" effect="dark" size="mini" style="margin-right: 10px" @click="addLabel(l)"
            v-for="(l, index) in labelEdit.labels" :key="index">{{l}}</el-tag>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div class="picture-item">
      <span style="display:block;width: 100%;text-align: center;border-bottom: 1px solid lightslategray;">封面图片</span>
      <el-upload
        style="margin: auto auto;"
        ref="cover"
        name="coverImage"
        :data="data"
        class="avatar-uploader"
        :headers="header"
        :action="action"
        :multiple="false"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="this.cover !== null || novel.coverPath" :src="coverPath" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <p style="color: red; font-size:13px;">上传图片大小请不要超过150KB，长宽比为124px*172px</p>
      <el-button @click="resetCover">重置</el-button>
    </div>
    <div style="width: 100%;margin-top: 500px;text-align: center;border-top: 1px solid #DCDFE6;">
      <!-- <div class="position" v-if="novel.id !== null">
        分卷管理
      </div> -->
      <div style="margin-top: 35px; text-align: center;width: 100%">
        <el-button @click="submitNovel" type="success">{{novel.id === null ? '提交' : '保存'}}</el-button>
        <el-button @click="goBack" type="warning">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {novelUrl, classifyUrl, labelUrl, upLoadUrl, fileUrl} from '@/base_variable'
import http from '@/http.js'

import util from '@/components/common/objUtil'

export default {
  props: ['novelOrder'], // 从路由中接受的小说id
  data () {
    var validateLabel = (rule, value, callback) => {
      if (this.validLabel()) {
        callback()
      } else {
        callback(new Error('不能重复添加'))
      }
    }
    return {
      header: {},
      data: {
        name: 'coverImage',
        relevance: 3
      },
      action: upLoadUrl + '/upload.do',
      novel: {
        id: null,
        title: '',
        content: '',
        delflag: 1,
        labelList: [],
        stateName: '未开始',
        cover: null // 存放将要提交的cover文件的id
      },
      cover: null, // 当前选择的封面图片对象
      classifies: [],
      labelEdit: {
        labelName: '', // 输入的标签名
        labelStatus: false, // 按钮和select的状态
        labels: [] // 当前用户创建过的所有标签内
      },
      rules: {
        title: [{ required: true, message: '请输入作品名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入作品简介', trigger: 'blur' }],
        classify: { required: true, message: '请选择作品分类', trigger: 'change' },
        label: [{ validator: validateLabel, trigger: 'blur' }]
      }
    }
  },
  created () {
    let v = this
    v.header = http.$getHeadersFromLocal() // 从http中获取本地存储的token值和user值
    // 获取所有的分类
    http.$axiosGet(classifyUrl + '/list.re', {childType: 1}).then(res => {
      v.classifies = res
    })
    http.$axiosGet(labelUrl + '/frequently-used.re', {type: 4}).then(res => {
      v.labelEdit.labels = res
    })
    if (v.novelOrder) {
      http.$axiosGet(novelUrl + '/s/' + v.novelOrder + '/novel.re').then(res => {
        v.novel = res
      }).catch(err => { console.log(err) })
    }
  },
  mounted () {

  },
  computed: {
    coverPath () { // 封面图片路径, 首先判断进入当前页面后是否有重新选择封面，然后判断是否存在初始的图片
      return fileUrl + (this.cover !== null ? this.cover.path : (util.strNotEmpty(this.novel.coverPath) ? this.novel.coverPath : ''))
    }
  },
  methods: {
    validLabel (name) {
      return !this.novel.labelList.some(l => { return l.name === (name === undefined ? this.labelEdit.labelName : name) }) // 已经选择的不能重复添加 并且不能添加空值
    },
    /**
     * 添加新的标签到已选列表中
     */
    addLabel (name) {
      let n = name === undefined ? this.labelEdit.labelName : name
      if (!this.validLabel(n) || n === null || n.trim() === '') {
        return
      }
      this.novel.labelList.push({'delflag': 1, 'name': n})
      if (name === undefined) {
        this.labelEdit.labelName = ''
      }
    },
    /**
     * 移除已经选择的标签
     */
    removeLabel (name) {
      let list = this.novel.labelList
      if (list === null || list.length === 0) {
        return
      }
      let index = list.findIndex(l => { return l.name === name })
      if (list[index].id) {
        list[index].delflag = 0
      } else {
        list.splice(index, 1)
      }
    },
    /**
     * 封面图片提交前触发事件方法
     * 校验图片的文件格式和大小是否符合要求
     */
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 < 50
      if (!isJPG) {
        this.$message.error('上传封面图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 50k!')
      }
      return isJPG && isLt2M
    },
    /**
     * 封面图片提交成功触发事件方法
     */
    handleAvatarSuccess (res, file) {
      switch (res.status) {
        case 200:
          let oldId = this.cover != null ? this.cover.id : (util.validObj(this.novel.coverFile) ? this.novel.coverFile.id : null)
          this.cover = res.data
          if (oldId != null) {
            http.$axiosDel(upLoadUrl + '/s/' + oldId + '/del.do').then(res => {}).catch(err => { console.log(err) })
          }
          break
      }
    },
    /**
     * 重置图片，把服务器中的临时图片也删除掉
     */
    resetCover () {
      let id = this.cover.id
      http.$axiosDel(upLoadUrl + '/s/' + id + '/del.do').then(res => {}).catch(err => { console.log(err) })
      this.cover = null
    },
    /**
     * 手动提交
     */
    submitNovel () {
      let v = this
      let novel = util.newNotNullObject(v.novel, [null], ['lastetSection', 'portions', 'coverFile', 'cover'])
      novel.cover = v.cover !== null ? v.cover.id : null
      http.$axiosPost(novelUrl + '/save2.do', novel).then(res => {
        v.novel.id = res.id
        v.novel.labelList = util.validObjDef(res.labelList, [])
        v.novel.coverFile = res.coverFile
        v.$message.success('保存成功')
      }).catch(err => { console.log(err) })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
.usedLabel:hover {
  cursor: pointer;
}

.picture-item {
  float: left;
  width:350px;
  margin-left:10px;
  display: flex;
  flex-direction: column;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 124px;
  height: 172px;
  line-height: 172px;
  text-align: center;
}
.avatar {
  width: 124px;
  height: 172px;
  display: block;
}

.position {
  border-bottom: 1px solid #DCDFE6;
  width: 100%;
  height: 50px;
  text-align: center;
  font-family: "微软雅黑";
  line-height: 50px;
}

.position:hover {
    cursor: pointer;
    color: dodgerblue;
}
</style>
