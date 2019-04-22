const express = require('express')
const app = express()
const server = require('http').createServer(app) // ???
const io = require('socket.io').listen(server)
let users = []
// console.log(__dirname)
// 指定静态HTML文件的位置，浏览器访问8080端口则使用路由作为首页
// app.use('/', express.static(__dirname + '/www')) 
// 静态文件前端打包后放过来?
server.listen(3001)

// 建立socket连接后的回调,每次建立的socket都是不同的?参数?
io.on('connection', function(socket) { 
  console.log('client has connected!')
  socket.on('login', function(nickName) {
    // do something after the event 'login'
    // 检验用户名是否已存在
    console.log('login event')
    if (users.indexOf(nickName) > -1) {
      socket.emit('nickExisted')
    } else {
      socket.userIndex = users.length
      socket.nickName = nickName
      users.push(nickName)
      // 向当前建立连接的客户端发送'loginSuccess'事件
      socket.emit('loginSuccess')
      // 向所有连接到服务器的客户端发送当前登录用户的昵称
      io.sockets.emit('newsSystem', nickName, users.length, 'login')
    }
  })
  // 监听断开事件
  socket.on('disconnet', () => {
    users.splice(socket.userIndex, 1)
    // socket.broadcast和io.sockets.emit的区别？有几种广播形式？
    socket.broadcast.emit('newsSystem', socket.nickName, users.length, 'logout')
  })
  //接收到消息
  socket.on('postMsg', (msg, color) => {
    // 将消息发送给其他用户
    socket.broadcast.emit('newsMsg', socket.nickName, msg, color)
  })
  // 接受并处理用户发送的图片
  socket.on('postImg', (imgData) => {
    // 通过一个newImg事件给其他用户
    socket.broadcast.emit('newsImg', socket.nickName, imgData)
  })

})