<template>
  <el-dialog :title="formTitle" :visible.sync="open">
    <div>
      <el-form :model="form" label-position="left" :rules="rules">
        <el-form-item label="来源" :label-width="formLabelWidth" prop="source">
          <el-input v-model="form.source" placeholder="来源"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <template v-if="!form.id">
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" placeholder="密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="surePassword">
            <el-input v-model="form.surePassword" placeholder="确认密码" show-password></el-input>
          </el-form-item>
        </template>
        <el-form-item label="绑定邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.bind_email" placeholder="绑定邮箱"></el-input>
        </el-form-item>
        <el-form-item label="绑定手机" :label-width="formLabelWidth">
          <el-input v-model="form.bind_phone" placeholder="绑定手机"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import util from '@/components/common/objUtil'
import dialogSupport from '@/components/common/form/DialogTableSupport'

import accountApi from '@/components/personal/account/accountApi'

export default {
  name: 'accountForm',
  mixins: [dialogSupport],
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
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: blankAccount(),
      formLabelWidth: '120px',
      rules: {
        source: [
          { required: true, message: '请输入来源', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        surePassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formTitle () {
      return this.form.id === null ? '新增账号' : '修改账号'
    }
  },
  methods: {
    /**
     * 打开表单
     */
    openForm (current) {
      let v = this
      v.form = current === undefined ? util.newObj(v.obj) : (current === null ? blankAccount() : current)
      v.open = true
    },
    submitForm () {
      let v = this
      const loading = this.$loading({
        lock: true,
        text: '拼死保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      accountApi.saveAccount(v.form, {complete: () => { loading.close() }}).then(res => {
        v.submitSuccess()
        v.open = false
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

function blankAccount () {
  return {
    id: null,
    username: '',
    password: '',
    surePassword: '',
    source: '',
    bind_email: '',
    bind_phone: '',
    remark: ''
  }
}
</script>

<style scoped>

</style>
