<template>
    <div class="loginbody">
      <div class="logindiv">
        <div class="title">
          <label id="webName" :class="{a_click: selectStatus}" @click="changeStatus">
            {{selected.name}}
          </label>
          <div class='seContent' data-status='0'>
            <ul><li v-for="(l,index) in list" :key="index" @click="changeSelected(l)">{{l.name}}</li></ul>
          </div>
          <!-- <select id="target" name="target" class="tar_web">
            <option v-for="(o,index) in list" :key="index" :value="o.code">
              {{o.name}}
            </option>
          </select> -->
          <div class="loginSwitch" @click="changeLoginType"><i class="el-icon-full-screen"></i></div>
        </div>
        <div class="contentdiv">
          <div class="tip">{{errorMess}}</div>
          <template v-if="loginType">
            <div class="uNameDiv">
              <i><img src="../static/icons/user.png" width='30px' height='30px'/></i>
              <input @focus="errorMess = ''" v-model="params.username" type="text" name="username" class="inputClass"/>
            </div>
            <div class="uNameDiv">
              <i><img src="../static/icons/locked.png" width='30px' height='30px'/></i>
              <input @focus="errorMess = ''" v-model="params.password"  type="password" name="password" class="inputClass" />
            </div>
            <div class="footdiv">
              <a @click="login" class="button small blue">&nbsp;登&nbsp;&nbsp;陆&nbsp;</a>
            </div>
          </template>
          <template v-else>
            <div class="qrCodeDiv">
               <el-image style="width: 150px; height: 150px" :src="url" fit="fill"></el-image>
            </div>
          </template>
        </div>
      </div>
      <div style="position: absolute; bottom: 600px;width: 100%;padding: 0 100px;">
        caiyangzhigod.xyz&nbsp;&nbsp;版权所有ICP证&nbsp;&nbsp;<a target="_blank" style="color: blue" href="http://www.beian.miit.gov.cn">粤ICP备19060959号-1</a>
      </div>
    </div>
</template>

<script>
import http from './http'
import {baseUrl, ouserUrl, qrCodeUrl} from './base_variable'
import $ from 'jquery'

var socket

