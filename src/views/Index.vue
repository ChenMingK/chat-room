<template>
  <div class="container">
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
            <input type="button" value="emoji" title="emoji">
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
               placeholder="请输入用户名">
        <input class="mask-messages-confirmBtn" type="button" @click="confirmUserName"
               value="确认">
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  data: function() {
    return {
      onlineNumbers: 0, // 在线人数
      username: '老王',
      ifLogin: true,
      defaultContentColor: '#000', // 文字默认颜色，选择颜色后改变该值
      historyMessages: [
        {
          username: 'user1',
          time: '22:22:22',
          content: 'Hello~',
          contentColor: '#000',
          ifImage: false
        },
        {
          username: 'user2',
          time: '22:22:23',
          content: 'Hello~lo~',
          contentColor: '#000',
          ifImage: false
        }
      ], // 一条消息由什么组成?
      textareaContent: ''
    }
  },
  methods: {
    // 清空内容
    clearMessages() {
      this.historyMessages = []
    },
    // 颜色?获取?加到文字上
    chooseColor(e) {
      console.log(e.target.value) // 颜色#xxxxxx
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
      }
    },
    // 确认用户名
    confirmUserName() {
      this.ifLogin = true
    },
    // 发送消息
    sendMessage() {
      this.historyMessages.push({
        username: this.username,
        time: this.transferTime(),
        content: this.textareaContent,
        contentColor: this.defaultContentColor
      })
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

  }
  
</style>
