<template>
  <el-dialog :title="formTitle" :visible.sync="formVisible">
    <div>
      <el-form :model="form" label-position="left">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.name" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.displayName" placeholder="显示名"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.describes" placeholder="如有描述，尽管填写"></el-input>
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

import rolesApi from '@/components/system/roles/rolesApi'

export default {
  name: 'rolesForm',
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
      form: blankRoles(),
      formType: 1, // 表单类型 1-新增 2-修改
      formVisible: false, // 表单显示和隐藏的开关
      formLabelWidth: '80px'
    }
  },
  computed: {
    formTitle () {
      switch (this.formType) {
        case 1: return '新增角色'
        case 2: return '修改角色'
        default: return ''
      }
    }
  },
  methods: {
    initAddForm () {
      this.initForm(blankRoles(), 1)
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
      rolesApi.saveRole(v.form, {complete: () => { loading.close() }}).then(res => {
        v.submitSuccess()
        v.formVisible = false
      }).catch(err => {
        console.log(err)
        err.data && err.data.message && v.$message.warning(err.data.message)
      })
    }
  }
}

function blankRoles () {
  return {
    id: null,
    authName: '',
    displayName: '',
    remark: ''
  }
}
</script>

<style>

</style>
