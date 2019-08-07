<template>
  <div class="left-side-main">
     <el-button v-if="extendAble" type="success" id="displayButton" size="mini" :class="{'el-icon-d-arrow-right': !extend, 'el-icon-d-arrow-left': extend}"  @click="hideOrShow"></el-button>
    <div class="left-side" :style="{width: sideWidth + 'px'}">
      <ul class="ul-item" v-show="extend">
        <side-menu v-for="(menu,index) in items" v-bind:menu="menu" :key="index" ></side-menu>
      </ul>
    </div>
  </div>
</template>

<script>
import sideMenu from './SideMenu'
import http from './../http'
import {resouUrl} from './../base_variable'

export default {
  components: {sideMenu},
  props: {
    width: {
      type: Number,
      validator: val => { return val >= 40 }
    },
    extendAble: {
      type: Boolean,
      default: false
    },
    widthChange: {
      type: Function,
      default: width => {}
    },
    speed: {
      type: Number,
      default: 5,
      validator: val => { return val >= 0 && val <= 5 }
    }
  },
  data () {
    return {
      items: [],
      sideWidth: 0,
      iconWidth: 40,
      extend: true,
      tempWidth: null
    }
  },
  mounted () {
    let v = this
    v.sideWidth = v.width
    v.tempWidth = v.width
    //  初始化左侧列表
    http.$getP(resouUrl + '/resources.re').then(res => {
      this.items = res.data
    }).catch(res => {
      console.log(res)
    })
  },
  methods: {
    hideOrShow () {
      let v = this
      v.sideWidth = (v.extend = !v.extend) ? v.tempWidth : v.iconWidth
      v.widthChange(v.sideWidth)
    }
  }
}
</script>

<style scoped>
.left-side-main {
  height: 100%;
  position: relative;
}

.left-side-main > div {
  float: left;
  height: 100%;
  background:rgb(35, 38, 46, 0.9);
}

.lef-side-icon {
  position: relative;
}

.left-side{
  font-size: 16px;
  overflow: hidden;
  transition: width 0.6s;
  -webkit-transition: width 0.6s; /* Safari */
}

#displayButton {
  position: absolute;
  left: 0;
  top: 50%;
}

.ul-item{
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

</style>
