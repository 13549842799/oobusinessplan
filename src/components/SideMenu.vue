<template>
  <li :key="menu.id" >
    <a @click="menuStatus($event)" >{{menu.name}}</a>
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
</style>
