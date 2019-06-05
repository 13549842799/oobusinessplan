<template>
  <el-container>
    <el-header height="60px">
      <div class="logo"><router-link :to="{name: 'home'}">O.O后台管理</router-link></div>
      <div class="header_main">
        <div class="message"></div>
      </div>
      <div class="header-item">
        <drop-menus>
          <menu-item @mouseenter.native="focusONAvatar($event)" @mouseleave.native="leaveAvatar($event)">
            <template slot="title">
              <div class="avatar-item">
                  <img class="avatar_img" :src="loginInfo.avatar"  />
              </div>
            </template>
            <template slot="drop">
              <b class="nickname">{{loginInfo.nikename}}</b>
              <p><span></span></p>
            </template>
          </menu-item>
          <menu-item>
            <template slot="title">消息</template>
            <template slot="drop">
              <ul>
                <li></li>
              </ul>
            </template>
          </menu-item>
        </drop-menus>
      </div>
    </el-header>
    <el-main style="padding: 0">
      <div class="left-side-container">
        <left-side :width="leftside.width" :extendAble="true" v-bind:widthChange="widthChange"></left-side>
      </div>
      <div class="main-container" :style="{width: autoWidth}">
        <div class="main-container-main">
          <router-view></router-view>
        </div>
        <div class="foot-container">
          © 2019-2020 聊天鬼才 . All rights reserved.
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import $ from 'jquery'
import http from './../http'
import {adminUrl} from './../base_variable'
import router from './../router'
import leftSide from './LeftSide'

const dropMenus = {
  template: '<ul><slot></slot></ul>'
}

const menuItem = {
  template: '<li @mouseenter="show($event)" @mouseleave="hide($event)"><a class="header-item-title"><slot name="title"></slot></a><div class="drogDiv" ><slot name="drop"></slot></div></li>',
  data () {
    return {
      actived: false
    }
  },
  methods: {
    show (event) {
      this.actived = true
      $(event.target).children('div').slideDown(50)
    },
    hide (event) {
      $(event.target).children('div').slideUp(50)
      this.actived = false
    }
  }
}

export default {
  data () {
    return {
      loginInfo: {},
      header: {},
      leftside: {
        items: [],
        width: 150
      }
    }
  },
  components: {
    dropMenus,
    menuItem,
    leftSide
  },
  computed: {
    autoWidth () {
      return (1200 - this.leftside.width) + 'px'
    }
  },
  created () {
    // 获取当前vue对象
    let v = this
    // 中心页面跳转到首页
    router.push('/Home')
    // 设置头信息 header
    http.$setHeadersFromLocal()
    //  初始化个人信息
    http.$getP(adminUrl + '/admin_main.do', {'accountname': http.getUser()}).then(res => {
      v.loginInfo = res.data
    }).catch(err => { console.log(err) })
  },
  methods: {
    focusONAvatar (ev) {
      console.log(ev.target)
      let a = $(ev.target).children('a').children('div')
      a.animate({
        width: '60px',
        height: '60px',
        left: '30px'
      }, 'fast')
      let d = $(ev.target).children('a').children('div').children('img')
      d.animate({
        border: '2 solid #fff'
      }, 'fast')
    },
    leaveAvatar (ev) {
      let a = $(ev.target).children('a').children('div')
      a.animate({
        width: '36px',
        height: '36px',
        left: '40px'
      }, 'fast')
      let d = $(ev.target).children('a').children('div').children('img')
      d.animate({
        border: '0 solid #fff'
      }, 'fast')
    },
    widthChange (width) {
      this.leftside.width = width
    }
  }
}
</script>

<style>
.el-header{
  background-color: #23262E;
  line-height: 60px;
  text-align: center;
  padding: 0 0;
}
.el-header>div{
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

.main-container, .left-side-container {
  float: left;
  height: 650px;
}

.main-container-main {
  height: 95%;
}

.foot-container {
  width: 100%;
  height: 10px;
  text-align: center;
}

.nickname{
  color: #fb7299!important;
  margin-bottom: 8px;
}

</style>
