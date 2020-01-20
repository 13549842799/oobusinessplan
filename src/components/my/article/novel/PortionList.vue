<template>
  <div class="divContiner child-Continer">
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
            <div v-for="s in p.sections" :key="s.id" class="portion-content-sections-one"></div>
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
    <div v-show="pageType === 2" class="portion-section">
      <p>分卷：{{section.portionTitle}}</p>
      <el-form :model="section" label-position="left">
        <el-form-item >
          <el-input v-model="section.title" placeholder="快起一个有趣的标题吧!"></el-input>
        </el-form-item>
        <el-input type="textarea" v-model="section.content" :rows="30" placeholder="来开始你新的故事!" style="margin-top: 10px;margin-bottom: 2px;"></el-input>
        <el-form-item label="备注" label-width="50px" size="mini">
          <el-input v-model="section.remark" class="remak"></el-input>
        </el-form-item>
      </el-form>
      <div class="section-image-group">
        <div style="width: 100%; height: 10px;" v-for="(f, index) in fileList" :key="index">
          <span style="font-size: 10px;">{{f.name}}</span>
          <el-button type="text" style="color: red">删除</el-button>
        </div>
      </div>
      <!-- <el-divider></el-divider> -->
      <!-- <p v-show="section.remark" style="color: red">{{section.remark}}</p> -->
      <div class="buttons-group">
        <el-button @click="saveSection">保存</el-button>
        <el-button @click="saveSection">插入图片</el-button>
        <el-button @click="pageType = 1">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {novelUrl, portionUrl} from '@/base_variable'
import http from '@/http.js'
import util from '@/components/common/objUtil'

var lastActiveNames = [] // 上一次激活的分卷记号

export default {
  props: ['novelOrder', 'novelTitle'],
  data () {
    return {
      pageType: 1, // 页面内容类型 1-分卷 2-新增章节
      dialogLoading: false, // 对话框加载动画开关
      dialogFormVisible: false, // 新建编辑分卷对话框显示开关
      formLabelWidth: '120px',
      index: -1, // 当前编辑的分卷的数组下标
      portion: {},
      portions: [],
      activeNames: [], // 激活的分卷记号
      rules: {
        title: [
          { required: true, message: '请输入分卷名称', trigger: 'blur' }
        ]
      },
      section: {}, // 当前操作的章节对象
      fileList: [] // 图片列表
    }
  },
  created () {
    let v = this
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
            v.portions[act.name] = res[0]
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
      this.pageType = 2
    },
    saveSection () {
      
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
