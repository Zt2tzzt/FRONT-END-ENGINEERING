# 指令（三）双向绑定-组件化开发-Vue-CLI

## 一、v-model 指令

表单提交，是开发中，非常常见的功能，也是和用户交互的重要手段：

- 比如：用户在登录、注册时，需要提交账号密码；
- 比如：用户在检索、创建、更新信息时，需要提交一些数据；

这要求我们可以在代码逻辑中，获取到用户提交的数据，我们通常会使用 `v-model` 指令来完成：

- `v-model` 指令可以在表单 input、textarea 以及 select 元素上，创建**双向数据绑定**；
- 它会根据控件类型，自动选取正确的方法来更新元素；

尽管看上去有些神奇，但 v-model 本质上是语法糖，它负责监听用户的输入事件，来更新数据，并在某种极端场景下进行一些特殊处理；

### 1.v-model 基本使用

```html
<body>
  <div id="app">
    <!-- 在 input 中实现 v-model 的原理
			1. v-bind value 的绑定
			2. 监听 input 事件, 更新 message 的值	-->
    <input type="text" :value="message" @input="event => message = event.target.value" />
    <!-- 等价于 -->
    <input type="text" v-model="message" />
  </div>

  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const app = {
      data() {
        return {
          message: 'Hellow World'
        }
      }
    }
    Vue.createApp(app).mount('#app')
  </script>
</body>
```

v-model 可在以下表单元素上使用：

- input（checkbox（单选，多选），radio）元素；
- textarea 元素；
- select 元素。

`<input>` 的类型为 `checkout`，`radio` 且有 `v-model` 指令时，

- `name` 属性（用于做提交时获取 query 字符串的 key）可以省略。将由 v-model 指令的值，代替

```html
<body>
  <div id="app">
    <!-- 1.绑定 textarea -->
    <label for="intro">
      自我介绍
      <textarea id="intro" name="intro" cols="30" rows="10" v-model="intro"></textarea>
    </label>
    <h2>intro: {{intro}}</h2>

    <!-- 2.input checkbox -->
    <!-- 2.1. 单选框  v-model 绑定的是布尔值。此时 input 的 value 属性并不影响 v-model 的值。-->
    <label for="agree"> <input id="agree" type="checkbox" v-model="isAgree" /> 同意协议 </label>
    <h2>单选框: {{isAgree}}</h2>

    <!-- 2.2. 多选框，当有多个复选框时，因为可以选中多个，所以对应的 data 中属性是一个数组。当选中某一个时，就会将 input 的 value 添加到数组中。 -->
    <span>你的爱好:</span>
    <label for="sing">
      <input id="sing" type="checkbox" value="sing" v-model="hobbies" /> 唱
    </label>
    <label for="jump">
      <input id="jump" type="checkbox" value="jump" v-model="hobbies" /> 跳
    </label>
    <label for="rap">
      <input id="rap" type="checkbox" value="rap" v-model="hobbies" /> rap
    </label>
    <label for="basketball">
      <input id="basketball" type="checkbox" value="basketball" v-model="hobbies" /> 篮球
    </label>
    <h2>hobbies: {{ hobbies }}</h2>

    <!-- 3.input radio -->
    <span>你的性别: </span>
    <label for="male">
      <input id="male" type="radio" value="male" v-model="gender" /> 男
    </label>
    <label for="female">
      <input id="female" type="radio" value="female" v-model="gender" /> 女
    </label>
    <h2>性别: {{ gender }}</h2>

    <!-- 4.select -->
    <!-- 4.1. 单选，只能选中一个值，v-model 绑定的是一个值； -->
    <label for="fruit">
      <select id="fruit" name="fruit" v-model="fruit">
        <option value="apple">苹果</option>
        <option value="orange">橘子</option>
        <option value="banana">香蕉</option>
      </select>
    </label>
    <h2>单选水果: {{fruit}}</h2>

    <!-- 4.2. 多选，可以选中多个值，v-model 绑定的是一个数组；当选中多个值时，就会将选中的 option 对应的 value 添加到数组 fruits 中；-->
    <span>喜欢的水果:</span>
    <label for="fruits">
      <select id="fruits" name="fruits" multiple size="2" v-model="fruits">
        <option value="apple">苹果</option>
        <option value="orange">橘子</option>
        <option value="banana">香蕉</option>
      </select>
    </label>
    <h2>多选水果: {{fruits}}</h2>
  </div>

  <script src="https://unpkg.com/vue@next"></script>
  <script>
    const app = {
      template: '#my-app',
      data() {
        return {
          intro: 'Hello World',
          isAgree: false,
          hobbies: ['basketball'],
          gender: 'male',
          fruit: '', // 默认不选中
          fruits: []
        }
      }
    }
    Vue.createApp(app).mount('#app')
  </script>
</body>
```