export default {
  data () {
    return {
      list: [],
      selected: {},
      params: {
        username: null,
        password: null,
        code: null
      },
      selectStatus: false,
      errorMess: '',
      loginType: true,
      url: ''
    }
  },
  mounted () {
  },
  created () {
    let Login = this
    http.$get(baseUrl + '/api/webMessage/weblist.do').then(function (response) {
      Login.list = response.data
      if (Login.list[0]) {
        Login.selected = Login.list[0]
        Login.params.code = Login.selected.code
      }
    })
  },
  methods: {
    changeStatus () {
      this.selectStatus = !this.selectStatus
      if (this.selectStatus) {
        $('.seContent').slideDown('slow')
      } else {
        $('.seContent').slideUp('fast')
      }
    },
    changeSelected (l) {
      $('.seContent').slideUp('fast')
      this.selectStatus = false
      this.selected = l
      this.params.code = l.code
    },
    login () {
      let Login = this
      // http.$postP(adminUrl + '/loginAsyn.do', JSON.stringify(Login.params)).then(response => {
      let param = new URLSearchParams()
      param.append('username', Login.params.username)
      param.append('password', Login.params.password)
      param.append('code', Login.params.code)
      http.$axiosPost(ouserUrl + '/login', param).then(response => {
        let data = response
        console.log(data)
        localStorage.setItem('X-user', data.username)
        localStorage.setItem('X-token', data.details.token)
        // window.location.href = response.data.target
        Login.$router.push('home')
      }).catch(err => {
        Login.errorMess = err.message
      })
    },
    changeLoginType () {
      this.loginType = !this.loginType
      this.openSocket()
    },
    openSocket () {
      let v = this
      if (typeof (WebSocket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        console.log('您的浏览器支持WebSocket')
        // 实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        // 等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        // var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        let socketUrl = baseUrl + '/qrcode/login'
        socketUrl = socketUrl.replace('https', 'ws').replace('http', 'ws')
        console.log(socketUrl)
        if (socket != null) {
          socket.close()
          socket = null
        }
        socket = new WebSocket(socketUrl)
        // 打开事件
        socket.onopen = function () {
          console.log('websocket已打开')
          // socket.send("这是来自客户端的消息" + location.href + new Date());
        }
        // 获得消息事件
        socket.onmessage = function (msg) {
          let data = JSON.parse(msg.data)
          console.log(data)
          // 发现消息进入    开始处理前端触发逻辑
          if (data.type === '1') {
            v.url = qrCodeUrl + '/loginCode?userId=' + data.data
            console.log('二维码链接：', v.url)
          } else {

          }
        }
        // 关闭事件
        socket.onclose = function () {
          console.log('websocket已关闭')
        }
        // 发生了错误事件
        socket.onerror = function () {
          console.log('websocket发生了错误')
        }
      }
    }
  }
}

// function sendMessage () {
//   if (typeof (WebSocket) === 'undefined') {
//     console.log('您的浏览器不支持WebSocket')
//   } else {
//     console.log('您的浏览器支持WebSocket')
//     socket.send('{"toUserId":"111","contentText":"22ddds"}')
//   }
// }
</script>

<style scoped>
.loginbody{
  background-image: url(../static/background.jpg);
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 200px;
}

ul,li{
  padding: 0px;
  margin: 0px;
}

li{
  list-style: none;
}

.logindiv{
  width: 300px;
  height: 400px;
  background-color: rgba(100,100,100,0.2);
  margin: 0 auto;
  border-radius: 20px;
  border: 1px solid #fff;
  box-shadow: 2px 2px 30px 10px rgba(34, 25, 25, 0.2);
}

.title{
  width: 100%;
  height: 60px;
  text-align: center;
  border-bottom: 1px solid #fff;
  box-shadow: 0 2px 0 2px rgba(34, 25, 25, 0.2);
  line-height: 60px;
  position: relative;
  background-color:transparent; /* 因为打包后css混合在一起，存在其它得title类对背景色进行冲突，所以使用此属性(使背景色透明)解决 */
}

.tar_web{
  display: none;
}

#webName{
  padding: 10px;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: #fff;
}

#webName,ul li:hover{
  cursor: pointer;
}

.seContent ul{
  padding: 10px;
}

.seContent ul li:hover{
  background-color: rgba(255,255,255,0.6);
  color: #fff;
}

.a_click{
  border: 1px solid #436EEE;
  border-radius: 10px;
  box-shadow: 2px 2px 10px  rgba(34, 25, 25, 0.2) inset;
}

.seContent{
  position: absolute;
  top: 56px;
  left: 62px;
  width: 171.58px;
  height: 200px;
  background-color: rgba(100,100,100,0.3);
  border-radius: 10px;
  display: none;
  overflow: auto;
}

.seContent ul li{
  line-height: 30px;
  color: #ddd;
  margin-top: 5px;
}

.contentdiv{
  width: 100%;
  position: relative;
}

.uNameDiv{
  width: 220px;
  height: 45px;
  border: 1px solid;
  margin: auto;
  margin-top: 50px;
  border-radius: 5px;
  background-color:  rgba(100,100,100,0.2);
  box-shadow: 2px 2px 20px  rgba(34, 25, 25, 0.2) inset;
  line-height: 45px;
}

i{
  height: 100%;
  width: 40px;
  margin-left: 10px;
}

.inputClass{
  margin-top: 2px;
  padding: 0;
  height: 40px;
  width: 170px;
  float: right;
  border: 0;
  background-color: transparent;
  font-size: 18px;
  color: #fff;
}

.footdiv{
  line-height: 100px;
  width: 100%;
  text-align: center;
}

.tip{
  position: absolute;
  top: -30px;
  left: 10px;
  color: red;
  font-size: 16px;
}

.loginSwitch {
  position: absolute;
  right: 0;
  bottom: -50px;

}

.qrCodeDiv {
  width: 100%;
  display: flex;
  justify-content: center;
}

.qrCodeDiv .el-image {
  margin-top: 100px;
}
</style>
