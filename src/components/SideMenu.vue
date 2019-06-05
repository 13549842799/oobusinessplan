<template>
  <li :key="menu.id" >
    <a @click="menuStatus($event)" ><span>{{menu.name}}</span></a>
    <dl v-if="menu.childs.length > 0" class="hide">
      <dd v-for="m in menu.childs" :key="m.id">
        <router-link :to="{name: m.request_url,params: {}}" >{{m.name}}</router-link>
      </dd>
    </dl>
  </li>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'side-menu',
  props: ['menu'],
  data () {
    return {
      hiding: true
    }
  },
  methods: {
    menuStatus (e) {
      let dl = $(e.target).next()
      if (this.hiding) {
        dl.slideDown('fast')
      } else {
        dl.slideUp('fast')
      }
      this.hiding = !this.hiding
    }
  }
}
</script>

<style scoped>
.hide{
  display: none;
}

a:hover {
  cursor: pointer;
  opacity: .8;
  background-color: #c2c2c2;
  color: #303133;
}

a > span {
  margin-left: 10px;
}

li a {
  width: 100%;
  height: 50px;
  display: block;
  line-height: 50px;
  font-size: 16px;
  color: #fff;
  padding: 0;
}

li dl a {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
</style>
