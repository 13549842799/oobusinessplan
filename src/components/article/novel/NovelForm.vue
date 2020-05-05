<template>
  <el-dialog :title="formTitle" :visible.sync="open" @open="openEvent" v-loading="loading">
    <div>
      <el-steps :active="active" simple>
        <el-step title="基础信息" icon="el-icon-edit"></el-step>
        <el-step title="分类" icon="el-icon-upload"></el-step>
        <el-step title="封面" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>
    <div style="margin-top: 20px;">
      <el-form :model="form" label-position="left">
        <div v-show="active === 1">
          <el-form-item label="作品名称" :label-width="formLabelWidth">
            <el-form-item>
              <el-input v-model="form.title" placeholder="请起个有趣的小说名吧"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="作品简介" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="5" v-model="form.content" placeholder="快来写下你的作品简介"></el-input>
          </el-form-item>
        </div>
        <div v-show="active === 2">
          <el-form-item label="分类" :label-width="formLabelWidth">
            <el-select filterable default-first-option
              v-model="form.classify" clearable placeholder="请选择作品分类">
              <el-option
              v-for="item in classifies"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作品标签" :label-width="formLabelWidth">
            <el-form-item label="已选标签">
              <el-tag type="danger" effect="dark" size="mini" style="margin-right: 10px"
                disable-transitions @close="removeLabel(l.name)"
                v-for="l in form.labelList" :key="l.name" v-show="l.delflag === 1" closable>
                {{l.name}}
              </el-tag>
            </el-form-item>
            <el-form-item label="新增标签" prop="label">
              <el-input v-model="labelEdit.labelName" placeholder="如果没有喜欢的标签，那就创建一个吧!" style="width:290px;"></el-input>
              <el-button type="text" @click="addLabel()">添加</el-button>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="常用标签">
              <el-tag class="usedLabel" type="danger" effect="dark" size="mini"
                style="margin-right: 10px" @click="addLabel(l)"
                v-for="(l, index) in labels" :key="index">
                {{l}}
              </el-tag>
            </el-form-item>
          </el-form-item>
        </div>
        <div v-show="active === 3" class="novel-cover">
          <el-form-item label="作品封面" :label-width="formLabelWidth">
            <el-col :span="11">
                <el-upload
            style="margin: auto auto;"
            ref="cover"
            name="coverImage"
            :data="file.data"
            class="avatar-uploader"
            :headers="file.header"
            :action="file.action"
            :multiple="false"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
              <img v-if="file.cover !== null || form.cover" :src="coverPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </el-col>
            <el-col :span="11">
            <p style="color: red; font-size:13px;">上传图片大小请不要超过150KB，长宽比为124px*172px</p>
            </el-col>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="text-align: center;">
      <el-button-group>
        <el-button @click="active = active - 1" v-show="active !== 1" type="primary" icon="el-icon-arrow-left" size="small">上一步</el-button>
        <el-button @click="active = active + 1" v-show="active !== 3" type="primary" size="small">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submitNovel">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import util from '@/components/common/objUtil'
import dialogSupport from '@/components/common/form/DialogTableSupport'

import novelApi from '@/components/article/novel/novelApi'
import uploadApi from '@/components/upload/uploadApi'

export default {
  name: 'novelForm',
  mixins: [dialogSupport],
  props: {
    classifies: {
      type: Array,
      default: () => { return [] }
    },
    labels: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      form: blankNovel(),
      formLabelWidth: '80px',
      loading: false,
      labelEdit: {
        labelName: ''
      },
      active: 1,
      file: {
        header: {},
        data: {
          name: 'coverImage',
          relevance: 3
        },
        action: uploadApi.uploadUrl(),
        cover: null // 当前选择的封面图片对象
      }
    }
  },
  created () {
    let v = this
    v.file.header = uploadApi.getHeader() // 从http中获取本地存储的token值和user值
  },
  computed: {
    formTitle () {
      return this.form.id === null ? '创建新的小说' : '修改小说信息'
    },
    coverPath () { // 封面图片路径, 首先判断进入当前页面后是否有重新选择封面，然后判断是否存在初始的图片
      // return uploadApi.fileUrl() + (this.file.cover !== null ? this.file.cover.path : (util.strNotEmpty(this.form.coverPath) ? this.form.coverPath : ''))
      let o = this.file.cover !== null ? this.file.cover.id : this.form.cover
      if (o) {
        return uploadApi.getFile(o)
      }
      return ''
    }
  },
  methods: {
    openEvent () {
    },
    openForm (id) {
      let v = this
      if (id) {
        v.loading = true
        novelApi.getNovel(id, {complete: () => { v.loading = false }}).then(res => {
          v.form = res
        }).catch(err => { console.log(err) })
      } else {
        v.form = blankNovel()
      }
      v.open = true
      v.active = 1
    },
    addLabel (e) {
      let v = this
      let n = typeof e === 'string' ? e : v.labelEdit.labelName
      if (util.strNotEmpty(n)) {
        let index = v.form.labelList.findIndex(o => { return o.name === n })
        if (index > -1) {
          v.$message.warning('已经存在同名的标签')
          return
        }
        v.form.labelList.push({'name': n, 'delflag': 1})
      }
      v.labelEdit.labelName = null
    },
    removeLabel (name) {
      let list = this.form.labelList
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
          let oldId = this.file.cover != null ? this.file.cover.id : (util.validObj(this.form.cover) ? this.form.cover : null)
          this.file.cover = res.data
          if (util.strNotEmpty(oldId)) {
            uploadApi.deleteFile(oldId).then(res => {}).catch(err => { console.log(err) })
          }
          break
      }
    },
    /**
     * 重置图片，把服务器中的临时图片也删除掉
     */
    resetCover () {
      let id = this.file.cover.id
      uploadApi.deleteFile(id).then(res => {}).catch(err => { console.log(err) })
      this.cover = null
    },
    submitNovel () {
      let v = this
      const loading = this.$loading({
        lock: true,
        text: '拼死保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let novel = util.newNotNullObject(v.form, [null], ['lastetSection', 'portions'])
      novel.cover = v.file.cover !== null ? v.file.cover.id : null
      novelApi.saveNovel(novel, {complete: () => { loading.close() }}).then(res => {
        v.submitSuccess()
      }).catch(err => { v.$message.warning(err.data.message) })
    }
  }
}

function blankNovel () {
  return {
    id: null,
    title: '',
    content: '',
    labelList: [],
    classify: null,
    cover: '',
    source: 1,
    coverPath: null
  }
}
</script>

<style>
.usedLabel:hover {
  cursor: pointer;
}

.novel-cover .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.novel-cover .el-upload:hover {
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
</style>
