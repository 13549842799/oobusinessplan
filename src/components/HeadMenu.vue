<template>
  <div class="head-continer">
    <div class="logo">
      <router-link :to="{name: 'home'}">O.O后台管理</router-link>
    </div>
    <div class="header_main">
      <div class="message"></div>
    </div>
    <div class="header-item">
      <el-button type="text" @click="cancelUser">注销</el-button>
    </div>
  </div>
</template>

<script>
// import http from './../http'
// import {adminUrl} from './../base_variable'
import usersApi from '@/components/system/users/usersApi'

export default {
  name: 'headMenu',
  components: {
  },
  data () {
    return {
      loginInfo: {},
      header: {}
    }
  },
  mounted () {
    let v = this
    //  初始化个人信息
    //  http.$axiosGet(adminUrl + '/admin_main.re', {'accountname': http.getUser()}).then(res => {
    //    v.loginInfo = res.data
    //  }).catch(err => { console.log(err) })
     usersApi.getUsers().then(res => {
       v.loginInfo = res.data
     }).catch(err => { console.log(err) })
  },
  methods: {
    /**
     * 注销账号登陆
     */
    cancelUser () {
      let v = this
      // http.$axiosGet(adminUrl + '/' + http.getUser() + '/signout.do').then(res => {
      //   v.$alert('您已成功注销，请重新登录', '', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //       v.$router.push({name: 'login'})
      //     }
      //   })
      // }).catch(err => { console.log(err) })
      usersApi.logout().then(res => {
        v.$alert('您已成功注销，请重新登录', '', {
          confirmButtonText: '确定',
          callback: action => {
            v.$router.push({name: 'login'})
          }
        })
      }).catch(err => { console.log(err) })
    }
  }
}
</script>

<style scoped>
.head-continer{
  width: 100%;
  height: 100%;
  background-color: #23262E;
  line-height: 60px;
  text-align: center;
  padding: 0 0;
}
.head-continer>div{
    float: left;
    height: 100%;
}
.logo{
  width: 200px;
  font-size: 16px;
  color: #409EFF;
}
.header_main{
    width: 600px;
}
.message{
    display: inline-block;
    height: 40px;
    width: 90%;
    background-color: azure;
    margin-top: 10px;
    opacity: 0.7;
    box-shadow:2px 2px 3px #aaaaaa inset;
}

.header-item{
    width: 300px;
    margin-right: 0px;
    color: white;
}

.header-item ul{
  display: inline;
}

.header-item>ul>li{
  float: left;
  height: 100%;
  position: relative;
  width: 100px;
}

.header-item-title{
  color: aliceblue;
  height: 60px;
  width: 100%;
  display: inline-block;
  padding: 0 8px;
  position: relative;
}

.avatar-item{
  position: absolute;
  z-index: 20;
  left: 40px;
  width: 36px;
  height: 36px;
  transition: .3s;
}

.avatar-item .avatar_img{
  border: 0 solid #fff;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.drogDiv{
  position: absolute;
  top: 60px;
  left: -40px;
  width: 200px;
  height: 300px;
  border: 1px solid #23262E;
  display: none;
}

.header-item>ul>li>.active{
    display: block;
}

.nickname{
  color: #fb7299!important;
  margin-bottom: 8px;
}
</style>
