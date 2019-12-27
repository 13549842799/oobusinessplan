<template>
  <div class="tap">
    <div class="resource_left">
      <div :class="{'left-window': !readOnly}"></div>
      <div>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree :class="{'disable-text': !readOnly}"  class="filter-tree" :data="tree" :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        check-on-click-node
        :expand-on-click-node="false"
        @node-click="selectNode"
        node-key="id"
        ref="tree">
        </el-tree>
      </div>
    </div>
    <div class="resource_right">
      <div v-if="readOnly">
        <div class="header">
          <span>{{node.name}}</span>
          <div v-show="!node.locking" class="button-group">
            <el-button v-show="node.name" style="padding: 3px 0" type="text" @click="updateState">
              {{node.state ? '禁用' : '启用'}}
            </el-button>
            <el-button v-show="node.type === 1" style="padding: 3px 0" type="text" @click="add">
              添加
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
          <div style="margin-left: 300px" class="fieldDiv">
            <em>当前状态</em><b>{{node.state ? '启用' : '禁用'}}</b>
          </div>
          <div class="fieldDiv">
            <em>请求</em><span>{{node.request_url}}</span>
          </div>
          <div class="fieldDiv">
            <em>路径</em><span>{{node.path}}</span>
          </div>
          <div class="fieldDiv">
            <em>类型</em><span>{{moduleType[node.type]}}</span>
          </div>
          <div class="fieldDiv">
            <em>样式</em><span>{{node.style}}</span>
          </div>
          <div class="fieldDiv">
            <em>唯一键</em><span>{{node.key}}</span>
          </div>
          <div class="fieldDiv">
            <em>描述</em><span>{{node.describes}}</span>
          </div>
        </div>
      </div>
      <form-item v-if="!readOnly">
        <row-item title="">
          <label>当前父级</label>:<el-cascader
            v-model="parentIdArr"
            :props="defaultProps"
            :options="moduleTree"
            :show-all-levels="false"
            expand-trigger="hover"
            change-on-select>
          </el-cascader>
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
        <row-item title="请求">
          <input-item name="request_url" v-model="form.request_url"></input-item>
        </row-item>
        <row-item title="类型">
          <el-radio-group @change="typeChange" v-model="type">
            <el-radio :label="1">{{moduleType[1]}}</el-radio>
            <el-radio :label="2">{{moduleType[2]}}</el-radio>
            <el-radio :label="3">{{moduleType[3]}}</el-radio>
          </el-radio-group>
        </row-item>
        <row-item title="样式">
          <input-item name="style" v-model="form.style"></input-item>
        </row-item>
        <row-item title="描述">
          <input-item name="describes" v-model="form.describes"></input-item>
        </row-item>
        <el-button @click="submit" type="success"  >提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="backToLast" icon="el-icon-arrow-right"></el-button>
      </form-item>
    </div>
  </div>
</template>

<script>
import http from '@/http.js'
import {resouUrl} from '@/base_variable'
import {formGroup} from '@/components/common/FormJs'
import commonM from '@/components/common/commonMixins'
import pModel from '@/components/common/PageStatusCommon'
// import util from '@/components/common/objUtil'

let commonUrl = {
  resourceTree (params) { return http.$axiosGet(resouUrl + '/tree.re', params) }
}

