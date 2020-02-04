<template>
  <div class="divContiner child-Continer" v-loading="sectionLoading" element-loading-text="章节保存中">
    <div class="portion-head">
      <el-button @click="goBack" type="primary" circle size="mini" class="el-icon-back goback-button"></el-button>
      <h3>作品名：{{novelTitle}}</h3>
    </div>
    <div class="portion-content" v-show="pageType === 1">
      <div style="width: 100%; height: 50px; text-align: center;">
        <el-button type="text" @click="openAddNewPortionDiog">创建新一卷</el-button>
      </div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item v-for="(p, index) in portions" :key="index" :name="index">
          <template slot="title">
            <div style="width: 100%;position: relative;">
              <span class="portion-content-title">{{p.title}}·共&nbsp;{{p.sectionNum}}&nbsp;章</span>
              <el-tag style="margin-left: 10px;margin-right: 10px;" :type="p.type === 0 ? 'warning' : 'success'" effect="dark" size="mini">{{p.type === 0 ? '提要' : '正文'}}</el-tag>
              <span style="font-size:13px;position: absolute; bottom: 0;color: #666">本卷共&nbsp;{{p.wordsNum}}&nbsp;字</span>
            </div>
          </template>
          <div class="portion-content-sections">
            <div v-for="(s, sindex) in p.sections" :key="s.id" class="portion-content-sections-one">
                <span @click="editSection(sindex, index)">{{s.title}}</span>
                <el-button type="text" @click="delSection(sindex, index)">删除</el-button>
            </div>
          </div>
          <div class="portion-content-buttons">
            <el-button type="text" v-if="p.type === 1" @click="openEditPortionDiog(index)">编辑分卷</el-button>
            <el-button type="text" @click="addNewSection(index)">新建一章</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- =================== 分卷新增编辑对话框 =================== -->
    <el-dialog :title="portion.id === undefined ? '新建分卷' : '编辑分卷'" :visible.sync="dialogFormVisible" >
      <el-form :model="portion" :rules="rules" v-loading="dialogLoading" element-loading-text="奔走提交中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form-item label="分卷名称" :label-width="formLabelWidth" prop="title">
          <el-input v-model="portion.title"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" placeholder="请简单的介绍一下本分卷的内容吧" v-model="portion.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPortion">确 定</el-button>
      </div>
    </el-dialog>
    <!-- =================== 分卷新增编辑对话框 end =================== -->
    <!-- ============== 章节编辑部分 ====================== -->
    <div v-show="pageType === 2" class="portion-section">
      <p>分卷：{{section.portionTitle}}</p>
      <el-form :model="section" label-position="left" ref="sectionForm" :role="rules2">
        <el-form-item prop="title">
          <el-input v-model="section.title" placeholder="快起一个有趣的标题吧!"></el-input>
        </el-form-item>
        <div style="width: 100%; height: 20px;position: relative;  color: darkgray">
          <span style="position:absolute; right: 25px; bottom: 5px">{{sNums}}字/20000字</span>
          <span class="el-icon-refresh-left" style="position:absolute; right: 0; bottom: 5px" @click="culSectionNums"></span>
        </div>
        <el-input type="textarea" v-model="section.content" :rows="30" placeholder="来开始你新的故事!" style="margin-bottom: 2px;"></el-input>
        <el-form-item label="备注" label-width="50px" size="mini">
          <el-input v-model="section.remark" class="remak"></el-input>
        </el-form-item>
      </el-form>
      <div class="section-image-group">
        <div style="width: 100%; height: 10px;" v-for="(f, index) in section.files" :key="index">
          <el-popover placement="top-start" width="200" trigger="hover">
            <img :src="furl + f.path" class="avatar">
            <el-button slot="reference" type="text">{{f.name}}</el-button>
          </el-popover>
          <!-- <span style="font-size: 10px;">{{f.name}}</span> -->
          <el-button type="text" style="color: red" @click="delImage(index)">删除</el-button>
        </div>
      </div>
      <!-- <el-divider></el-divider> -->
      <!-- <p v-show="section.remark" style="color: red">{{section.remark}}</p> -->
      <div class="buttons-group">
        <el-button @click="saveSection">保存</el-button>
        <el-button @click="openImageDialog" v-if="section.id">插入图片</el-button>
        <el-button @click="pageType = 1">取消</el-button>
      </div>
    </div>
    <el-dialog title="插入图片" :visible.sync="imageDialog" width="20%">
      <div style="width: 50%;float: left;height: 200px;">
        <el-upload
          ref="upload"
          style="margin: auto auto"
          class="avatar-uploader"
          :name="tempFile.name"
          :action="action"
          :headers="headers"
          :data="data"
          :multiple="false"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="fileChange"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="tempFile.url" :src="tempFile.url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div style="width: 50%;float: left;height: 200px;">
        <p style="color: red;font-size: 14px;">上传图片大小请不要超过150KB，长宽比最好为124px*172px</p>
        <span style="color: red;font-size: 14px;">{{tempFile.error}}</span>
        <template v-if="tempFile.url">
          <el-input v-model="tempFile.name" placeholder="请编辑图片的名称"></el-input>
          <el-button type="text" @click="submitImage">上传图片</el-button>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="imageDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitImage(1)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {portionUrl, upLoadUrl, sectionUrl, fileUrl} from '@/base_variable'
