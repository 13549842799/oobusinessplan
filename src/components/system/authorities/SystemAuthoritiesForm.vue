<template>
  <el-dialog :title="formTitle" :visible.sync="formVisible">
    <div>
      <el-form :model="form" label-position="left">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.authName" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.displayName" placeholder="权限真名"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.remark" placeholder="如有备注，尽管填写"></el-input>
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

import authsApi from '@/components/system/authorities/authoritiesApi'

export default {
  name: 'authsForm',
  props: {
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
      form: blankAuths(),
      formType: 1, // 表单类型 1-新增 2-修改
      formVisible: false, // 表单显示和隐藏的开关
      formLabelWidth: '80px'
    }
  },
  computed: {
    formTitle () {
      switch (this.formType) {
        case 1: return '新增权限'
        case 2: return '修改权限'
        default: return ''
      }
    }
  },
  methods: {
    initAddForm () {
      this.initForm(blankAuths(), 1)
    },
    /**
     * 显示修改表单
     */
    initEditForm (form) {
      this.initForm(util.newObj(form), 2)
    },
    initForm (form, type) {
      let v = this
      v.form = form
      v.formType = type
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
      authsApi.saveAuth(v.form, {complete: () => { loading.close() }}).then(res => {
        v.submitSuccess()
        v.formVisible = false
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

function blankAuths () {
  return {
    id: null,
    authName: '',
    displayName: '',
    remark: ''
  }
}
</script>

<style scoped>

</style>
