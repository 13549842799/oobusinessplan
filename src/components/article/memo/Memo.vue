<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="100px">
        <div style="height:50px">
          备忘录
        </div>
        <div>
          <el-form :inline="true" :model="params">
            <el-form-item>
              <el-button size="medium" type="primary" >查询</el-button>
              <el-button size="medium" @click="addMemo" icon="el-icon-edit" type="success" >新建备忘</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <h3>全部笔记</h3>
        <div class="memo-conainer">
          <template v-for="(m, name) in memos">
            <el-divider content-position="right" :key="name">{{name}}</el-divider>
            <div class="memo-card" v-for="(v, index) in m" :key="name+index" @click="addMemo(v)">
              <div class="memo-card-content">{{v.content}}</div>
              <div class="memo-card-date">{{v.dateStr}}</div>
              <el-popconfirm title="确定删除吗？" @onConfirm="delMemo(v)">
                <el-button  slot="reference" type="info" icon="el-icon-close" class="memo-card-del" size="mini" circle></el-button>
              </el-popconfirm>
            </div>
            <!-- <el-card class="memo-card" shadow="hover" v-for="(v, index) in m" :key="name+index">
              <div>{{v.content}}</div>
              <div>{{v.date}}</div>
            </el-card> -->
          </template>
        </div>
      </el-main>
    </el-container>

    <el-dialog :title="title" :visible.sync="dialog.open" width="450px">
      <el-form :model="dialog.form">
        <el-form-item label="日期" :label-width="dialog.formLabelWidth">
          <el-date-picker v-model="dialog.form.date" align="right" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题" :label-width="dialog.formLabelWidth">
          <el-input v-model="dialog.form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="dialog.formLabelWidth">
          <el-input v-model="dialog.form.content" type="textarea" :row="3" autocomplete="off" placeholder="请填写内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.open = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/components/common/objUtil'
import {dateFormat} from '@/components/common/commonUtil'

import memoApi from '@/components/article/memo/memoApi'

export default {
  components: {},
  data () {
    return {
      dialog: {
        open: false,
        formLabelWidth: '40px',
        form: blankMemo()
      },
      memos: {},
      params: {}
    }
  },
  created () {
    let v = this
    v.createList()
  },
  computed: {
    title () {
      return this.dialog.form.id === null ? '新建备忘' : '修改备忘'
    }
  },
  methods: {
    addMemo (obj) {
      this.dialog.form = obj !== null && util.validObj(obj.id) ? obj : blankMemo()
      this.dialog.open = true
    },
    submitForm () {
      let v = this
      memoApi.saveMemo(v.dialog.form).then(res => {
        v.createList()
        v.dialog.open = false
        v.$message.success('保存成功')
      }).catch(err => { console.log(err) })
    },
    delMemo (t) {
      let v = this
      memoApi.deleteMemo(t.id).then(res => {
        v.$message.success('删除成功')
        v.createList()
      }).catch(err => { console.log(err) })
    },
    createList () {
      let v = this
      memoApi.getList().then(res => {
        v.memos = res
      }).catch(err => { console.log(err) })
    }
  }
}

function blankMemo () {
  return {
    id: null,
    title: '',
    content: '',
    date: dateFormat('yyyy-MM-dd', new Date())
  }
}

</script>

<style>
.memo-conainer {
  width: 990px;
  height: 900px;
  overflow: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.memo-card {
  width: 810px;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px 20px;
  position: relative;
}

.memo-card-date {
  font-size: 15px;
  color: gray;
  margin-top: 10px;
}

.memo-card-del {
  position:absolute;
  right: 20px;
  top: 10px;
}

.memo-card-del :hover {
  cursor: pointer;
}

</style>
