<template>
  <div>
    <div class="treeContent">
      <template v-if="myTree.length > 0" >
        <node :rule="myRule" v-for="n in myTree" :key="n.id" :node="n">
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
import node from '@/components/common/tree/Node'
import myButton from '@/components/common/tree/TreeButton'

export default {
  components: {node, myButton},
  props: {
    tree: Array,
    defaultCheck: Array,
    save: Function,
    rule: Object
  },
  data () {
    return {
      checkNode: [],
      halfNode: [],
      auths: null
    }
  },
  methods: {
    selectNode (data, status) {
      this.checkNode = status.checkedNodes
      this.halfNode = status.halfCheckedNodes
      console.log(this.checkNode)
      if (this.auths === null) {
        this.auths = this.checkArr
      }
    }
  },
  computed: {
    myRule () {
      return this.rule ? this.rule : {label: 'label', children: 'childs', value: 'id'}
    },
    myTree () {
      return this.tree ? this.tree : []
    },
    checkArr () {
      let arr = []
      $.each(this.defaultCheck, f => {
        arr.push(f.reid)
      })
      return arr
    },
    treeArray () {
      let arr = {}
      $.each(this.tree, (l, v) => {
        dg(v, arr)
      })
      return arr
    }
  }
}

function dg (n, arr) {
  arr[n.id] = n
  $.each(n.childs, (i, v) => {
    dg(v, arr)
  })
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
