# 案例练习-vue-router（一）

## 一、阶段性案例练习

Vue 阶段性案例练习，房源展示。网络请求模拟。见 `demo-project`

> 安装依赖不需要重启项目，修改配置文件后才需要重启项目。

## 二、路由的概念

路由是网络工程中的一个术语：

在架构一个网络时，非常重要的两个设备，就是路由器和交换机。

当然，目前在我们生活中，路由器也是越来越被大家所熟知，因为我们生活中，都会用到路由器：

路由器可用来给每个终端设备分配 ip 地址，如 `192.168.154.26`，这样的私网 ip 地址。

事实上，路由器主要维护的是一个映射表；（ip 地址 <-> 终端设备（mac 地址））

映射表会决定数据的流向；

## 三、路由的发展历程

后端路由阶段（后端渲染模式）；

前后端分离阶段（后端渲染模式）；

前端路由阶段，单页面富应用（SPA -> Simple Page Web Application）（前端渲染模式）；

### 1.后端路由

什么是后端路由阶段？

1. 客户端发送请求 url 给服务器；
2. 服务器根据 url 进行匹配，交给一个 Controller 进行处理，最终在服务器生成 HTML 页面；
3. 服务器返回生成的 HTML 页面给客户端浏览器。
4. 浏览器渲染展示。

后端路由的优势：

- 直接返回渲染的页面，省去加载 js 和 css 的步骤 ；
- 有利于 SEO 优化。

后端路由的弊端：

- 大多数情况下，整个页面的模块，由后端人员来编写和维护的；
- 另一种情况是：前端开发人员如果要开发页面, 需要通过 PHP 和 Java 等语言，来编写页面代码；
- 而且通常情况下 HTML 代码和数据以及对应的逻辑会混在一起, 编写和维护都是非常糟糕的事情；

### 2.前后端分离

什么是前后端分离阶段？

1. 每次请求涉及到的静态资源，都会从静态资源服务器获取，这些资源包括 HTML+CSS+JS；
2. 然后，在前端对这些请求回来的资源进行渲染；
3. 需要注意的是，客户端的每一次请求，都会从静态资源服务器请求文件；
   - 每个独立完整的页面，还是要向后端请求。因此仍然属于**后端渲染**的模式。
4. 同时可以看到，和之前的后端路由不同，这时后端只是负责提供 API 了；

> 随着 Ajax 的出现, 有了前后端分离的开发模式；
>
> 后端只提供 API 来返回数据，前端通过 Ajax 获取数据，并且可以通过 JavaScript 将数据渲染到页面中；

前后端分离的优势：

- 前后端责任清晰，后端专注于数据上，前端专注于交互和可视化上；
- 并且当移动端 iOS / Android 出现后，后端不需要进行任何处理，依然使用之前的一套 API 即可；

目前，比较少的网站采用这种模式开发；

### 3.前端路由，单页面富应用（SPA）

什么是单页面富应用阶段（SPA）。

1. 其实 SPA 最主要的特点，就是在前后端分离的基础上，加了一层前端路由；
2. 也就是前端来维护一套路由规则.
   1. 修改页面的 url；
   2. 让页面内容渲染不同的组件。

## 四、前端路由的原理

实现 url 改变，页面不刷新的 2 种模式。

- 使用 URL 的 hash 模式。
- 使用 HTML5 的 history 模式。

### 1.URL 的 hash

