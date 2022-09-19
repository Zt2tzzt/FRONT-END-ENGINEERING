# 前端产品分类

理解前端产品分类图。

## 客户端：

- PC 端网站，如商家端，用户端等等。
- 移动端 IOS / Android
- H5 产品端，如小程序端。
	- H5 通常指产品端，而非 HTML5。
	- 通过移动端中某一个浏览器，无论是微信的 WebView 还是别的浏览器打开的页面。

## 后端管理系统（往往有更高的权限）：

- PC 端网站，如客服端，产品经理端等等。

-----

# router-link 结合插槽使用

> vue-router4 删除了 router-linke 上 `tag` 属性，使用插槽的方式来渲染内容。

基本使用：放入普通元素和组件。

```vue
<template>
  <div>
    <router-link to="/home">
      <button>首页</button>
      <Foo></Foo>
    </router-link>
    <router-link to="/about">关于</router-link>
    <router-view></router-view>
  </div>
</template>
```

------

router-link 增强，结合作用域插槽 `v-slot` 如何使用。

1. 在 router-link 组件上使用 `custom` 表示自定义元素，否则内容外层会包裹 `<a>`
2. 使用 `v-slot` （独占默认插槽语法），来获取作用域插槽内部传递的对象，对象中有以下属性：
   - href：解析后的 url，如 "/home".
   - route：解析后的规范化 route 对象，里面有 params，query，meta 等属性。
   - navigate：触发导航的函数。
   - isActive：是否匹配状态。
   - isExactActive：与嵌套组件有关，是否精确匹配状态。

App.vue

```vue
<template>
  <router-link to="/home" v-slot="slotProps" custom>
    <button @click="slotProps.navigate">{{slotProps.href}}</button>
    <span :class="{'active': slotProps.isActive}">{{slotProps.isActive}}</span>
  </router-link>
  <router-link to="/about">关于</router-link>
  <router-view></router-view>
</template>
<style scoped>
.active { color: green; }
</style>
```

# router-view 结合插槽使用

> 不能通过 router-view 拿到组件，它只能起到占位的作用。

router-view 增强，结合作用域插槽 v-slot，使用动态组件，缓存，动画。

```vue
<template>
	<router-link to="/home">主页</router-link>
  <router-link to="/about">关于</router-link>
	<!-- slotProps解构：{ Component } -->
  <router-view v-slot="{ Component }">
    <transition name="zzt" mode="out-in" appear>
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </transition>
  </router-view>
</template>
<style scoped>
.zzt-enter-from,
.zzt-leave-to {
  opacity: 0;
}
.zzt-enter-active,
.zzt-leave-active {
  transition: opacity 0.3s ease;
}
</style>
```

router-view 使用 `v-slot` 来获取作用域插槽内部传递的对象，对象中有以下属性：

- Component：要渲染的组件。
- route：解析出的标准化路由对象。里面有 params，query，meta 等属性。

------

# vue-router 动态添加路由

## 使用场景：

- 根据用户不同的权限，注册不同的路由。

系统实现角色权限管理的3种方案。 

- 后台权限设计的思想之一：RBAC(role based access control) 基于访问权限控制的角色管理。
	- 维护用户表，权限表和关系表。
- 理解3种在前端控制权限的方法，
	- 方法一：注册所有路由，弊端：用户可通过手动改 url 实现禁止的权限。
	- 方法二：在前端用数组维护好各个角色对应的路由，获取角色后**动态添加路由**。弊端：后端新增角色需要前端修改代码再部署。
	- 方法三：在前端获取用户权限能访问的菜单后，根据用户菜单返回的数据**动态添加路由**。
		1. 后端返回数据中有 component 字段，里面是组件名称，如 Role.vue
		2. 后端只返回 path，前端根据已有的配置，找到对应的 component。

-----

## 基本使用

动态添加一个一级路由和二级路由

src/router/index.js

