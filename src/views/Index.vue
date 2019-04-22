<template>
  <div class="container">
    <!-- <img src="../../public/emoji/1.gif" style="width: 100px; height:100px;"> -->
    <div class="chatroom-wrapper">
      <div class="chatroom-banner-wrapper">
        <div class="chatroom-banner-welcome-wrapper">
          <span class="chatroom-banner-welcome">Welcome</span>
        </div>
        <div class="chatroom-banner-status-wrapper">
          <span class="chatroom-banner-status">{{`${onlineNumbers} user online`}}</span>
        </div><!--显示在线人数-->
      </div><!--标语-->
      <div class="chatroom-messages-wrapper">
        <div class="chatroom-messages" v-for="(item, index) in historyMessages" :key="index">
          <span class="chatroom-messages-username">{{item.username}}</span>
          <span class="chatroom-messages-time">({{item.time}}):</span>
          <div class="img-wrapper" v-if="item.ifImage" v-html="item.content">{{item.content}}</div>
          <span class="chatroom-messages-content"
                :style="{color: item.contentColor}"
                v-else>{{item.content}}</span>
        </div>
      </div><!--消息显示部分-->
      <div class="chatroom-controls-wrapper">
        <div class="chatroom-controls-selects-wrapper">
          <div class="chatroom-controls-selects-color-wrapper">
            <input class="colorInput" type="color" placeholder="#000" title="font-color"
                   @change="chooseColor"><!--color类型可让用户选择颜色-->
          </div>
          <div class="chatroom-controls-selects-emoji-wrapper">
            <input type="button" value="emoji" title="emoji"
                   @click="showEmoji">
          </div>
          <div class="chatroom-controls-selects-image-wrapper">
            <label for="sendImage" class="imageLable">
                <input class="sendImageBtn" type="button" value="image"/>
                <input id="sendImage" type="file" @change="chooseImage"/> <!--定义类型为file即可让用户选择文件-->
            </label>
          </div>
          <div class="chatroom-controls-selects-clear-wrapper">
            <input type="button" value="clear" title="clear screen" @click="clearMessages">
          </div>
        </div>
        <div class="chatroom-controls-inputarea-wrapper">
          <div class="chatroom-controls-inputarea-textarea-wrapper">
            <textarea class="textarea" placeholder="enter to send" v-model="textareaContent"
                      @keydown.enter="sendMessage"></textarea>
          </div>
          <div class="chatroom-controls-inputarea-sendbutton-wrapper">
            <input class="sendBtn" type="button" value="SEND"
                  @click="sendMessage">
          </div>
        </div>
      </div><!--底部-->
    </div>
    <div class="mask" v-if="!ifLogin">
      <div class="mask-messages-wrapper">
        <input class="mask-messages-inputUserName" type="text" v-model="username"
               placeholder="请输入用户名"
               ref="usernameInput">
        <input class="mask-messages-confirmBtn" type="button" @click="confirmUserName"
               value="确认">
      </div>
    </div>
    <div class="emoji-wrapper" v-show="ifChooseEmoji">
      <div class="emoji-item-wrapper" v-for="n in emojiNumbers" :key="n"
           @click="chooseEmoji(n)">
        <img :src="generateEmojiSrc(n)" :title="n">
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  data: function () {
    return {
      onlineNumbers: 0, // 在线人数
      username: '',
      ifLogin: false,
      ifChooseEmoji: false,
      defaultContentColor: '#000', // 文字默认颜色，选择颜色后改变该值
      historyMessages: [
        /* {
          username: 'user1',
          time: '22:22:22',
          content: 'Hello~',
          contentColor: '#000',
          ifImage: false
        }, */
      ], // 一条消息由什么组成?
      textareaContent: '',
      emojiNumbers: 30
    }
  },
  sockets: {
    connect: function () {
      // console.log('socket connected')
    },
    customEmit: function (data) {
      // console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    },
    // 收到服务器的'登录成功'事件
    loginSuccess: function () {
      // 去掉蒙版
      this.ifLogin = true
    },
    // 用户名已存在
    nickExisted: function() {
      alert('用户名已存在')
      this.username = ''
      this.$refs.usernameInput.focus()
    },
    
    // 收到'系统提示'事件，如其他用户登录、登出了
    // socket.io把参数封装成一个数组了
    newsSystem: function (data) {
      // 1.显示某用户登录、登出的信息 2.在线人数增加/减少
      const [user, totalUsers, type] = data // 解构赋值
      this.onlineNumbers = totalUsers
      if (type === 'login') {
        this.displayMessage('system', this.transferTime(), `${user}加入了聊天室`, 'red')
      } else if (type === 'disconnet') {
        this.displayMessage('system', this.transferTime(), `${user}离开了聊天室`, 'red')
      }   
    },
    // 收到'发送消息'事件，如其他用户发送了文字
    newsMsg: function (data) {
      const [user, msg, color] = data
      this.displayMessage(user, this.transferTime(), msg, color)
    },
    // 收到'发送图片'事件 
    newsImg: function (data) {
      const [user, imgData] = data
      this.displayMessage(user, this.transferTime(), `<img src="${imgData}" style="width:100%">`, '#000', true)
    } 
  },
  methods: {
    /*
    clickButton: function (data) {
            // $socket is socket.io-client instance
            this.$socket.emit('emit_method', data)
    }, */
    // 将添加消息整合成一个方法
    displayMessage(username, time, content, contentColor, ifImage = false) {
      this.historyMessages.push({
        username: username,
        time: time,
        content: content,
        contentColor: contentColor,
        ifImage: ifImage
      })
    },
    chooseEmoji(index) {
      console.log(index)
      this.ifChooseEmoji = !this.ifChooseEmoji
      this.textareaContent = this.textareaContent + `[emoji:${index}]`
    },
    generateEmojiSrc(index) {
      return require(`../../public/emoji/${index}.gif`)
    },
    // 清空内容
    clearMessages() {
      this.historyMessages = []
    },
    // 点击emoji时触发,需要emoji用v-show
    showEmoji(e) {
      this.ifChooseEmoji = !this.ifChooseEmoji
    },
    // 颜色?获取?加到文字上
    chooseColor(e) {
      // console.log(e.target.value) // 颜色#xxxxxx
      this.defaultContentColor = e.target.value
    },
    // 选择图片时触发
    chooseImage(e) {
      // 检查是否有文件被选中
      // console.log(e.target.files[0])
      let _this = this
      let file = e.target.files[0]
      let reader = new FileReader()
      if (file && file.type.match('image.*')) {
        reader.readAsDataURL(file)
      } else {
        // not image
      }
      // 注意是异步读取
      reader.onloadend = function(e) {
        // do something after read image
        // console.log(reader.result) // a blob ? 
        let imageData = reader.result
        _this.historyMessages.push({
          username: _this.username,
          time: new Date().toTimeString().substr(0, 8), // what?
          content: `<img src="${imageData}" style="width:100%">`, // 本来想把style写在css里的发现无法选择到img
          ifImage: true
        })
        _this.$socket.emit('postImg', imageData)
      }
    },
    // 确认用户名
    confirmUserName() {
      // this.ifLogin = true
      // socket:用户名&登录
      this.$socket.emit('login', this.username)
    },
    // 发送消息
    sendMessage() {
      this.historyMessages.push({
        username: this.username,
        time: this.transferTime(),
        content: this.textareaContent,
        contentColor: this.defaultContentColor
      })
      // 需要把消息传递给服务器,参数:文字内容,文字颜色 ---不需要用户名
      this.$socket.emit('postMsg', this.textareaContent, this.defaultContentColor)
      this.textareaContent = ''
    },
    transferTime() {
      let date = new Date()
      let hours = '' + date.getHours()
      hours = hours.length > 1 ? hours : '0' + hours
      let minutes = '' + date.getMinutes() // change to String
      minutes = minutes.length > 1 ? minutes : '0' + minutes
      let seconds = '' + date.getSeconds()
      seconds = seconds.length > 1 ? seconds : '0' + seconds
      return hours + ':' + minutes + ':' + seconds
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@/assets/styles/mixin.scss";
  .container {
    .chatroom-wrapper {
        width: 500px;
        height: 650px;
        margin: 0 auto;
        background: #ccc;
        position: relative;
        padding: 5px;
        .chatroom-banner-wrapper {
          width: 100%;
          height: 100px;
          position: relative;
          background: #ccc;
          .chatroom-banner-welcome-wrapper {
            position: absolute;
            top: 30px;
            font-size: 24px;
            font-weight: bold;
            .chatroom-banner-welcome {

            }
          }
          .chatroom-banner-status-wrapper {
              position: absolute;
              top: 70px;
            .chatroom-banner-status {

            }
          }
        }
        .chatroom-messages-wrapper {
          width: 100%;
          height: 400px;
          overflow-y: scroll;
          background: white;
          position: relative;
          // 去掉滚动条
          &::-webkit-scrollbar {
            display: none;
          }
          .chatroom-messages {
            position: relative;
            width: 90%;
            margin-bottom: 10px;
            
            .chatroom-messages-username {
              
            }
            .chatroom-messages-time {
              padding-left: 2px;
            }
            .chatroom-messages-content {
              padding-left: 5px;
            }
            .img-wrapper {
                position: relative;
                left: 0;
                width: 200px;
                box-sizing: border-box;
                padding: 5px 0 0 5px;
              }
          }
        }
        .chatroom-controls-wrapper {
          width: 100%;
          height: 150px;
          background: #ccc;
          position: relative;
          .chatroom-controls-selects-wrapper {
            width: 100%;
            height: 30px;
            display: flex;
            position: relative;
            .chatroom-controls-selects-color-wrapper {
              flex: 0 0 50px;
              width: 50px;
              height: 100%;
              overflow: hidden;
              @include center;
              .colorInput {
                border: none;
                padding: 0;
                background-color:white; // 去掉灰色背景
              }
            }
            .chatroom-controls-selects-emoji-wrapper {
              flex: 0 0 50px;
              width: 50px;
              height: 100%;
              margin-left: 2px;
              box-sizing: border-box;
              overflow: hidden;
              @include center;
            }
            .chatroom-controls-selects-image-wrapper {
              position: relative;
              flex: 0 0 50px;
              width: 50px;
              height: 100%;
              margin-left: 2px;
              box-sizing: border-box;
              overflow: hidden;
              @include center;
              .imageLable {
                width: 100%;
                height: 100%;
                @include center;
              }
              #sendImage {
                width: 100%;
                position: absolute;
                top: 0;
                opacity: 0;
              }
            }
            .chatroom-controls-selects-clear-wrapper {
              flex: 0 0 50px;
              width: 50px;
              height: 100%;
              margin-left: 2px;
              box-sizing: border-box;
              @include center;
            }
          }
          .chatroom-controls-inputarea-wrapper {
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: space-between;
            .chatroom-controls-inputarea-textarea-wrapper {
              flex: 0 0 87%;
              height: 100%;
              .textarea {
                width: 100%;
                height: 100%;
              }
            }
            .chatroom-controls-inputarea-sendbutton-wrapper {
              flex: 0 0 10%;
              height: 106px;
              .sendBtn {
                height: 100%;
              }
            }
          }
        }
    }
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: #ccc;
      opacity: .8;
      @include center;
      .mask-messages-wrapper {
        @include center;
        background: white;
        .mask-messages-inputUserName {
          height: 24px;
          box-sizing: border-box;
          background: transparent;
        }
        .mask-messages-confirmBtn {
          height: 24px;
          box-sizing: border-box;
          font-weight: bold;
          @include center;
        }
      }
    }
    .emoji-wrapper {
      position: absolute;
      width: 250px;
      bottom: 128px;
      left: 120px;
      display: flex;
      flex-wrap: wrap;
      z-index: 100;
      .emoji-item-wrapper {
        width: 30px;
        height: 30px;
        @include center;
        box-sizing: border-box;
        border: 1px solid #ccc;
        margin-top: -1px;
        margin-left: -1px;
        img {
          width: 100%;
        }
      }
    }
  }
  
</style>
