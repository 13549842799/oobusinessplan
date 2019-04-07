<template>
  <div class="node">
    <span><el-checkbox :true-label="1" :false-label="0" v-model="auth_.delflag" /></span>
    <span>{{node_[label] ? node_[label] : '无'}}</span>
    <span v-if="hasChilds" class="selectAll el-icon-star-off" @click="selectAll"></span>
    <div class="slot">
      <span @click="alterType">{{typeName}}</span>
      <span>{{levelName}}</span>
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
      node_: null,
      auth_: null
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
    this.auth_ = this.node_.authority
  },
  methods: {
    alterType () {
      let v = this
      console.log(v.auth_.delflag)
      if (!v.auth_.delflag) {
        v.auth_.delflag = 1
      }
      v.auth_.type = v.auth_.type === 1 ? 2 : 1
    },
    selectAll () {
      let v = this
      if (!v.auth_.delflag) {
        v.auth_.delflag = 1
      }
      let cs = this.$refs.child
      $.each(cs, (i, v) => {
        v.selectAll()
      })
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
