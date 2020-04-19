<template>
  <el-dialog :title="formTitle" :visible.sync="formVisible">
    <div>
      <el-form :model="form" label-position="left">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.name" placeholder="资源名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.displayName" placeholder="资源真名"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="所属权限" :label-width="formLabelWidth">
          <el-select v-model="form.authId" filterable placeholder="请选择" style="width: 527px">
              <el-option
                v-for="item in auths"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span style="float: left">{{ item.displayName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-col :span="9">
            <el-select v-model="form.type" placeholder="请选择资源类型" style="width: 180px">
              <el-option label="一级菜单" :value="1"></el-option>
              <el-option label="二级菜单" :value="2"></el-option>
              <el-option label="接口" :value="3"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;</el-col>
          <el-col :span="13"></el-col>
        </el-form-item>
        <el-form-item label="上级菜单" :label-width="formLabelWidth" v-show="form.type === 2">
          <el-select v-model="form.type" placeholder="请选择一级菜单" style="width: 285px">
            <el-option label="一级菜单" :value="1"></el-option>
            <el-option label="二级菜单" :value="2"></el-option>
            <el-option label="接口" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否带参" :label-width="formLabelWidth" v-show="form.type === 3">
          <el-radio-group v-model="form.resource">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请求路径" :label-width="formLabelWidth">
          <el-input v-model="form.path" autocomplete="off" placeholder="请选择请求路径"></el-input>
        </el-form-item>
        <el-form-item label="资源描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.describes" placeholder="请描述资源的内容"></el-input>
        </el-form-item>
      </el-form>
    </div>
  <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import util from '@/components/common/objUtil'

import resourcesApi from '@/components/system/resources/resourcesApi'

export default {
  name: 'resourceForm',
  props: {
    auths: {
      type: Array,
      default: () => {
        return []
      }
    },
    submitSuccess: {
      type: Function,
      default: () => {}
    },
    submitFail: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      form: blankForm(),
      formType: 1, // 表单类型 1-新增 2-修改
      formVisible: false, // 表单显示和隐藏的开关
      formLabelWidth: '80px'
    }
  },
  created () {
  },
  computed: {
    formTitle () {
      switch (this.formType) {
        case 1: return '新增资源'
        case 2: return '修改资源'
        default: return ''
      }
    }
  },
  methods: {
    initAddForm () {
      let v = this
      v.form = blankForm()
      v.formType = 1
      v.formVisible = true
    },
    /**
     * 显示修改表单
     */
    initEditForm (form) {
      let v = this
      v.form = util.newObj(form)
      v.formType = 2
      v.formVisible = true
    },
    submitForm () {
      let v = this
      const loading = this.$loading({
        lock: true,
        text: '拼死保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      v.submitSuccess()
      resourcesApi.saveResource(v.form, {complete: () => { loading.close() }}).then(res => {
        v.formVisible = false
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    // formModel: function (val, oldVal) {
    //   console.log(val)
    // }
  }
}

function blankForm () {
  return {
    id: null,
    authId: null,
    name: '',
    displayName: '',
    type: 1,
    path: '',
    describes: ''
  }
}
</script>

<style scoped>

</style>
