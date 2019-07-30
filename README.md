# chat-room

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


# Questions record
## 1.input type="file" 更改默认样式
<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/1.png?raw=true" width=250>

可以看到 input type="file" 会自动显示 "未选择任何文件" 字样，我们需要把这个去掉
``` html
<label for="sendImage" class="imageLable">
   <input type="button" value="image"  />
   <input id="sendImage" type="file" value="image"/> <!--定义类型为file即可让用户选择文件-->
</label>
```

只需要加一个 label，然后让上传文件的这个 input 与 button 重叠，opacity 置为 0 即可
``` css
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
```

## 2.如何渲染信息?
首先分析一条消息由哪几部分组成

<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/2.png?raw=true" width=200px>

用户名：可能为 system 或者自己/其他人注册的用户名；

时间信息：时、分、秒

内容：单张图片/文字 + emoji

单张图片统一换行显示

文字和 emoji 在同一行显示，如果超出一行则换行

## 3.如何发送消息?
textarea 按下 enter 键即触发与 send 相同的功能

点击 send Button 将消息加入到 historyMessage 并在屏幕上显示

## 4.如何发送图片?
选择图片会触发 change 事件，观察其 event 对象

<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/3.png?raw=true" width=200px>

e.target.files[0] 可以获取到被选中的图片路径,通过 H5 文件读取 API 来读取文件

``` javaScript
// 选择图片时触发
chooseImage(e) {
  // 检查是否有文件被选中
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
      time: new Date().toTimeString().substr(0, 8),
      content: `<img src="${imageData}" style="width:100%">`, // 本来想把style写在css里的发现无法选择到img
      ifImage: true
    })
    _this.$socket.emit('postImg', imageData)
  }
}
```

## 5.图片动态绑定 src 的问题
注意要用 require 来加载图片,否则无法显示

``` javaScript
generateEmojiSrc(index) {
  return require(`../../public/emoji/${index}.gif`)
}
```

``` html
<div class="emoji-wrapper" v-show="ifChooseEmoji">
  <div class="emoji-item-wrapper" v-for="n in emojiNumbers" :key="n"
       @click="chooseEmoji(n)">
    <img :src="generateEmojiSrc(n)" :title="n">
  </div>
 </div>
```

## 6.如何发送 emoji?
目前采取的措施是选择 emoji 表情后在输入框显示 `[emoji:index]` 字样，发送后再显示 emoji 图片；

更好的方法是选择 emoji 后输入框也同样能显示表情，如何做到?


## 7.vue-socket.io
![vue-socket.io]https://github.com/MetinSeylan/Vue-Socket.io

Vue 使用 socket.io，怎么用的官方介绍得很清楚了

服务端使用 socket.io 注意下
1. socket.send()发送消息是为了给自己（当前客户端）看的
2. io.emit()发送消息是给所有人看的
3. socket.broadcast.emit() 发送消息除了该 socket 对应的客户端外，其他客户端都能看到

## 8.快速获取日期时分秒
``` javaScript
time: new Date().toTimeString().substr(0, 8)
```

## 9.npm run build 遇到的问题
<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/8.png?raw=true" width=150px>

<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/9.png?raw=true" width=100px>

vue.config.js 直接把 publicPath 设置为"./"

这个问题具体要看报错的路径，然后对着改路径就好

然后注意使用 vue.socket.io 时路径要写全

``` javaScript
Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://47.100.203.67:3301', // options object is Optional
  vuex: {
      store,
      actionPrefix: 'SOCKET_', // what?
      mutationPrefix: 'SOCKET_'
  }
  // options: { path: "/my-app/" } // Options object to pass into SocketIO
}))
```

## 10.centOS 让服务在后台运行
node server.js &

后面加个'&'即可，如何关闭?

<a href="https://www.cnblogs.com/kaituorensheng/p/3980334.html">Linux 命令</a>

找出进程 id，kill 掉即可
