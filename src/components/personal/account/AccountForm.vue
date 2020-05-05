<template>
  <el-dialog :title="formTitle" :visible.sync="open">
    <div>
      <el-form :model="form" label-position="left">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
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
    return {
      form: blankOuser(),
      formLabelWidth: '80px'
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