URL 的 hash，也就是**锚点(#)**，本质上是改变 `window.location` 的 `href` 属性。

可以通过直接赋值 `location.hash` 来改变 `href`，但是页面不发生刷新。

优点：兼容性好，在老版本 IE 中也可以运行。

缺点：有一个#，显得不像一个真实的路径。

实现更改 hash，渲染不同内容的简单案例

```html
<div id="app">
  <a href="#home">home</a>
  <a href="#about">about</a>
  <div class="content">Default</div>
</div>

<script>
  const contentEl = document.querySelector('.content')

  window.addEventListener('hashchange', () => {
    switch (location.hash) {
      case '#home':
        contentEl.innerHTML = 'Home'
        break
      case '#about':
        contentEl.innerHTML = 'About'
        break
      default:
        contentEl.innerHTML = 'default'
    }
  })
</script>
```

### 2.HTML5 的 history

HTML5 中 history 的 6 种方法改变 URL 而不刷新：

- `replaceState`: 替换原来的路径（不会留下记录）。
- `pushState`: 使用新的路径（压栈操作）。
- `popState`: 路径的回退（弹栈操作）。
- `go`: 向前或向后改变路径。
- `forward`: 向前改变路径。
- `back`: 向后改变路径。

实现更改 state 渲染不同内容的简单案例。

```html
<div id="app">
  <a href="/home">home</a>
  <a href="/about">about</a>
  <div class="content">Default</div>
</div>

<script>
  const contentEl = document.querySelector('.content')

  const changeContent = () => {
    switch (location.pathname) {
      case '/home':
        contentEl.innerHTML = 'Home'
        break
      case '/about':
        contentEl.innerHTML = 'About'
        break
      default:
        contentEl.innerHTML = 'default'
    }
  }

  const aEls = document.getElementsByTagName('a')

  for (const aEl of aEls) {
    aEl.addEventListener('click', e => {
      e.preventDefault() // 阻止点击跳转的默认事件。
      const href = aEl.getAttribute('href')
      history.pushState({}, '', href)
      // history.replaceState({}, "", href);
      changeContent()
    })
  }
  window.addEventListener('popstate', changeContent)
</script>
```

## 五、vue-router

### 1.vue-router 是什么？

Vue Router 是 Vue.js 的官方路由：它与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用（SPA）变得非常容易；

vue-router 是基于路由和组件的：

- 路由用于设定访问路径, 将路径和组件映射起来；
- 在 vue-router 的单页面应用中，页面的路径的改变就是组件的切换；

安装 Vue Router：

```shell
npm install vue-router
```

> 安装依赖不需要重启项目，修改配置文件后才需要重启项目。

### 2.vue-router 使用步骤

Ⅰ、创建路由需要映射的组件（打算显示的页面）；

Ⅱ、通过 `createRouter` 函数创建路由对象，并且传入 routes 和 history 模式；

1. 配置路由映射: 组件和路径映射关系的 routes 数组；
2. 创建基于 hash 或者 history 的模式；

Ⅲ、使用 app 注册路由对象（`use` 方法）；

Ⅳ、通过 `<router-link>` 编程式导航，进行路由跳转，通过 `<router-view>` 展示路由对应的组件；

src / router / index.js

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'

const routes = [
  { path: '/home', component: Home },
  { path: '/about', component: About }
]

const router = createRouter({
  routes,
  // history: createWebHistory(), // 使用 history 模式
  history: createWebHashHistory() // 使用 hash 模式
})

export default router
```

src / main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router) // router 对象中，有 install 函数，其中执行了 app.component('router-link', ...), app.component('router-view',...)
app.mount('#app')
```

src / App.vue

```vue
<template>
  <!-- router-link 默认情况下是一个 a 元素。-->
  <router-link to="/home">首页</router-link>
  <router-link to="/about">关于</router-link>
  <router-view></router-view>
</template>
```

### 3.路由重定向

使用场景：进入网站时，默认没有匹配路由，则显示 Home 组件；

#### 1.默认路由重定向

src / router / index.js

```javascript
const routes = [
  { path: '/', component: Home } // 第一种方式
]
```

#### 2.路由重定向

在默认路由的基础上使用重定向：

```javascript
const routes = [
  { path: '/', redirect: '/home' }, // 第二种方式，使用 redirect 做重定向，改变 href
  { path: '/home', component: Home }
]
```

### 4.`<router-link>` 的使用

router-link 有哪些属性？

- `to`：可传字符串，如`/home`、对象，如 `{ path: '/home', query: { name: 'zzt', age: 18 } }`
- `replace`：会调用 `router.replace()`，而不是 `router.push()`
- `active-class`：路由激活后应用于 \<a\> 的 class，默认是 "router-link-active"
- `exact-active-class`：与嵌套路由有关，路由精准激活时，应用于 \<a\> 的 class,，默认是 "router-link-exact-active"
- `custom`：表示自定义元素，否则内容外会包裹 \<a\>

```vue
<router-link to="/home" replace active-class="“active”" custome>首页</router-link>
```

### 5.路由懒加载

随着应用不断庞大，打包后的文件，也随之增大；

需要对路由对应的组件，进行分包加载，以加快首屏的渲染速度，提高组件加载效率。

路由懒加载的原理：

- 其实这里原理，还是 webpack 的分包，而 Vue Router 默认就支持动态来导入组件：
- 这是因为 routes 中 component 可以传入一个组件，也可以接收一个函数，该函数需要**返回一个 Promise**；
- 而在 webpack 分包中， import 函数就是返回一个 Promise；

```javascript
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('../pages/Home.vue') }
]
```

使用 webpack 的特性魔法注释，给分包名命：

```javascript
const routes = [
  {
    path: '/home',
    component: () => /* webpackChunkName: "home-chunk" */ import('../pages/Home.vue')
  }
]
```

打包后 dist 文件夹如下

```shell
dist
  js
    app.fd14a7ae.js
    app.fd14a7ae.map
    home-chunk-2d0dda4d.88dfd768.js // 原 chunk-2d0dda4d.88dfd768.js
    home-chunk-2d0dda4d.88dfd768.map // 原 chunk-2d0dda4d.88dfd768.map
    chunk-vendors.f9aa8ccb.js
    chunk-vendors.f9aa8ccb.map
```

### 6.name 、meta 属性

`name` 属性：路由记录独一无二的名称，

可通过名字，来做跳转（很少用），一般用于：

- **动态添加路由**中的二级子路由添加，需要使用 name 来指定一级路由（后续学习）。
- 删除添加的路由。

meta：自定义数据，某些地方会拿到 route 对象，可访问 meta，比如可用于导航守卫。

```javascript
const routes = [
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/About.vue'),
    meta: {
      name: 'zzt',
      age: 18
    }
  }
]
```

```js
// VOA 中
this.$route.meta

// VCA 中
const route = useRoute()
route.meta
```

### 7.动态路由（匹配路径参数）

#### 使用场景

- 动态匹配路径中的值。
- 很多时候我们需要将给定匹配模式的路由映射到同一个组件：
- 例如，我们可能有一个 User 组件，它应该对所有用户进行渲染，但是用户的 ID 是不同的；
- 在 Vue Router 中，我们可以在路径中使用一个动态字段来实现，我们称之为**路径参数**；

#### 基本使用

src / router / index.js

```javascript
const routes = [{ path: '/user/:id', component: () => import('../pages/User.vue') }]
```

App.vue

```vue
<router-link to="/user/123">用户：123</router-link>
```

#### 动态路由组件中获取路径参数

1. 在 template 中通过 `$route.params.xxx` 获取值。
2. 在 VOA 中通过 `this.$route.params.xxx` 获取值。
3. 在 setup 中，使用 vue-router 插件提供的一个 hook 函数 `useRoute`，返回一个 Route 对象 `route`，其中保存着当前路由相关属性，使用 `route.params.xxx` 取值。

User.vue

```vue
<template>
  <h2>我是用户：{{ $route.params.id }}</h2>
  <!-- 在 template 中获取 -->
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  // VOA 的方式
  created() {
    console.log('--created--', this.$route.params.id)
  },
  // VCA 的方式
  setup() {
    const route = useRoute()
    console.log('--setup--', route.params.id)
  }
}
</script>
```

#### 动态路由匹配多个参数

src / router / index.js

```javascript
const routes = [{ path: '/user/:id/info/:name', component: () => import('../pages/User.vue') }]
```

| 匹配模式             | 匹配路径           | $route.params              |
| -------------------- | ------------------ | -------------------------- |
| /user/:id            | /user/123          | { id: '123' }              |
| /user/:id/info/:name | /user/123/info/zzt | { id: '123', name: 'zzt' } |

#### 动态路由之间进行切换时，获取动态路由的参数值

使用 route 的生命周期 `onBeforeUpdataRoute`

User.vue

```vue
<script setup>
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
console.log(route.params.id)
// 获取 route 跳转前后的 id
onBeforeRouteUpdate((to, from) => {
  console.log('from:', from.params.id)
  console.log('to:', to.params.id)
})
</script>
```

#### 动态路由 NotFount 的匹配

使用动态路由对 NotFound 页面做处理，匹配规则的 2 种写法。

src / router / index.js

```javascript
const routes = [
  // 方式一
  { path: '/:pathMatch(.*)', component: () => import('../pages/Notfound.vue') },
  // 方式二
  { path: '/:pathMatch(.*)*', component: () => import('../pages/Notfound.vue') }
]
```

NotFound.vue

```vue
<!-- 访问一个未匹配的路径：user/hahaha/123 -->
<!-- 方式一的结果：Not Found：user/hahaha/123 -->
<!-- 方式二的结果：Not Found：["user","hahaha","123"] -->
<h2>Not Found: {{ $route.params.pathMatch }}</h2>
```

> 他们的区别在于解析的时候，方式一不解析"/"，方式二解析“/”

### 路由的嵌套（子路由）

#### 使用场景

- 在路由对应的组件页面中，也存在多个组件来回切换的情况。

#### 基本使用

src / router / index.js

```javascript
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../pages/Home.vue'),
    children: [
      // 嵌套路由中，path 不需要“/”，redirect 需要写完整路径
      { path: '', redirect: '/home/product' },
      { path: 'product', component: () => import('../pages/HomeProduct.vue') }
    ]
  }
]
```

Home.vue

```vue
<template>
  <!-- 嵌套路由，<router-link> 中，to 属性需要写完整的路径 -->
  <router-link to="/home/product">首页商品</router-link>
  <router-view></router-view>
  <div>
    <h2>Home哈哈哈</h2>
    <ul>
      <li>Home的内容1</li>
      <li>Home的内容2</li>
      <li>Home的内容3</li>
    </ul>
  </div>
</template>
```

### 路由的编程式导航（使用代码做页面跳转）

#### 使用场景

通过代码来完成跳转。

#### 基本使用

分别使用 VOA, VCA 实现:

App.vue

```vue
<script>
import { useRouter } from 'vue-router'

export default {
  // VOA 实现
  methods: {
    jumpToAbout() {
      this.$router.push('/about')
    }
  },
  // VCA 实现。
  setup() {
    const router = useRouter()
    const jumpToAbout = () => {
      router.push('/about')
    }
    return { jumpToAbout }
  }
}
</script>

<template>
  <!-- <router-link to="/home">首页</router-link> -->
  <!-- <router-link to="/about">关于</router-link> -->
  <button @click="jumpToAbout">关于</button>
  <router-view></router-view>
</template>
```

#### 对象风格导航

传入对象，使用 query 传递参数

App.vue

```vue
<script>
import { useRouter } from 'vue-router'

export default {
  setup() {
    // VCA 实现。
    const router = useRouter()
    const jumpToAbout = () => {
      // 声明式的写法 <router-link :to="{ path: '/about', query: {name: 'zzt', age: 18} }">首页</router-link>
      router.push({
        path: '/about',
        query: { name: 'zzt', age: 18 }
      })
    }
    return { jumpToAbout }
  }
}
</script>
```

About.vue

```vue
<template>
  <!-- 拿到参数 -->
  <h2>query: {{ $route.query.name }} - {{ $route.query.age }}</h2>
</template>

<script setup>
const route = useRoute()
route.query.name
route.query.age
</script>
```

---

#### 编程导航的 5 个方法

- push：可传路径或对象作为参数。

- replace：`router.replace('/about')`，相当于声明式的`<router-link to="/about" replace />`
- go：`router.go(1)`，回退或者前进。
- back：`router.back()`，相当于 go(-1)
- forward：`router.forward()`，相当于 go(1)