```javascript
import {createRouter, createWebHistory} from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
const routes = [
	{ path: '/home', component: Home },
	{ path: '/about', component: About }
]
const router = createRouter({
	routes,
	history: createWebHistory()
})
// 动态添加路由, 一级路由
router.addRoute({
	path: '/category',
	component: () => import('../pages/Category.vue')
})
// 添加二级路由，第一个参数是一级路由的name
router.addRoute("home", {
  path: "moment", // 要么写完整路径‘/home/moment’，要么写成‘moment’
  component: () => import("../pages/HomeMoment.vue")
})
export default router
```

动态删除路由的3种方式：

- 添加一个 name 相同的路由做替换。

  ```javascript
  router.addRoute({	path: '/category', name: 'category', component: Category })
  router.addRoute({	path: '/other', name: 'category', component: Other }) // 使用 /other 替换 /category
  ```

- 通过 `removeRoute` 的方法，传入路由的 `name`。

  ```javascript
  router.addRoute({	path: '/category', name: 'category', component: Category })
  router.removeRoute('category')
  ```

- 通过 `addRoute` 方法的返回函数回调。

  ```javascript
  const removeRoute = router.addRoute({	path: '/category', name: 'category', component: Category })
  removeRoute()
  ```

路由的2个其他方法

- `router.hasRoute(name)`：检查路由是否存在。
- `router.getRoutes()`：获取一个包含所有路由的记录数组。

-----

# 导航守卫

## 使用场景。

- 主要用来通过跳转或取消的方式守卫导航。
- 比如，用户访问某一页面，如果处于未登陆的状态，那么跳转到登陆页面。

## beforeEach 介绍

全局前置守卫 `beforeEach` 的基本使用，回调函数传入的2个参数：

- `to`：即将进入的路由 Route 对象。
- `from`：即将离开的路由 Route 对象。
- `next`：Vue2 中通过 next 函数来决定如何跳转。Vue3 中使用返回值来控制，不推荐使用 next 函数。因为开发中容易调用多次。

回调函数的返回值：

- `false`；取消当前导航。
- `undefined`：进行默认导航。
- 一个路由地址，
  - 一个 string 类型的路径。
  - 一个对象，其中包含 path, query, params，

## 基本使用。

在注册 route 时，模拟进行导航守卫，

src/router/index.js

```javascript
router.beforeEach((to, from, next) => { // next 已不推荐使用
	const token = window.localStorage.getItem("token");
  if (to.path === "/order "&& !token) { 
		return "/login"
  }
})
```

在 Login.vue 中模拟发送网络请求，获取 token

Login.vue

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();
const loginClick = () => {
	window.localStorage.setItem("token", "zzt")
	router.push({ path: "/order" })
}
</script>
<template>
	<div>
    Login
    <button @click="loginClick">登录</button>
  </div>
</template>
```

在 Home.vue 中，模拟退出登录操作。

Home.vue

```vue
<script setup>
  function logoutClick() {
    localStorage.removeItem("token")
  }
</script>
<template>
  <div class="home">
    <h2>Home</h2>
    <button @click="logoutClick">退出登录</button>
  </div>
</template>