### 2.v-model 结合值绑定

目前，我们在前面的案例中，大部分的值都是在 `<template>` 中固定好的：

- 比如 gender 的两个输入框值 male、female；
- 比如 hobbies 的四个输入框值 sing, jump, rap, basketball；

在真实开发中，数据可能是来自服务器的，那么我们就可以先将值请求下来，绑定到 data 返回的对象中；

再通过 `v-bind` 来进行值的绑定，这个过程就是值绑定。

```html
<body>
  <div id="app">
    <!-- 1.select 的值绑定 -->
    <label for="fruits">
      <select id="fruits" name="fruits" multiple size="3" v-model="fruits">
        <template v-for="item in allFruits" :key="item.value">
          <option :value="item.value">{{ item.text }}</option>
        </template>
      </select>
    </label>
    <h2>多选: {{fruits}}</h2>

    <!-- 2.checkbox 的值绑定 -->
    <div class="hobbies">
      <h2>请选择你的爱好:</h2>
      <template v-for="item in allHobbies" :key="item.value">
        <label :for="item.value">
          <input :id="item.value" type="checkbox" :value="item.value" v-model="hobbies" />
          {{ item.text }}
        </label>
      </template>
      <h2>爱好: {{ hobbies }}</h2>
    </div>
  </div>

  <script src="../lib/vue.js"></script>
  <script>
    const app = Vue.createApp({
      data() {
        return {
          // 水果
          allFruits: [
            { value: 'apple', text: '苹果' },
            { value: 'orange', text: '橘子' },
            { value: 'banana', text: '香蕉' }
          ],
          fruits: [],
          // 爱好
          allHobbies: [
            { value: 'sing', text: '唱' },
            { value: 'jump', text: '跳' },
            { value: 'rap', text: 'rap' },
            { value: 'basketball', text: '篮球' }
          ],
          hobbies: []
        }
      }
    })
    app.mount('#app')
  </script>
</body>
```

### 3.v-model 修饰符

v-model 有哪些常见的修饰符？有什么用？

`lazy` 修饰符

- 默认情况下，v-model 在进行双向绑定时，绑定的是 input 事件，那么会在每次内容输入后就将最新的值和绑定的属性进行同步；
- 如果在 v-model 后跟上 lazy 修饰符，那么会将绑定的事件，切换为 change 事件，只有在提交时（比如回车），或者失去焦点时，才会触发；

`number` 修饰符

- v-model 绑定后的值默认是 string 类型：

- 将 input 元素的 type 设置为 number 后，v-model 绑定的值，才是 number 类型（Vue2 中即使设置了，类型也不会改变）；

  ```html
  <input type="number" v-model="score" /><!-- 在 Vue2 中绑定的仍是 string 类型 -->
  <input type="text" v-model.number="score" />
  ```

- 如果我们希望绑定 input 元素值的默认类型，即 string 类型转换为 number 类型，那么可以使用 .number 修饰符：
- 另外，在我们进行逻辑判断时，如果是一个 string 类型，在可以转化的情况下会进行隐式转换的：

  ```js
  const score = '100'
  if (score > 90) {
    // 逻辑判断时, 可以转化的情况下, 会隐式的将一个 string 类型转成一个 number 类型, 再来进行判断
    console.log('优秀')
  }
  ```

`trim` 修饰符：

- 自动过滤用户输入的首尾空白字符。

基本使用。

```html
<body>
  <div id="app">
    <!-- 1.lazy: 绑定 change 事件  -->
    <input type="text" v-model.lazy="message" />
    <h2>message: {{message}}</h2>

    <!-- 2.number: 自动将内容转换成数字 -->
    <input type="text" v-model.number="counter1" />
    <h2>counter:{{counter1}}-{{typeof counter1}}</h2>
    <input type="number" v-model="counter2" />
    <h2>counter2:{{counter2}}-{{typeof counter2}}</h2>

    <!-- 3.trim: 去除首尾的空格 -->
    <input type="text" v-model.trim="content" />
    <h2>content: {{content}}</h2>

    <!-- 4.多个修饰符同时使用 -->
    <input type="text" v-model.lazy.trim="content" />
    <h2>content: {{content}}</h2>
  </div>

  <script src="../lib/vue.js"></script>
  <script>
    const app = Vue.createApp({
      data() {
        return {
          message: 'Hello Vue',
          counter1: 0,
          counter2: 0,
          content: ''
        }
      },
      watch: {
        content(newValue) {
          console.log('content:', newValue)
        }
      }
    })
    app.mount('#app')
  </script>
</body>
```

## 二、组件的分类

