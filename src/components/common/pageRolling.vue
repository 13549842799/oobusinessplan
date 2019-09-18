<template>
  <div class="roll_Container" v-bind:style="{width:width, height: height}">
    <slot></slot>
  </div>
</template>

<script>
import $ from 'jquery'

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
      default: 5
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
    $('.roll_Container').on('mousewheel DOMMouseScroll', this.mouseScroll)
    $('.roll_Container').scroll(this.srollingEvent)
  },
  methods: {
    /**
     * 滚轮滚动事件函数
     */
    mouseScroll (e) {
      e.preventDefault()
      let wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail
      let delta = Math.max(-1, Math.min(1, wheel)) // 负数表示向下滚动，正数表示向上滚动
      let currentTop = $('.roll_Container').scrollTop() // 当前滚动轴离容器顶部的距离
      let distance = delta * this.speed
      if (!this.rolling(e, distance)) {
        return
      }
      $('.roll_Container').scrollTop(currentTop - distance)
    },
    /**
     * 滚动轴滚动时出发的事件
     */
    srollingEvent (e) {
      let scrollHeight = $('.roll_Container').prop('scrollHeight')
      let divHeight = $('.roll_Container').height()
      let scrollTop = $('.roll_Container').scrollTop()
      if (scrollTop === 0) {
        console.log('滚动到顶部了')
        this.upRoll(e)
      }
      // 滚动高度 = div高度 + 滚动条头部离顶部的最大距离
      if ((divHeight + scrollTop) >= scrollHeight) {
        
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
