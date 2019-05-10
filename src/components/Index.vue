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
    <el-container>
      <el-aside :width="leftside.width">
        <div class="left-side-container">
          <div class="lef-side-icon" :style="{width: leftside.icon}"><el-button type="success" id="displayButton" size="mini" class="el-icon-d-arrow-left" @click="hideOrShow"></el-button></div>
          <div class="left-side">
            <ul v-show="leftside.visable" class="ul-item">
              <side-menu v-for="(menu,index) in leftside.items" v-bind:menu="menu" :key="index" ></side-menu>
            </ul>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-main><router-view></router-view></el-main>
        <el-footer style="text-align: center" height="10px">
          © 2019-2020 聊天鬼才 . All rights reserved.
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import $ from 'jquery'
import http from './../http'
import {adminUrl, resouUrl} from './../base_variable'
import sideMenu from './SideMenu'
import router from './../router'

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
        width: "200px",
        icon: '20%',
        visable: true
      }
    }
  },
  components: {
    dropMenus,
    menuItem,
    sideMenu
  },
  created () {
    // 获取当前vue对象
    let v = this
    // 中心页面跳转到首页
    router.push('/Home')
    // 设置头信息 header
    http.$setHeadersFromLocal()
    //  初始化个人信息
    http.$get(adminUrl + '/admin_main.do',
      {'accountname': http.getUser()}).then(function (response) {
      if (response.status === 200) {
        v.loginInfo = response.data
        console.log(v.loginInfo)
      }
    }, function (error) {
      console.log(error)
    })
    //  初始化左侧列表
    http.$get(resouUrl + '/resources.re').then(function (response) {
      if (response.status === 200) {
        console.log(v.leftside)
        v.leftside.items = response.data
      } else {
        console.log(response.message)
      }
    })
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
    hideOrShow () {
      let v = this
      console.log(v.leftside.width)
      v.leftside.visable = !v.leftside.visable
      if (v.leftside.visable) {
        v.leftside.icon = "20%"
      }
      $('.left-side').animate({width: 'toggle'}, 500, function () {
         $('.left-side-container').toggleClass('left-side-style')
         v.leftside.width = v.leftside.visable ? '200px' : '40px'
         if (!v.leftside.visable) {
           v.leftside.icon = "90%"
         }
      })
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

.left-side-container {
  height: 650px;
}

.left-side-container > div {
  float: left;
  height: 100%;
  background:rgb(35, 38, 46, 0.9);
}

.lef-side-icon {
  position: relative;
}

.left-side-style {
}

/**
*侧边导航栏的样式
*/
.left-side{
  font-size: 16px;
  width: 80%;
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

.ul-item a:hover{
  cursor: pointer;
  opacity: .8;
  background-color: #c2c2c2;
  color: #303133;
}

.ul-item li a{
  /* width: 190px; */
  /* width: 100%; */
  height: 50px;
  display: block;
  line-height: 50px;
  font-size: 16px;
  color: #fff;
  padding: 0 0 0 10px;
}

.ul-item li dl a{
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.nickname{
  color: #fb7299!important;
  margin-bottom: 8px;
}
</style>