现在可以说，整个的大前端开发都是组件化的天下，

- 无论从三大框架（Vue、React、Angular），还是跨平台方案的 Flutter，小程序的开发，甚至是移动端，都在转向组件化开发；
- 所以，学习组件化最重要的是它的思想，每个框架或者平台可能实现方法不同，但是思想都是一样的。

我们需要通过组件化的思想，来思考整个应用程序：

- 将一个完整的页面分成很多个组件；
- 每个组件都用于实现页面的一个功能块；
- 每一个组件又可以进行细分；
- 组件本身又可以在多个地方进行复用；

Vue 的组件化开发的理解。

- `createApp` 函数传入了一个对象 app，这个对象本质上是一个组件，也就是我们应用程序的根组件。
- 组件化提供了一种抽象，可以开发出一个个独立可复用的小组件来构建应用。
- 任何应用都会被抽象成一颗组件树。

![Vue的组件化开发](NodeAssets/Vue的组件化开发.jpg)

注册组件的 2 种形式。

- 全局组件：在任何其它组件中，都可以使用的组件。
- 局部组件：只有在注册的组件中，才能使用的组件。

### 1.全局组件

注册一个全局组件。并编写组件自己的代码逻辑。

- 全局组件，需要使用我们全局创建的 app 来注册组件；
- 通过 `component` 方法，传入组件名称、组件对象即可注册一个全局组件了；
- 之后，我们可以在 App 组件的 template 中，直接使用这个全局组件。

```html
<body>
  <div id="app">
    <!-- 在 HTML 文件中无法使用这种写法，大小写不敏感 -->
    <HomeNav></HomeNav>

    <!-- 在 HTML 文件中，应该使用连字符写法 -->
    <home-nav></home-nav>
    <product-item></product-item>
    <product-item></product-item>
    <product-item></product-item>
  </div>

  <template id="nav">
    <h2>我是应用程序的导航</h2>
  </template>

  <template id="product">
    <div class="product">
      <h2>{{ title }}</h2>
      <p>商品描述, 限时折扣, 赶紧抢购</p>
      <p>价格: {{ price }}</p>
      <button @click="favarItem">收藏</button>
    </div>
  </template>

  <script src="../lib/vue.js"></script>
  <script>
    const app = Vue.createApp({
      data() {
        return {
          message: 'Hello Vue'
        }
      }
    })
    // 2.注册全局组件
    app.component('product-item', {
      template: '#product',
      data() {
        return {
          title: '我是商品Item',
          price: 9.9
        }
      },
      methods: {
        favarItem() {
          console.log('收藏了当前的 item')
        }
      }
    })
    app.component('HomeNav', {
      template: '#nav'
    })
    app.mount('#app')
  </script>
</body>
```

开发中很少或不使用全局组件：全局组件往往是在应用程序一开始就会全局注册完成，意味着某些组件没有用到，也会被注册，增加主包的大小；

- 比如：注册三个全局组件：ComponentA、ComponentB、ComponentC；
- 在开发中我们只使用了 ComponentA、ComponentB；
- ComponentC 没有用到，但是依然在全局进行了注册，那么就意味着类似于 webpack 这种打包工具，在打包的项目时，依然会对其进行打包；
- 这样最终打包出的 JavaScript 包，就会有关于 ComponentC 的内容，用户在下载对应的 JavaScript 时，也会增加包的大小；

在开发中，使用组件通常采用的都是局部注册。

### 2.局部组件

局部注册，通过 **components 属性**选项来进行注册；

上面的 App 组件中，我们有 data、computed、methods 等选项了，事实上还可以有一个 `components` 选项；

该 components 选项，对应的是一个对象，对象中的键值对，是组件的名称：组件对象；

注册一个局部组件。

```html
<body>
  <div id="app">
    <home-nav></home-nav>
    <product-item></product-item>
    <product-item></product-item>
    <product-item></product-item>
  </div>

  <template id="product">
    <div class="product">
      <h2>{{title}}</h2>
      <p>商品描述, 限时折扣, 赶紧抢购</p>
      <p>价格: {{price}}</p>
      <button>收藏</button>
    </div>
  </template>

  <template id="nav">
    <div>-------------------- nav start ---------------</div>
    <h1>我是home-nav的组件</h1>
    <product-item></product-item>
    <div>-------------------- nav end ---------------</div>
  </template>

  <script src="../lib/vue.js"></script>
  <script>
    const ProductItem = {
      template: '#product',
      data() {
        return {
          title: '我是product的title',
          price: 9.9
        }
      }
    }

    const app = Vue.createApp({
      // components: option api
      components: {
        ProductItem,
        HomeNav: {
          template: '#nav',
          components: {
            ProductItem
          }
        }
      },
      // data: option api
      data() {
        return {
          message: 'Hello Vue'
        }
      }
    })
    app.mount('#app')
  </script>
</body>
```

