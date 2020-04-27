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

import ouserApi from '@/components/system/users/usersApi'

export default {
  name: 'ouserForm',
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
      switch (this.formType) {
        case 1: return '新增用户'
        case 2: return '修改用户'
        default: return ''
      }
    },
    /**
     * 表单类型 1-新增 2-修改
     */
    formType () {
      return this.form.id === null ? 1 : 2
    }
  },
  methods: {
    /**
     * 打开表单
     */
    openForm (current) {
      let v = this
      v.form = current === undefined ? util.newObj(v.obj) : (current === null ? blankOuser() : current)
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
      ouserApi.saveOuser(v.form, {complete: () => { loading.close() }}).then(res => {
        v.submitSuccess()
        v.open = false
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

function blankOuser () {
  return {
    id: null,
    username: '',
    password: '',
    surePassword: '',
    bindPhone: ''
  }
}
</script>

<style scoped>

</style>
