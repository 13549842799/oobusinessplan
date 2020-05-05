<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="100px">
        <div style="height:30px"> <!-- 页头 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'articleNovel' }" replace>脑洞小说</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'novelPortions' }" replace>分卷管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'portionSection' }" replace>章节编辑</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <p>作品名：{{novel.title}}</p>
        <p>分卷：{{portion.title}}</p>
      </el-header>
      <el-main>
        <el-form :model="form" label-position="left" ref="sectionForm" :role="rules">
          <el-form-item prop="title">
            <el-input v-model="form.title" placeholder="快起一个有趣的标题吧!"></el-input>
          </el-form-item>
          <div style="width: 100%; height: 20px;position: relative;  color: darkgray">
            <span style="position:absolute; right: 25px; bottom: 5px">{{sNums}}字/20000字</span>
            <span class="el-icon-refresh-left" style="position:absolute; right: 0; bottom: 5px" @click="culSectionNums"></span>
          </div>
          <el-input type="textarea" v-model="form.content" :rows="30" placeholder="来开始你新的故事!" style="margin-bottom: 2px;"></el-input>
          <el-form-item label="备注" label-width="50px" size="mini">
            <el-input v-model="form.remark" class="remak"></el-input>
          </el-form-item>
      </el-form>
      <div class="section-image-group">
        <div style="width: 100%; height: 10px;" v-for="(f, index) in form.files" :key="index">
          <el-popover placement="top-start" width="200" trigger="hover">
            <img :src="imgUrl(f.id)" class="avatar">
            <el-button slot="reference" type="text">{{f.name}}</el-button>
          </el-popover>
          <el-button type="text" style="color: red" @click="delImage(index)">删除</el-button>
        </div>
      </div>
      </el-main>
      <el-footer>
        <div class="buttons-group">
          <el-button size="small" type="primary" @click="submitForm">保存</el-button>
          <el-button size="small" type="success" @click="openImageDialog" v-if="form.id">插入图片</el-button>
          <el-button size="small" @click="goBack">返回</el-button>
        </div>
      </el-footer>
    </el-container>
    <!-- 图片组件 -->
     <el-dialog title="插入图片" :visible.sync="img.open" width="400px">
      <div class="section-img" style="width: 50%;float: left;height: 200px;">
        <el-upload
          ref="upload"
          style="margin: auto auto"
          class="avatar-uploader"
          :name="img.file.name"
          :action="img.action"
          :headers="img.headers"
          :data="img.data"
          :multiple="false"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="fileChange"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="img.file.url" :src="img.file.url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div style="width: 50%;float: left;height: 200px;">
        <p style="color: red;font-size: 14px;">上传图片大小请不要超过150KB，长宽比最好为124px*172px</p>
        <span style="color: red;font-size: 14px;">{{img.file.error}}</span>
        <template v-if="img.file.url">
          <el-input v-model="img.file.name" placeholder="请编辑图片的名称"></el-input>
          <el-button type="text" @click="submitImage">上传图片</el-button>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="img.open = false">取 消</el-button>
        <el-button type="primary" @click="submitImage(1)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/components/common/objUtil'
import basicMethod from '@/components/common/table/basicMethod'

import portionApi from '@/components/article/novel/portion/portionApi'
import sectionApi from '@/components/article/novel/section/sectionApi'
import uploadApi from '@/components/upload/uploadApi'