### 3.组件命名的 2 种方式

kebab-case 短横线分割符，在模板中引入时，也要使用这种方式，如 `<my-component></my-component>`

PascalCase（大）驼峰标识符，在模板中引入时，最好使用短横线分割方式 `<my-component></my-component>`。在 vue-loader 解析后，可使用驼峰 `<MyComponent></MyComponent>`

## 三、组件化开发模式

目前，使用 vue 的过程，都是在 html 文件中，通过 template 编写自己的模板、脚本逻辑、样式等。

随着项目越来越复杂，需要采用更清晰的组件化的方式来进行开发：

- 这就意味着，每个组件，都会有自己的模板、脚本逻辑、样式等；
- 当然我们依然可以把它们抽离到单独的 js、css 文件中，但是它们还是会分离开来；
- 也包括我们的 script 是在一个全局的作用域下，很容易出现命名冲突的问题；
- 并且我们的代码为了适配一些浏览器，必须使用 ES5 的语法；
- 在我们编写代码完成之后，依然需要通过工具对代码进行构建、代码；

所以在真实开发中，我们可以通过一个后缀名为 .vue 的 single-file components (单文件组件) 来解决，

并且可以使用 webpack 或者 vite 或者 rollup 等构建工具来对其进行处理。

## 四、SFC 文件

SFC 的特点如下：

- 代码高亮。
- 支持 ESModule，CommonJS 的模块化能力。
- 组件作用域的 CSS。
- 可使用预处理器构建更加丰富的组件，比如：TypeScript，Babel，Less，Sass 等。

在项目中支持 sfc 的方式 ：

- 使用 Vue CLI 来创建项目，项目会默认帮助我们配置好所有的配置选项，可以在其中直接使用 .vue 文件；
- 自己使用 webpack 或 rollup 或 vite 这类打包工具，对其进行打包处理；

## 五、Vue CLI 脚手架

前面介绍了如何通过 webpack 配置 Vue 的开发环境，但是在真实开发中，不可能每一个项目从头来完成所有的 webpack 配置，这样开发的效率会大大的降低；

所以在真实开发中，通常会使用脚手架来创建一个项目，Vue 的项目使用的就是 Vue 的脚手架；

脚手架其实是建筑工程中的一个概念，在软件工程中，也会将一些帮助我们搭建项目的工具，称之为脚手架；

Vue CLI 的 3 点理解：

- CLI 是 command-line-interface，翻译为命令行界面。
- 通过 CLI 选择项目的配置和创建出我们的项目。
- Vue CLI 已经内置了 webpack 的相关配置，不需要从 0 开始配置。

### 1.安装和使用

```shell
npm install @vue/cli -g ## 安装
vue --version ## 安装完后，查看脚手架版本。
npm update @vue/cli -g ## 更新

vue create [项目的名称] ## 使用它创建项目
```

使用它创建项目的过程，可配置选项的理解。

```shell
Vue CLI v4.5.15
? Please pick a preset: (Use arrow keys)  ## 选择预设
  Default ([Vue 2] babel, eslint) ## 选择 vue2 的版本，默认选择 babel 和 eslint
  Default (Vue 3) ([Vue 3] babel, eslint) ## 选择 vue3 版本，默认选择 babel 和 eslint
> Manually select features ## 手动选择希望获取到的特性
```

```shell
Vue CLI v4.5.15
? Please pick a preset: Manually select features
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) Choose Vue version ## 是否选择 vue 版本
 (*) Babel ## 是否选择 babel
 ( ) TypeScript ## 是否使用 ts
 ( ) Progressive Web App (PWA) Support ## 是否支持 PWA
 ( ) Router ## 是否默认添加 Router
 ( ) Vuex ## 是否默认添加 Vuex
 ( ) CSS Pre-processors ## 是否选择 CSS 预处理器
 (*) Linter / Formatter ## 是否选择 ESLint 对代码进行格式化限制。
 ( ) Unit Testing ## 是否添加单元测试
 ( ) E2E Testing ## 是否添加端到端测试。
```

```shell
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys) ## 设置单独的配置文件，还是统一将配置放在 package.json
> In dedicated config files
  In package.json
```

理解项目的目录结构。

```shell
public // 项目的一些资源
  -favicon.ico
  -index.html
src // 所有的源代码
  -assets
  -components
  -App.vue
  -main.js
.browserslistrc // 设置目标浏览器，会去 caniuse 网站查询满足适配条件的浏览器。
jsconfig.json // 用于给编辑器如 VSCode 更好的提示
...
```
