<template>
  <div id="app">
    <router-view/>
    <!-- <router-link to="/index">登陆网页</router-link> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 1200px;
  height: 1200px;
  margin: 0 auto;
}

.divContiner {
  padding: 10px 10px;
}

.child-Continer {
  margin-top: 15px;
  position: relative;
  height: 1000px
}

.child-content {
  background: #ffffff;
  height: 1000px;
}
</style>