export default {
  props: ['id', 'portionOrder'],
  mixins: [basicMethod],
  data () {
    return {
      form: blankSection({}),
      novel: {
        id: null,
        title: ''
      },
      portion: {
        id: null,
        title: ''
      },
      rules: {
        title: [
          { required: true, message: '不要忘了章节名哦', trigger: 'blur' }
        ]
      },
      sNums: 0, // 当前章节的去除特殊符号后的字数
      img: {
        open: false,
        action: uploadApi.uploadUrl(),
        headers: {},
        data: {'name': '', 'relevance': 4, 'objId': null},
        file: {
          url: '',
          name: '',
          error: '' // 错误提示
        },
        delIds: []
      }
    }
  },
  created () {
    let v = this
    v.img.headers = uploadApi.getHeader()
    if (v.id) {
      sectionApi.getSection(v.id).then(res => {
        v.form = util.newNotNullObject(res, [], ['portion', 'novel'])
        v.portion = res.portion
        v.novel = res.novel
        v.sNums = v.form.wordsNum
      }).catch(err => { console.log(err) })
    } else {
      portionApi.getPortion(v.portionOrder).then(res => {
        v.portion = res
        v.novel = res.novel
        v.form = blankSection({novelId: v.novel.id, portionId: v.portion.id})
      }).catch(err => { console.log(err) })
    }
  },
  computed: {
  },
  methods: {
    /**
     * 获取章节正确的字数
     */
    culSectionNums () {
      this.sNums = this.form.content.replace(/\n|\r|\s/g, '').length
    },
    submitForm () {
      let v = this
      if (!v.form.title) {
        v.$refs.sectionForm.validateField('title')
        return
      }
      let sec = util.newNotNullObject(v.form, [null, ''], ['files'])
      sec.delImagesId = v.img.delIds.join(',')
      let loading = v.simpleLoad('全力保存中')
      sectionApi.saveSection(sec, { 'complete': () => { loading.close() } }).then(res => {
        v.$message.success('保存成功')
        if (!sec.id) {
          v.form = res
        }
      }).catch(err => { v.$message.error(err.data.message) })
    },
    openImageDialog () {
      this.img.fiile = {url: '', name: '', error: ''}
      this.img.open = true
    },
    /**
     * 文件状态修改触发事件，通过此方法可以在文件未上传时获取到临时的图片路径，实现预览功能
     */
    fileChange (file, fileList) {
      switch (file.status) {
        case 'ready':
          const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
          const isLt2M = file.raw.size / 1024 < 150
          if (!isJPG) {
            this.img.file.error = '上传附件图片只能是 JPG/PNG 格式!'
            return
          }
          if (!isLt2M) {
            this.img.file.error = '上传附件图片大小不能超过 150k!'
            return
          }
          this.img.file.error = ''
          this.img.file.name = ''
          this.img.file.url = URL.createObjectURL(file.raw)
          break
        default:
          break
      }
    },
    beforeAvatarUpload (file) {
    },
    /**
     * 成功上传图片触发事件
     */
    handleAvatarSuccess (res, file) {
      switch (res.status) {
        case 200:
          if (!this.form.files) {
            this.form.files = []
          }
          this.form.files.push(res.data)
          this.$message.success('图片上传成功')
          break
        case 100:
          this.$message.error(res.message)
          break
      }
      this.img.file = {name: '', url: '', error: ''} // 重新初始化图片设置
    },
    /**
     * 上传图片的方法，只有已经保存过的章节才能使用上传图片的功能，所以此时已有章节id了
     */
    submitImage (close) {
      if (!this.img.file.name) {
        this.img.file.error = '请输入图片的名称'
        return
      }
      this.img.data.name = this.img.file.name
      this.img.data.objId = this.form.id
      this.$refs.upload.submit()
      if (close) {
        this.img.open = false
      }
    },
    delImage (index) {
      this.img.delIds.push(this.form.files[index].id)
      this.form.files.splice(index, 1)
    },
    imgUrl (id) {
      return uploadApi.getFile(id)
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}

function blankSection ({novelId, portionId}) {
  return {
    id: null,
    novelId,
    portionId,
    title: '',
    content: '',
    remark: '',
    files: []
  }
}
</script>

<style scoped>
.buttons-group {
  width: 100%;
  height: 20px;
  text-align: center;
  margin-top: 10px;
}
.portion-section .remark input {
  color: red;
}

.section-image-group {
  width: 100%;
  height: 50px;
  overflow: auto;
}

.section-img .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.section-img .el-upload:hover {
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
