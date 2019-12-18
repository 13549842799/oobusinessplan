<template>
  <div ref="pageRoll" class="roll_Container" v-bind:style="{width:width, height: height}">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'pageRolling',
  props: {
    width: { // 当前容器的宽
      type: String,
      default: '100%'
    },
    height: { // 当前容器的高
      type: String,
      default: '100%'
    },
    speed: { // 当前容器上下滚动的速度
      type: Number,
      default: 1
    },
    upRoll: {
      type: Function,
      default: () => {}
    },
    downRoll: {
      type: Function,
      required: true
    },
    rolling: {
      type: Function,
      default: () => { return true }
    }
  },
  mounted () {
    this.$refs.pageRoll.addEventListener('mousewheel', this.mouseScroll, false) // 鼠标滚轮滚动事件
    this.$refs.pageRoll.addEventListener('scroll', this.srollingEvent, true) // 滚动轴滚动事件
  },
  methods: {
    backTop () {
      this.$refs.pageRoll.scrollTop = 0
    },
    /**
     * 滚轮滚动事件函数，鼠标滚动轮每滚动一格触发一次
     */
    mouseScroll (e) {
      e.preventDefault()
      // let dire = e.deltaY > 0 // > 0: 向下 <0: 向上
      let delta = Math.max(-1, Math.min(1, e.deltaY)) // 负数表示向上滚动，正数表示向下滚动
      let dom = this.$refs.pageRoll
      let currentTop = dom.scrollTop // 当前滚动轴离容器顶部的距离
      let distance = delta * this.speed * 10
      if (!this.rolling(e, distance)) {
        return
      }
      dom.scrollTop = currentTop + distance
    },
    /**
     * 滚动轴滚动时出发的事件
     */
    srollingEvent (e) {
      let dom = this.$refs.pageRoll
      let scrollHeight = dom.scrollHeight
      let divHeight = dom.clientHeight // 元素可见高度
      let scrollTop = dom.scrollTop
      if (scrollTop === 0) {
        console.log('滚动到顶部了')
        this.upRoll(e)
        return
      }
      // 滚动高度 = div高度 + 滚动条头部离顶部的最大距离
      if ((divHeight + scrollTop) >= scrollHeight) {
        console.log('滚动到底部了')
        this.downRoll(e)
      }
    }
  }
}

</script>

<style scoped>
.roll_Container {
  overflow-y: hidden;
}
</style>