```

## 其它导航守卫

官方文档：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html

其它导航守卫函数的执行时机：

1. 导航被触发。在失活的组件里调用 `beforeRouteLeave` 守卫（**组件内的守卫**）。能通过 this 拿到组件实例

   ```js
   // Home.vue
   export default {
     beforeRouteLeave (to, from) {
       const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
       if (!answer) return false
     }
   }
   ```

2. 调用全局的 `beforeEach` 守卫（**全局守卫**）。

3. 在重用的组件里调用 `beforeRouteUpdate` 守卫（**组件内的守卫**）本质上未跳转，而是组件发生更新，比如动态路由 /user/123 -> /user/321。能通过 this 拿到组件实例

   ```vue
   <!-- User.vue -->
   <script setup>
     import { useRoute, onBeforeRouteUpdate } from 'vue-router'
   
     const route = useRoute()
     console.log(route.params.id)
     // 获取 route 跳转前后的 id
     onBeforeRouteUpdate((to, from) => {
       console.log("from:", from.params.id)
       console.log("to:", to.params.id)
     })
   </script>
   ```

4. 在调用路由配置里的 `beforeEnter` 守卫（**路由独享守卫**）

   ```js
   const routes = [
     {
       path: '/users/:id',
       component: User,
       beforeEnter: (to, from) => {
         // reject the navigation
         return false
       },
     },
   ]
   ```

5. 解析异步路由组件。在被激活的组件里调用 `beforeRouteEnter` 守卫（**组件内的守卫**）。

   - 异步组件已经解析，但回调函数中不能通过 this 拿到组件实例，需要使用 next

   ```js
   // Home.vue
   export default {
     beforeRouteEnter (to, from, next) {
       next(instance => {
         // 通过 `instance` 访问组件实例
       })
     }
   }
   ```

6. 调用全局的 `beforeResolve` 守卫（**全局守卫**）(2.5+)。名字取得不好，类似与 beforeEach，但时机是在异步组件解析之后，跳转之前。能确保获取到自定义 `meta` 属性。

   ```js
   router.beforeResolve(async to => {
     if (to.meta.requiresCamera) {
       try {
         await askForCameraPermission()
       } catch (error) {
         if (error instanceof NotAllowedError) {
           // ... 处理错误，然后取消导航
           return false
         } else {
           // 意料之外的错误，取消导航并把错误传给全局处理器
           throw error
         }
       }
     }
   })
   ```

7. 导航被确认。调用全局的 `afterEach` 钩子（**全局守卫**）。触发 DOM 更新。

   - 对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。

   ```js
   router.afterEach((to, from, failure) => {
     if (!failure) sendToAnalytics(to.fullPath)
   })
   ```


-----

# Vuex

Vue 的全家桶包括：Vue 核心语法，vue-router，Vuex/Pinia。

-----

# 认识状态管理

什么是状态管理？ 

- 对于应用中各种复杂数据的管理。

为什么需要复杂状态的管理？

1. 组件里面管理的状态过多，变得非常臃肿。
2. 别的组件要改变或者使用该组件的状态，非常困难。
3. 当我们的应用遇到多个组件共享状态时，单向数据流的简洁性很容易被破坏：

复杂的状态包含哪些面数据：

- 服务器返回的数据，缓存数据，用户操作产生的数据。
- UI状态，如元素是否被选中，是否显示加载动效，当前分页。

复杂状态共享包括3个场景：

- 深层父传子。子传父，兄弟共享。

复杂状态共享2个维度：

- 多个视图，依赖同一状态。
- 来自不同视图的行为，需要变更同一状态。

在 vue 中通过 Vuex / Pinia 实现状态管理，在 React 中通过 Redux 实现状态管理。

什么是状态管理中的 view，state，action

- view：组件 template 模块渲染成 DOM。
- state：组件中 data，setup 返回的数据。
- action：组件中产生的修改`state`的事件。

<img src="NodeAssets/状态管理中的state-view-actions.jpg" style="zoom:80%;" />

-----

Vuex 的状态管理模式。

1. 将组件内部状态抽离出来，以一个全局单例的方式来管理。
2. 通过定义和隔离状态管理的各个概念，并通过强制性的规则，来维护 view 和 state 的独立性
3. 借鉴了 Flux、Redux、Elm（纯函数语言，redux 有借鉴它的思想）

<img src="NodeAssets/Vuex的状态管理.jpg" alt="Vuex的状态管理" style="zoom:80%;" />

>vue devtool 的使用场景之一：对组件或者 Vuex 进行调试。

-----

Vuex 的使用步骤。

-----

什么是 Vuex 的单一状态树。

-----

组件获取 State，使用辅助函数进行映射。在 VOA, VCA 中使用。 VCA  中3种转化方法。

-----

getters 的基本使用，第二个参数，返回函数。

-----

组件获取 Getters，使用辅助函数进行映射，在 VOA, VCA 中使用，VCA 中3种转化方法。

-----

Mutation 的基本使用。携带参数。提交风格。常量类型（设计规范），

-----

组件获取 Mutation，使用辅助函数进行映射，在 VOA, VCA 中使用。VCA 中的2中用法。

-----

mutation 中的重要原则。