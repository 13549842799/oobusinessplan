<template>
  <div>
    <div class="treeContent">
      <template v-if="tree.length > 0" >
        <node :rule="rule" v-for="n in tree" :key="n.id" :node="n" ref="child">
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
import {authUrl} from '@/base_variable'

export default {
  components: {node, myButton},
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
    let v = this
    http.$axiosGet(authUrl + '/tree.re', {roleId: v.roleId}).then(res => {
      v.tree = []
      v.tree = res
      console.log('少女祈祷中', v.tree)
    }).catch(err => { v.$message.error(err.data.message) })
  },
  methods: {
    save () {
      let v = this
      let arr = []
      let ns = v.$refs.child
      $.each(ns, (i, n) => {
        let temp = n.nodes(v.roleId)
        if (temp.length > 0) {
          arr = arr.concat(temp)
        }
      })
      console.log('少女的数组', arr)
      http.$axiosPost(authUrl + '/add.do', arr).then(res => {
        v.$message.success('权限操作成功')
      }).catch(err => { v.$message.error(err.data.message) })
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
