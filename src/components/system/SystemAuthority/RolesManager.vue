<template>
  <div class="tap">
    <div class="resource_left">
      <div :class="{'left-window': !readOnly}"></div>
      <div class="resource_left_list">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree  class="filter-tree" :data="list" :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        check-on-click-node
        :expand-on-click-node="false"
        @node-click="selectNode"
        node-key="id"
        ref="tree">
        </el-tree>
      </div>
      <!-- <list-UI placeholder="请输入名称或编号进行筛选" onfilter
        :array="list">
      </list-UI> -->
      <div style="text-align: center">
        <el-button style="padding: 3px 0" type="text" @click="add">添加</el-button>
      </div>
    </div>
    <div class="resource_right">
      <div v-if="readOnly">
        <div class="header">
          <span>{{node.name}}</span>
          <div v-show="node.id != 1 && node.id" class="button-group">
            <el-button v-show="node.name" style="padding: 3px 0" type="text" @click="updateState">
              {{node.state ? '禁用' : '启用'}}
            </el-button>
            <el-button  style="padding: 3px 0" type="text" @click="authoritySet">
              权限设置
            </el-button>
            <el-button style="padding: 3px 0" type="text" @click="edit">编辑</el-button>
            <el-popover placement="top" width="160" v-model="deleteTip">
              <p>你确定要删除&#60;{{node.name}}&#62;吗</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="deleteTip = false">取消</el-button>
                <el-button type="primary" size="mini" @click="remove">确定</el-button>
              </div>
              <el-button style="padding: 3px 0" type="text" slot="reference">删除</el-button>
            </el-popover>
          </div>
        </div>
        <div class="content" v-show="node.name">
          <div class="fieldDiv">
            <em>编号</em><span>{{node.code}}</span>
          </div>
          <div class="fieldDiv">
            <em>当前状态</em><span>{{node.state ? '启用' :'禁用'}}</span>
          </div>
          <div class="fieldDiv">
            <em>描述</em><span>{{node.describes}}</span>
          </div>
          <div class="fieldDiv">
            <em>创建人</em><span>{{node.creatorName}}</span>
          </div>
          <div class="fieldDiv">
            <em>最后修改人</em><span>{{node.modifierName}}</span>
          </div>
        </div>
      </div>
      <form-item v-if="!readOnly">
        <row-item title="">
          <switch-item
          name="state"
          v-model="form.state"
          defaultValue=true
          active=1
          inactive=0
          onText="启用"
          offText="禁用"
          ></switch-item>
        </row-item>
        <row-item title="名称">
          <input-item name="name" v-model="form.name"></input-item>
        </row-item>
        <row-item title="编码">
          <input-item name="code" v-model="form.code"></input-item>
        </row-item>
        <row-item title="排序">
          <input-item name="style" v-model="form.sort"></input-item>
        </row-item>
        <row-item title="描述">
          <input-item name="describes" v-model="form.describes"></input-item>
        </row-item>
        <el-button @click="submit" type="success"  >提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="backToLast" icon="el-icon-arrow-right"></el-button>
      </form-item>
    </div>
    <Dialog title="权限设置" ref="dialog">
      <authsTree :roleId="node.id"></authsTree>
    </Dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import http from '@/http.js'
import {roleUrl} from '@/base_variable'
// import $ from 'jquery'
import {formGroup} from '@/components/common/FormJs'
import listUI from '@/components/common/List'
import pModel from '@/components/common/PageStatusCommon'
import util from '@/components/common/objUtil'
import commonM from '@/components/common/commonMixins'
import authsTree from '@/components/system/SystemAuthority/AuthsTreeOperation'
import Dialog from '@/components/common/Dialog'

const commonUrl = {
  roleList (params) { return http.$get(roleUrl + '/list.re', params) }
}

export default {
  name: 'rolesManager',
  mixins: [formGroup, commonM, pModel],
  components: {
    listUI,
    authsTree,
    Dialog
  },
  data () {
    return {
      list: [],
      filterText: '',
      defaultProps: {
        label: 'name',
        value: 'id',
        children: 'childs'
      },
      node: {}, // 当前选中的节点
      form: {} // 表单对象
    }
  },
  watch: {
    'filterText': function (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
    },
    selectNode (obj, node, item) {
      this.node = obj
      console.log(obj)
    },
    updateState () {
      let v = this
      let n = v.node
      console.log('少女祈祷中', n.id)
      http.$patch(roleUrl + '/' + n.id + '/state.do', null).then(res => {
        v.simpleDealResult(res.status, function () {
          n.state = n.state ? 0 : 1
          let mess = n.state ? '成功启用' : '成功禁用'
          return mess + '<' + n.name + '>节点'
        }, res.message)
      })
    },
    add () {
      let v = this
      v.setAddStatus()
      $.each(modelObj, k => {
        v.form[k] = modelObj[k]
      })
    },
    edit () {
      let v = this
      let n = v.node
      v.setEditStatus()
      let p = v.$refs.tree.getNode(n.pid)
      console.log('======== edit ===========', p)
      let f = v.form
      $.each(modelObj, k => {
        f[k] = n[k]
      })
      console.log('======== 少女祈祷中 ===========', f)
    },
    remove () {},
    authoritySet () {
      let v = this
      v.$refs.dialog.visable = true
    },
    submit () {
      let v = this
      let params = util.newObj(v.form)
      if (v.canAdd) {
        http.$post(roleUrl + '/add.do', JSON.stringify(params)).then(res => {
          v.simpleDealResult(res.status, function () {
            let n = res.data
            let mes = '<' + n.name + '>角色创建成功'
            v.form = {}
            v.node = n
            v.setReadStatus()
            v.$refs.tree.append(n, null)
            return mes
          }, null, null, res.message)
        }, res => {
          console.log(res)
        })
        return
      }
      http.$patch(roleUrl + '/edit.do', JSON.stringify(params)).then(res => {
        let newNode = res.data
        v.simpleDealResult(res.status, function () {
          $.each(modelObj, k => {
            v.node[k] = newNode[k]
          })
          v.setReadStatus()
          v.form = {}
        })
      })
    },
    resetForm () {
      if (this.canAdd) {
      }
    },
    backToLast () {
      let v = this
      v.form = {}
      v.setReadStatus()
    }
  },
  created () {
    http.$setHeadersFromLocal()
    let dom = this
    commonUrl.roleList({}).then(res => {
      dom.simpleDealResult(res.status, function () {
        dom.list = res.data ? res.data : [{id: 1, name: '暂无数据'}]
      }, null, null, res.message)
    })
  }
}

const modelObj = {
  id: null,
  code: null,
  sort: null,
  name: '',
  describes: null,
  state: 1
}

</script>

<style scoped>

@import './common.css';

.resource_left_list {
  height: 80%;
  overflow-y: auto;
}

</style>
