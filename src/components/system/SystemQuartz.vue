<template>
  <div class="divContiner">
    <div class="quartz-title"><h3>时钟管理</h3></div>
    <div class="quartz-search">
      <el-button type="primary" @click="createQuartz">新增时钟</el-button>
    </div>
    <div class="quartz-content">
      <page-rolling :speed="8" :downRoll="downRoll">
        <el-table
        v-loading="loading"
        :data="list"
        height="300"
        style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="jobName"
            label="任务名称"
            width="330">
          </el-table-column>
          <el-table-column
            prop="jobKey"
            label="唯一标识"
            width="150">
          </el-table-column>
          <el-table-column
            prop="cron"
            label="cron表达式"
            width="150">
          </el-table-column>
          <el-table-column
            label="状态"
            width="150">
            <template slot-scope="scope">
              <el-tag size="medium" :type="scope.row.enabled ? 'success' : 'warning'">{{ scope.row.jobStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="editQuartz(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delQuartz(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </page-rolling>
    </div>
    <el-dialog :title="formMess.title" :visible.sync="formVisible">
      <el-form :model="form">
        <el-form-item label="时钟名称" :label-width="formLabelWidth">
          <el-input v-model="form.jobName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时钟功能描述" :label-width="formLabelWidth">
          <el-input v-model="form.jobDescription" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="cron表达式" :label-width="formLabelWidth">
          <el-input v-model="form.cron" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时钟执行类全名" :label-width="formLabelWidth">
          <el-input v-model="form.jobClassName" autocomplete="off" placeholder="例如: xxx.yyy.className"></el-input>
        </el-form-item>
        <el-form-item label="时钟执行指定方法名(非必填)" :label-width="formLabelWidth">
          <el-input v-model="form.jobMethodName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时钟执行传入参数配置" :label-width="formLabelWidth">
          <el-input v-model="form.jobParams" autocomplete="off" placeholder="例如 type/paramName/value,...."></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <span style="color: red">(type包含bean,int,string.其中bean只需要传入beanName就可以</span>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number v-model="form.jobNumber" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch v-model="form.enabled" active-color="#13ce66" inactive-color="#ff4949" active-text="运行" inactive-text="停止" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="formVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '@/http.js'
import {quartzUrl} from '@/base_variable'
import util from '@/components/common/objUtil'
import pageRolling from '@/components/common/pageRolling'

const formMessage = {
  1: {
    title: '新增时钟'
  },
  2: {
    title: '编辑时钟'
  }
}

export default {
  components: {pageRolling},
  data () {
    return {
      list: [],
      params: {
        delflag: 1
      },
      loading: false,
      formType: 1,
      formVisible: false,
      form: {
        id: null,
        jobName: ''
      },
      formLabelWidth: '170px'
    }
  },
  created () {
    let v = this
    // 初始化列表
    v.searchList()
  },
  computed: {
    formMess () {
      return formMessage[this.formType]
    }
  },
  methods: {
    searchList () {
      let v = this
      v.loading = true
      http.$axiosGet(quartzUrl + '/list.re', v.params, {complete: () => { v.loading = false }}).then(res => {
        v.list = res
      }).catch(err => { console.log(err) })
    },
    downRoll (e) {},
    /**
     * 打开时钟表单弹窗，初始化对象
     */
    createQuartz () {
      let v = this
      v.formVisible = true
      v.formType = 1
    },
    /**
     * 打开编辑表单弹窗
     */
    editQuartz (quartz) {
      let v = this
      //v.formVisible = true
      //v.formType = 2
      //v.form = util
      util.coryObjText(quartz)
    },
    /**
     * 删除时钟任务
     */
    delQuartz (quartz) {
      let v = this
      this.$confirm('是否删除 ' + quartz.jobName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.$axiosDel(quartzUrl + '/s/' + quartz.id + '/delete.do').then(res => {
          let index = v.list.indexOf(quartz)
          v.list.splice(index, 1)
          v.$message.success('删除成功')
        })
      }).catch(res => {
        console.log('error', res)
      })
    }
  }
}
</script>

<style scoped>
.quartz-title {
  width: 100%;
  height: 60px;
}
.quartz-search {
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
}
.quartz-content {
    width: 100%;
}
</style>