export default {
  name: 'resourcesOption',
  mixins: [formGroup, commonM, pModel],
  components: {},
  data () {
    return {
      moduleType: {1: '菜单模块', 2: '页内模块', 3: '功能模块'},
      type: null,
      filterText: '',
      tree: [],
      defaultProps: {
        label: 'name',
        value: 'id',
        children: 'childs'
      },
      node: {},
      parentIdArr: [],
      form: {},
      moduleTree: []
    }
  },
  computed: {
  },
  watch: {
    'filterText': function (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    http.$setHeadersFromLocal()
    let dom = this
    // 获取资源树
    commonUrl.resourceTree().then(res => {
      dom.tree = res !== null && res !== undefined ? res : [{id: 1, name: '无资源', childs: []}]
    })
  },
  methods: {
    typeChange (val) {
      this.form.type = this.type
    },
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
      // 这个对象是为了解决在 application/json;charset=utf-8 下后端接收不到get类型的参数的问题
      let params = new URLSearchParams()
      params.append('id', n.id)
      http.$axiosPost(resouUrl + '/state.do', params).then(res => {
        n.state = n.state ? 0 : 1
        let mess = n.state ? '成功启用' : '成功禁用'
        v.$message.success(mess + '<' + n.name + '>节点')
      }).catch(() => { v.$message.error('更新失败') })
    },
    add () {
      let v = this
      v.setAddStatus()
      fullModuleTree(v, v.node.path)

      // 初始化表单对象
      for (const key in modelObj) {
        v.form[key] = modelObj[key]
      }
      v.form.type = modelObj.type
    },
    edit () {
      let v = this
      let n = v.node
      v.setEditStatus()
      let p = v.$refs.tree.getNode(n.pid)
      console.log('======== edit ===========', p)
      fullModuleTree(v, p.data.path)
      let f = v.form
      for (const key in modelObj) {
        f[key] = n[key]
      }
      v.type = f.type
      console.log('======== 少女祈祷中 ===========', f)
    },
    remove () {
      let v = this
      v.deleteTip = false
      // 用于传递查询字符串
      let params = new URLSearchParams()
      params.append('id', v.node.id)
      http.$axiosPost(resouUrl + '/delete.do', params).then(res => {
        let name = v.node.name
        v.$refs.tree.remove(v.node.id)
        v.node = {}
        v.$message.success('<' + name + '>节点删除成功')
      })
    },
    submit () {
      let v = this
      let params = new URLSearchParams()
      for (const k in v.form) {
        params.append(k, v.form[k])
      }
      params.append('type', v.form.type === null || v.form.type === '' ? null : parseInt(v.form.type))
      params.append('pid', v.parentIdArr[v.parentIdArr.length - 1])
      params.delete('order')
      if (!params.get('custom')) { // 如果不等于自定义
        params.set('key', params.get('request_url'))
      }
      if (v.canAdd) {
        http.$axiosPost(resouUrl + '/add.do', params).then(data => {
          let n = data
          n.list = n.type === 1 ? n.childs = [] : null
          createPath(n, v.parentIdArr)
          v.$message.success('<' + n.name + '>节点创建成功')
          v.form = {}
          v.node = n
          v.setReadStatus()
          v.$refs.tree.append(n, n.pid)
        }).catch(err => { console.log(err) })
        return
      }
      http.$axiosPost(resouUrl + '/update.do', params).then(data => {
        let newNode = data
        if (v.node.pid === v.parentIdArr[v.parentIdArr.length - 1]) {
          for (const k in modelObj) {
            v.node[k] = newNode[k]
          }
        } else {
          v.$refs.tree.remove(v.node.id)
          v.node = newNode
          v.$refs.tree.append(newNode, v.node.pid)
        }
        v.setReadStatus()
        v.form = {}
      }).catch(err => { console.log(err) })
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
  }
}

/**
 * 补充节点的path属性
 */
function createPath (node, parentIdArr) {
  if (!node.pid || !parentIdArr || parentIdArr.length === 0) {
    return node.id
  }
  node.path = ''
  for (let i = 0; i < parentIdArr.length; i++) {
    node.path += parentIdArr[i] + ','
  }
  node.path += node.id
}

function fullModuleTree (v, path) {
  // 设置树
  commonUrl.resourceTree({type: 1}).then(res => {
    v.moduleTree = res !== null && res !== undefined ? res : [{id: 1, name: '无资源', childs: []}]
  })
  console.log(path)
  // 设置默认值
  let t = path.split(',')
  v.parentIdArr = []
  t.forEach((val, index) => {
    v.parentIdArr[index] = parseInt(val)
  })
}

const modelObj = {
  id: null,
  name: '',
  request_url: '',
  style: '',
  type: null,
  describes: null,
  state: 1,
  key: null
}

</script>

<style scoped>

@import './common.css';

</style>
