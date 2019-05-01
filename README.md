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


## Questions record
- [3.如何发送图片?](#3.如何发送图片?)
### 1.input file="type"更改默认样式
<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/1.png?raw=true" width=250>

可以看到input type=”file”会自动显示“未选择任何文件”字样，我们需要把这个去掉
``` html
<label for="sendImage" class="imageLable">
   <input type="button" value="image"  />
   <input id="sendImage" type="file" value="image"/> <!--定义类型为file即可让用户选择文件-->
</label>
```

只需要加一个label，然后让上传文件的这个input与button重叠，opacity置为0即可
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

### 2.如何渲染信息?
首先分析一条消息由哪几部分组成

<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/2.png?raw=true" width=200px>

用户名：可能为system或者自己/其他人注册的用户名；

时间信息：时、分、秒

内容：单张图片/文字+emoji

单张图片统一换行显示

文字和emoji在同一行显示，如果超出一行则换行

### 3.如何发送消息?
textarea按下enter键即触发与send相同的功能

点击send Button将消息加入到historyMessage并在屏幕上显示

### 4.如何发送图片?
选择图片会触发change事件，观察其event对象

<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/3.png?raw=true" width=200px>

e.target.files[0]可以获取到被选中的图片路径,通过H5文件读取API来读取文件

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

### 5.图片动态绑定src的问题
注意要用require来加载图片,否则无法显示

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

### 6.如何发送emoji?
目前采取的措施是选择emoji表情后在输入框显示[emoji:index]字样，发送后再显示emoji图片；

更好的方法是选择emoji后输入框也同样能显示表情，如何做到?

### TODO:7.emoji去除重叠边框?
<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/4.png?raw=true" width=200px>

可以看到图中的边框有问题，图片是这么渲染的

``` html
<div class="emoji-wrapper" v-show="ifChooseEmoji">
  <div class="emoji-item-wrapper" v-for="n in emojiNumbers" :key="n"
       @click="chooseEmoji(n)">
    <img :src="generateEmojiSrc(n)" :title="n">
  </div>
</div>
```

目前只是让所有图片margin-left:-1px margin-top:1px (border:2px)

所有非第一行的margin-top：-1px,所有非第一列的margin-left：-1px?

利用选择器来实现
nth-child(2n-1)表示选择奇数标签，即第1、3、5、7

nth-child(n+3)表示选择从第3个标签开始到最后

nth-child(-n+3)表示选择小于等于3的标签(0~3)

......试了下貌似还是不行

### 8.vue-socket.io
![vue-socket.io]https://github.com/MetinSeylan/Vue-Socket.io

Vue使用socket.io，怎么用的官方介绍得很清楚了

服务端使用socket.io注意下
1. socket.send()发送消息是为了给自己（当前客户端）看的
2. io.emit()发送消息是给所有人看的
3. socket.broadcast.emit()发送消息除了自己都能看到

### 9.快速获取日期时分秒
``` javaScript
time: new Date().toTimeString().substr(0, 8)
```

### 10.npm run build遇到的问题
<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/8.png?raw=true" width=150px>

<img src="https://github.com/ChenMingK/chat-room/blob/master/QuestionImgs/9.png?raw=true" width=100px>

vue.config.js直接把publicPath设置为"./"

这个问题具体要看报错的路径，然后对着改路径就好

然后注意使用vue.socket.io时路径要写全

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

### 11.centOS让服务在后台运行
node server.js &

后面加个'&'即可，如何关闭?

![linux命令]https://www.cnblogs.com/kaituorensheng/p/3980334.html

找出进程id，kill掉即可
