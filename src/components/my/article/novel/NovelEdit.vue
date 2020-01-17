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
        ref="cover"
        name="coverImage"
        class="avatar-uploader"
        :headers="header"
        :data="data"
        :action="action"
        :multiple="false"
        :show-file-list="false"
        :auto-upload="false"
        :file-list="fileList"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="novel.cover" :src="novel.cover" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div>
      <el-button @click="submitNovelAndCover">提交</el-button>
      <el-button @click="show">show</el-button>
    </div>
  </div>
</template>

<script>
import {novelUrl, classifyUrl, labelUrl} from '@/base_variable'
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
      data: {},
      action: novelUrl + '/save2.do',
      fileList: [],
      novel: {
        id: null,
        title: '',
        content: '',
        delflag: 1,
        labelList: [],
        stateName: '未开始',
        cover: null
      },
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
    handleAvatarSuccess (res, file) {
      
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 < 50
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 50k!')
      }
      this.header = util.newObj(http.headers)
      this.data = util.newObj(this.novel)
      return isJPG && isLt2M
    },
    /**
     * 手动提交
     */
    submitNovelAndCover () {
      this.$refs.cover.submit()
    },
    show() {
      console.log(this.fileList)
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
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
</style>
