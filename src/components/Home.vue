<template>
   <div class="home">
      系统的规则：
      <ol>
        <li>本系统由个人维护</li>
        <li>未经允许，不可把本系统用于商业用途，虽然不知道这个有什么用</li>
        <li>当前bug收集</li>
        <li>当从首页到登录页，再从登陆页登陆进首页时，跳转后的首页的头部显示账号和推了的地方css没有加载</li>
      </ol>
      <el-button @click="test">测试</el-button>
  </div>
</template>

<script>
import radioItem from '@/components/common/RadioItem'
import http from '@/http.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    test () {
      let v = this
      http.$getP('http://localhost:8081/O.OBusinessPlan/test/test.re', {a: 10}, {context: this}).then(function (res) {
        console.log('第一次陈工')
        v.$message.success('成功')
        return res.res
      }).then(function (res) {
        console.log('成功1')
        return http.$getP('http://localhost:8081/O.OBusinessPlan/test/test.re')
        // return new Promise(() => {})
      }).then(function (res) {
        console.log('成功2')
        console.log(res)
      }).catch((r) => { console.log(r) })
    }
  },
  components: {
    radioItem
  }
}
</script>

<style scoped>
.home{
  width: 100%;
  text-align: center;
}
</style>
