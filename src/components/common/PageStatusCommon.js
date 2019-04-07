/**
 * This is a file which control and manager status about add,edit and read.
 * it is new to a common form model
 */

const readStatus = 0
const addStatus = 1
const editStatus = 2

export default {
  data () {
    return {
      status: 0, // 当前操作的状态(读, 添加, 编辑..)
      deleteTip: false // 删除标志，element框架用于删除提示框相关的
    }
  },
  computed: {
    readOnly () {
      return this.status === readStatus
    },
    canAdd () {
      return this.status === addStatus
    },
    canEdit () {
      return this.status === editStatus
    }
  },
  methods: {
    setAddStatus () { this.status = addStatus },
    setEditStatus () { this.status = editStatus },
    setReadStatus () { this.status = readStatus }
  }
}
