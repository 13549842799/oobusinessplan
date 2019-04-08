<template>
  <div>
    <div class="treeContent">
      <template v-if="rule.length > 0" >
        <node :rule="rule" v-for="n in rule" :key="n.id" :node="n" ref="child">
        </node>
      </template>
      <template v-else>
        <div>暂无数据</div>
      </template>
    </div>
    <div class="foot">
      <el-button type="text" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import http from '@/http.js'
import node from '@/components/common/tree/Node'
import myButton from '@/components/common/tree/TreeButton'
import base from '@/base_variable'
import commonM from '@/components/common/commonMixins'

const prefix = base.orgin + '/api/authority/auth'

export default {
  components: {node, myButton},
  mixins: [commonM],
  props: ['roleId'],
  data () {
    return {
      tree: [],
      rule: {
        label: 'name',
        value: 'id',
        children: 'childs'
      }
    }
  },
  created () {
    http.$get(prefix + '/tree.re', {roleId: v.roleId}).then(res => {
      v.simpleDealResult(res.status, function () {
        v.tree = []
        v.tree = res.data
        console.log('少女祈祷中', v.tree)
      }, res.message)
    })
  },
  methods: {
    save () {
      let v = this
      let arr = []
      let ns = v.$refs.child
      $.each(ns, (i, n) => {
        arr.push(n.nodes(v.roleId))
      })
      http.$post(prefix, arr).then(res => {
        v.simpleDealResult(res.status, function () {
          
          return '权限操作成功'
        }, res.message)
      })
    }
  }
}

</script>

<style scoped>
.treeContent {
  height: 400px;
  overflow-y: auto;
}
.foot {
  text-align: center;
  border-top: 1px solid;
}
.node, .node1, .node2, .node3 {
  margin-bottom: 10px;
}
.node1 {
  margin-left: 10px;
}
.node2 {
  margin-left: 30px;
}
.node3 {
  margin-left: 50px;
}
</style>
