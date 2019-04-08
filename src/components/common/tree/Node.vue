<template>
  <div class="node">
    <span><el-checkbox @change="checkNode" :true-label="1" :false-label="0" v-model="auth_.delflag" /></span>
    <span>{{node_[label] ? node_[label] : '无'}}</span>
    <el-tooltip class="item" effect="dark" :content="selAll ? '取消全选' : '全选'" placement="top-start">
      <span v-if="hasChilds" class="selectAll el-icon-star-on" @click="selectAll"></span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="remAll ? '取消全不选' : '全不选'" placement="top-start">
      <span v-if="hasChilds" class="selectAll el-icon-star-off" @click="removeAll"></span>
    </el-tooltip>
    <div class="slot">
      <span @click="alterStatus('type')">{{typeName}}</span>
      <span @click="alterStatus('level')">{{levelName}}</span>
    </div>
    <div class="childNode" v-if="hasChilds">
      <node
        v-for="n in node_[childs]"
        :rule="rule_"
        :key="n[key]" :node="n" ref="child">
      </node>
    </div>
  </div>
</template>

<script>
import util from '@/components/common/objUtil'
import $ from 'jquery'

export default {
  name: 'node',
  props: ['node', 'rule'],
  data () {
    return {
      node_: null, // 资源
      auth_: null, // 资源对应的权限
      selAll: false, // 当前节点是否开启 全选 子节点
      remAll: false // 当前节点是否开启 全不选 子节点
    }
  },
  computed: {
    rule_ () {
      return this.rule ? this.rule : {}
    },
    label () {
      return this.rule_.label
    },
    childs () {
      return this.rule_.children
    },
    hasChilds () {
      return this.node_[this.childs] && this.node_[this.childs].length > 0
    },
    key () {
      return this.rule_.value ? this.rule.value : 'id'
    },
    level () {
      return this.auth_ ? this.auth_.level : 1
    },
    levelName () {
      return this.level === 1 ? '只读' : '读写'
    },
    type () {
      return this.auth_ ? this.auth_.type : 1
    },
    typeName () {
      return this.type === 1 ? '自用' : '可授权'
    }
  },
  created () {
    this.node_ = util.newObj(this.node)
    this.auth_ = util.newObj(this.node_.authority)
    if (this.auth_.type === null) {
      this.auth_.type = 1
    }
    if (this.auth_.level === null) {
      this.auth_.level = 1
    }
  },
  methods: {
    /** 修改 */
    alterStatus (field) {
      let v = this
      console.log(v.auth_.delflag)
      if (!v.auth_.delflag) {
        v.auth_.delflag = 1
      }
      v.auth_[field] = v.auth_[field] === 1 ? 2 : 1
    },
    /** 全选/取消全选 */
    selectAll () {
      let v = this
      v.selAll = !v.selAll
      v.remAll = false
      v.operationNode(true, v.selAll, 1)
    },
    /** 全不选/取消全不选 */
    removeAll () {
      let v = this
      v.remAll = !v.remAll
      v.selAll = false
      v.operationNode(false, v.remAll, 0)
    },
    operationNode (type, flag, val) {
      let v = this
      let del = type ? !v.auth_.delflag : v.auth_.delflag
      if (flag) {
        if (del) {
          v.auth_.delflag = val
        }
      } else {
        v.auth_.delflag = v.node.authority.delflag
      }
      let cs = this.$refs.child
      $.each(cs, (i, val) => {
        val.operationNode(type, flag, val)
      })
    },
    checkNode () {
      let v = this
      // v.auth_.delflag = v.auth_.delflag ? 0 : 1
      if (!v.auth_.delflag && v.hasChilds) {
        v.operationNode(false, true, 0)
      }
      console.log(v.auth_.delflag)
      console.log(v.node.authority.delflag)
    },
    nodes (roleId) {
      let l = []
      let v = this
      console.log('1', v.auth_.delflag)
      console.log('2', v.node.authority.delflag)
      console.log(v.node.name)
      if (!(v.node.authority.delflag === v.auth_.delflag || (v.node.authority.delflag === null && v.auth_.delflag === 0))) {
        v.auth_.reid = v.node_.id
        v.auth_.roid = roleId
        l.push(v.auth_)
        console.log('进入添加权限中', v.auth_)
      }
      let ns = v.$refs.child
      $.each(ns, (i, n) => {
        let son = n.nodes(roleId)
        if (son.length > 0) {
          l = l.concat(son)
          console.log('凭借数组', l)
        }    
      })
      return l
    }
  }
}
</script>

<style scoped>
.node {
  position: relative;
  margin-bottom: 20px;
  margin-top: 20px;
}
.childNode {
  margin-left: 15px;
  margin-top: 20px;
}
.slot {
  float: right;
}
.slot > span {
  display: block;
  float: left;
  margin-right: 10px;
  border: 1px solid #409EFF;
  border-radius: 2px;
  font-size: 12px;
  width: 50px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background-color: aliceblue;
}
.slot > span:hover {
  cursor: pointer;
  color: #409EFF;
}
.selectAll {
  margin-left: 10px;
}
.selectAll:hover {
  cursor: pointer;
}

</style>