import http from '@/http.js'
import util from '@/components/common/objUtil'

var lastActiveNames = [] // 上一次激活的分卷记号
const portionPage = 1 // 分卷页面
const sectionPage = 2// 章节页面

export default {
  props: ['novelOrder', 'novelTitle'],
  data () {
    return {
      furl: fileUrl,
      action: upLoadUrl + '/upload.do',
      headers: {},
      data: {'name': '', 'relevance': 4, 'objId': null},
      pageType: portionPage, // 页面内容类型 1-分卷 2-新增章节
      dialogLoading: false, // 对话框加载动画开关
      dialogFormVisible: false, // 新建编辑分卷对话框显示开关
      sectionLoading: false, // 章节提交时加载动画开关
      imageDialog: false, // 插入图片对话框显示开关
      formLabelWidth: '120px',
      portion: {}, // 当新建分卷或创建分卷时使用的变量
      portions: [], // 分卷列表
      activeNames: [], // 激活的分卷记号
      rules: {
        title: [
          { required: true, message: '请输入分卷名称', trigger: 'blur' }
        ]
      },
      rules2: {
        title: [
          { required: true, message: '不要忘了章节名哦', trigger: 'blur' }
        ]
      },
      section: {
        id: null,
        content: '',
        title: '',
        remark: '',
        lists: []
      }, // 当前操作的章节对象
      sNums: 0, // 当前章节的去除特殊符号后的字数
      fileDelIds: [],
      tempFile: {
        url: '',
        name: '',
        error: '' // 错误提示
      } // 临时图片
    }
  },
  created () {
    let v = this
    v.headers = http.$getHeadersFromLocal() // 从http中获取本地存储的token值和user值
    // 初始化变量, 不在data中定义的变量会一直保留，所以每次进入的时候都要初始化
    lastActiveNames = []

    http.$axiosGet(portionUrl + '/s/' + v.novelOrder + '/list.re').then(res => {
      v.portions = res
    }).catch(err => { v.$message.error(err) })
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    handleChange (val) {
      let act = currentActive(val, lastActiveNames)
      if (act.type === 1) {
        let v = this
        http.$axiosGet(portionUrl + '/s/' + v.novelOrder + '/list.re', {'portion': v.portions[act.name].id}).then(res => {
          if (res && res.length === 1) {
            v.portions[act.name].sections = res[0].sections
            v.portions[act.name].wordsNum = res[0].wordsNum
            v.portions[act.name].sectionNum = res[0].sectionNum
          } else {
            v.$message.error('存在错误')
          }
        }).catch(err => { v.$message.error(err) })
      }
      lastActiveNames = val
    },
    /**
     * 打开新建分卷的对话框
     */
    openAddNewPortionDiog () {
      this.portion = {'title': '', 'content': '', 'novelId': this.novelOrder, 'type': 1}
      this.dialogFormVisible = true
    },
    /**
     * 打开编辑分卷的对话框
     */
    openEditPortionDiog (index) {
      this.portion = util.newNotNullObject(this.portions[index], [null], ['sections', 'wordsNum', 'sectionNum'])
      this.dialogFormVisible = true
    },
    /**
     *
     */
    submitPortion () {
      let v = this
      v.dialogLoading = true
      http.$axiosPost(portionUrl + '/add.do', v.portion, {'complete': () => { v.dialogLoading = false }}).then(res => {
        let mess = null
        if (v.portion.id) {
          let p = v.portions.find(o => { return o.id === v.portion.id })
          p.title = v.portion.title
          p.content = v.portion.content
          mess = '分卷修改成功'
        } else {
          v.portions.push(res)
          mess = '分卷创建成功'
        }
        v.dialogFormVisible = false
        v.$message.success(mess)
      }).catch(err => { console.log(err) })
    },
    /**
     * 返回到小说列表页面
     */
    goBack () {
      this.$router.go(-1)
    },
    addNewSection (index) {
      this.section = {'portionTitle': this.portions[index].title, 'portionId': this.portions[index].id, 'novelId': this.novelOrder, 'title': '', 'content': ''}
      this.pageType = sectionPage
      this.sNums = 0
    },
    editSection (sindex, index) {
      let v = this
      v.section = {}
      http.$axiosGet(sectionUrl + '/s/' + v.portions[index].sections[sindex].id + '/read.re').then(res => {
        res.portionTitle = v.portions[index].title
        v.section = res
        v.sNums = v.section.wordsNum
      }).catch(err => { v.$message.error(err.message) })
      this.pageType = sectionPage
    },
    /**
     * 获取章节正确的字数
     */
    culSectionNums () {
      this.sNums = this.section.content.replace(/\n|\r|\s/g, '').length
    },
    beforeAvatarUpload (file) {
    },
    openImageDialog () {
      this.tempFile.name = ''
      this.tempFile.url = ''
      this.tempFile.error = ''
      this.imageDialog = true
    },
    /**
     * 成功上传图片触发事件
     */
    handleAvatarSuccess (res, file) {
      switch (res.status) {
        case 200:
          this.section.files.push(res.data)
          this.$message.success('图片上传成功')
          break
        case 100:
          this.$message.error(res.message)
          break
      }
      this.tempFile = {name: '', url: '', error: ''} // 重新初始化图片设置
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
            this.tempFile.error = '上传附件图片只能是 JPG/PNG 格式!'
            return
          }
          if (!isLt2M) {
            this.tempFile.error = '上传附件图片大小不能超过 150k!'
            return
          }
          this.tempFile.error = ''
          this.tempFile.name = ''
          this.tempFile.url = URL.createObjectURL(file.raw)
          break
        default:
          break
      }
    },
    /**
     * 上传图片的方法，只有已经保存过的章节才能使用上传图片的功能，所以此时已有章节id了
     */
    submitImage (close) {
      if (!this.tempFile.name) {
        this.tempFile.error = '请输入图片的名称'
        return
      }
      this.data.name = this.tempFile.name
      this.data.objId = this.section.id
      this.$refs.upload.submit()
      if (close) {
        this.imageDialog = false
      }
    },
    delImage (index) {
      this.fileDelIds.push(this.section.files[index].id)
      this.section.files.splice(index, 1)
    },
    /**
     * 保存章节
     */
    saveSection () {
      let v = this
      if (!v.section.title) {
        v.$refs.sectionForm.validateField('title')
        return
      }
      let sec = util.newNotNullObject(v.section, [null, ''], ['files'])
      sec.delImagesId = v.fileDelIds.join(',')
      v.sectionLoading = true
      http.$axiosPost(sectionUrl + '/addOrUpdate2.do', sec, { 'complete': () => { v.sectionLoading = false } }).then(res => {
        v.$message.success('保存成功')
        if (!sec.id) {
          v.portions.find(p => { return p.id === res.portionId }).sections.push(res)
          v.section = res
        }
      }).catch(err => { v.$message.error(err.message) })
    },
    /**
     * 删除章节
     */
    delSection (sectionIndex, portionIndex) {
      let v = this
      let s = v.portions[portionIndex].sections
      v.$confirm('确认删除本章：' + s[sectionIndex].title + ' 吗', '提示', {'confirmButtonText': '确定', 'cancelButtonText': '取消', 'type': 'warning'}).then(() => {
        console.log(s[sectionIndex])
        http.$axiosDel(sectionUrl + '/s/' + s[sectionIndex].id + '/delete.do').then(res => {
          v.$message.success('删除成功!')
          s.splice(sectionIndex, 1)
        }).catch(err => { v.$message.error(err.message) })
      })
    }
  }
}

/**
 * cur: 当前的分卷记号数组
 * last：上一次的分卷记号数组
 * 结果返回当前操作的类型 type： 0-收起 1-展开，操作的对象标记 name
 * 逻辑： 因为分卷的标记的类型是数字，这样方便了我们的计算，当前操作的数组和上一个操作的数组中相差的那个数字
 *       无疑就是当前操作的组件的标记，所以我们只要计算出两个数组各自的合计值的差就可以得知结果。
 */
function currentActive (cur, last) {
  let actType = cur.length > last.length // 如果当前数组的长度大于上一次操作数组的长度则表示展开，否则表示收起
  let a = cur.length === 0 ? 0 : cur.reduce((total, num) => { return total + num })
  let b = last.length === 0 ? 0 : last.reduce((total, num) => { return total + num })
  return {'type': actType ? 1 : 0, 'name': actType ? a - b : b - a}
}
</script>

<style>
.portion-head {
  width: 100%;
  height: 30px;
  position: relative;
}

.portion-head h3 {
  text-align: center;
  border-bottom: 1px solid #DCDFE6;
}

.portion-head .goback-button {
  position: absolute;
  top: -10px;
  left: 10px;
}

.portion-content {
  width: 100%;
}

.portion-content-title {
  font-weight: bold;
  font-size: 16px;
  font-family: "Helvetica Neue";
}

.portion-content-sections {
  width: 100%;
}

.portion-content-sections-one {
  width: 33%;
  height: 50px;
  display: inline-block;
}

.portion-content-buttons {
  width: 100%;
  height: 30px;
}

.portion-section {
  width: 100%
}

.portion-section p {
  text-align: center;
  font-weight: 800;
  color: #C7C7CD;
}

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
</style>
