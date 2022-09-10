非父子组件通信两种方式。

- Provide / Inject
- Mitt全局事件总线

-----

# Provide & Inject

provide 和 inject 使用的场景：

- 深度嵌套的组件，子组件想要获取父组件中的内容。
- 用的不多，一般会用状态管理插件（Vuex，Pinia）替代这种方案。

<img src="NodeAssets/Project&inject的使用场景.jpg" alt="Project&inject的使用场景" style="zoom:50%;" />

provide 和 inject 如何使用3点描述：

1. 无论层级结构多深，父组件都可以作为其所有子组件的依赖提供者。
2. 父组件用 provide 选项提供数据。
3. 子组件用 inject 选项使用数据。


provide 和 inject 可看作“long range props”，2点理解。

1. 父组件不需要知道哪些子组件使用 provide 的 properties。
2. 子组件不需要知道 inject 的 properties 来自哪里。

Provide/Inject 基本使用，函数写法，处理响应式数据（需要解包）。

父组件：App.vue

```vue
<template>
  <div class="app">
    <home></home>
    <h2>App: {{ message }}</h2>
    <button @click="message = 'hello world'">修改message</button>
  </div>
</template>
<script>
  import { computed } from 'vue'
  import Home from './Home.vue'
  export default {
    components: {
      Home
    },
    data() {
      return {
        message: "Hello App"
      }
    },
    provide: { // 基本用法
    	name: 'zzt',
      age: 18
    },
    provide() { // 函数写法，一般都用这种写法，在 provide 中使用 this 拿到 data 中的数据
      return {
        name: "zzt",
        age: 18,
        message: computed(() => this.message) // 将 this.message 设置为响应式的数据，
      }
    }
  }
</script>
```

>vue 的 sfc 文件中，\<script\> 标签中的代码会按照 Node 模块化打包，所以其中全局 this 指向 undefined。
>
>computed 中传入的是 get 函数，并且要用箭头函数。computed 返回的是一个 ref 对象，需要使用 value 拿到值（解包）。


孙子组件：HomeBanner.vue

```vue
<template>
  <div class="banner">
    <h2>HomeBanner: {{ name }} - {{ age }} - {{message.value}}</h2>
  </div>
</template>
<script>
  export default {
    inject: ["name", "age", "message"]
  }
</script>
```

-----

# 事件总线

事件总线的使用，

- vue3 移除了实例上的 `$on`, `$off`, `$once` 方法，要用第三方库实现全局事件总线，官方推荐 mitt 库或 tiny-emitter 库。

- 这里介绍 hy-event-bus 库，它可以实现事件总线和状态管理的功能，

hy-event-bus 基本使用

1. 安装 hy-evnet-bus

   ```shell
   npm install hy-event-bus
   ```

2. 实现事件总线中事件的监听和移除

   上级组件 Category.vue

   ```vue
	 <template>
     <div>
			<h2>Category</h2>
     </div>
   </template>
   <script>
     import eventBus from './utils/event-bus'
     export default {
       methods: {
         zztEventHandler(name, age, height) {
           console.log("zztEvent在category中监听", name, age, height)
         }
       },
       created() {
         eventBus.on("zztEvent", this.zztEventHandler) // 监听（注册）事件
       },
       unmounted() { // 规范写法：有注册，一定有卸载。
         eventBus.off("zztEvent", this.zztEventHandler) // 移除（卸载）事件
       }
     }
   </script>
   ```
   
   下级组件 HomeBanner.vue
   
   ```vue
   <template>
     <div class="banner">
       <button @click="bannerBtnClick">banner按钮</button>
     </div>
   </template>
   <script>
     import eventBus from './utils/event-bus'
     export default {
       methods: {
         bannerBtnClick() {
           eventBus.emit("zztEvent", "zzt", 18, 1.88) // 派发事件
         }
       }
     }
   </script>
   ```
   
-----

# 生命周期

认识生命周期。

1. 生物学上，生物生命周期指得是一个生物体在生命开始到结束周而复始所历经的一系列变化过程； 
3. 每个组件都可能会经历从创建、挂载、更新、卸载等一系列的过程； 
4. 在这个过程中的某一个阶段，我们可能会想要添加一些属于自己的代码逻辑（比如组件创建完后就请求一些服务器数据）；
2. 但是我们如何可以知道目前组件正在哪一个过程呢？Vue 给我们提供了组件的生命周期函数；

<img src="NodeAssets/Vue的生命周期.jpg" alt="Vue的生命周期" style="zoom:150%;" />

生命周期函数是什么。

1. 生命周期函数是一些钩子函数（回调函数），在某个时间会被Vue源码内部进行回调； 
2. 通过对生命周期函数的回调，我们可以知道目前组件正在经历什么阶段；
3. 那么我们就可以在该生命周期中编写属于自己的逻辑代码了；

基本使用

```vue
<script>
  export default {
    // 1.组件被创建之前
    beforeCreate() {
      console.log("beforeCreate")
    },
    // 2.组件被创建完成
    created() {
      console.log("created")
      console.log("1.发送网络请求, 请求数据")
      console.log("2.监听 eventbus 事件")
      console.log("3.监听 watch 数据")
    },
    // 3.组件template准备被挂载
    beforeMount() {
      console.log("beforeMount")
    },
    // 4.组件template被挂载: 虚拟DOM -> 真实DOM
    mounted() {
      console.log("mounted")
      console.log("1.获取 DOM")
      console.log("2.使用 DOM")
    },
    // 5.数据发生改变
    // 5.1. 准备更新DOM
    beforeUpdate() {
      console.log("beforeUpdate")
    },
    // 5.2. 更新DOM
    updated() {
      console.log("updated")
    },
    // 6.卸载VNode -> DOM元素
    // 6.1.卸载之前
    beforeUnmount() {
      console.log("beforeUnmount")
    },
    // 6.2.DOM元素被卸载完成
    unmounted() {
      console.log("unmounted")
    }
  }
</script>
```


-----

# 在 Vue 中获取 DOM 对象

$refs 的使用场景。

1. 在 Vue 开发中我们是不推荐进行 DOM 操作的； 
2. 这个时候，我们可以给元素或者组件绑定一个 ref 的 attribute 属性；

$refs 的使用步骤：

1. 给元素或组件绑定一个 ref 的 attribute。
2. 在组件实例中使用 $refs，它是一个对象，持有注册过ref attribute的所有DOM元素和子组件实例。
3. 元素会返回它本身，组件会返回一个 Prox 且可以访问其中data定义的变量，调用 methods 中的方法。


父组件 App.vue

```vue
<template>
  <div class="app">
    <h2 ref="title" class="title" :style="{ color: titleColor }">{{ message }}</h2>
    <button ref="btn" @click="changeTitle">修改title</button>
    <banner ref="banner"/>
  </div>
</template>
<script>
  import Banner from "./Banner.vue"
  export default {
    components: {
      Banner
    },  
    data() {
      return {
        message: "Hello World",
        titleColor: "red"
      }
    },
    methods: {
      changeTitle() {
        // 1.不要主动的去获取 DOM，并且修改DOM内容
        // const titleEl = document.querySelector('.title')
				// title.textContent = '你好啊，李银河'
        // 2.获取 h2/button 元素
        console.log(this.$refs.title)
        console.log(this.$refs.btn)
        // 3.获取 banner 组件: 组件实例
        console.log(this.$refs.banner)
        // 3.1.在父组件中可以主动的调用子组件的对象方法
        this.$refs.banner.bannerClick()
        // 3.2.获取 banner 中的根元素
        console.log(this.$refs.banner.$el)
        // 3.3.如果 banner template 是多个根, 拿到的是第一个 node 节点，需要通过元素导航去拿到根节点
        // console.log(this.$refs.banner.$el.nextElementSibling)
        // 注意: 开发中不推荐一个组件的 template 中有多个根元素
        // 4.组件实例还有两个属性(了解):
        console.log(this.$parent) // 获取父组件
        console.log(this.$root) // 获取根组件 
      }
    }
  }
</script>
```

> 理解组件和组件实例的关系，会不会出现一个组件有多个父组件的情况？
>
> - 不会，我们写一个.vue 组件，是在写一个组件描述，真正使用时，会创建出一个组件实例。
> - 组件实例，不等于组件导出的对象，Vue 通过导出的对象创建组件实例 Instance，组件导出的对象的功能类似于 class 类。

子组件 Banner.vue

```vue
<template>
  <div class="banner">
    <h2>Banner</h2>
  </div>
</template>
<script>
  export default {
    methods: {
      bannerClick() {
        console.log("bannerClick")
      }
    }
  }
</script>
```

-----

$parent 和 $root 的使用。Vue3 中已移除 $children。

- $parent：用来访问父组件。
- $root：用来访问根组件。

> is="xxx"，推荐小写加短横线的写法，vue-loader 下大写也可以

不推荐使用，使用时耦合性太强。

-----

# 内置 Component 组件

在学习路由（router）之前，切换组件的2种方式。

1. 通过 v-if 来判断，显示不同组件。
2. 动态组件（内置组件 Component）的方式

内置动态组件 Component 的使用。组件通信。

- 通过一个特殊的 attribute `is` 来实现。
- is 最好使用 v-bind 动态绑定，它的值可以是2种。
	- 注册的全局组件名。
	- 注册的局部组件名。

父组件 App.vue

```vue
<template>
  <div class="app">
    <div class="tabs">
      <template v-for="(item, index) in tabs" :key="item">
        <button :class="{ active: currentTab === item }" 
                @click="itemClick(item)">
          {{ item }}
        </button>
      </template>
    </div>
    <div class="view">
      <!-- 1.第一种做法: v-if进行判断逻辑, 决定要显示哪一个组件 -->
      <template v-if="currentIndex === 0">
        <home></home>
      </template>
      <template v-else-if="currentIndex === 1">
        <about></about>
      </template>
      <template v-else-if="currentIndex === 2">
        <category></category>
      </template>
      <!-- 2.第二种做法: 动态组件 component -->
      <!-- is中的组件需要来自两个地方: 1.全局注册的组件 2.局部注册的组件 -->
      <!-- <component :is="tabs[currentIndex]"></component> -->
      <component name="zzt" 
                 :age="18"
                 @homeClick="homeClick"
                 :is="currentTab">
      </component>
    </div>
  </div>
</template>
<script>
  import Home from './views/Home.vue'
  import About from './views/About.vue'
  import Category from './views/Category.vue'
  export default {
    components: {
      Home,
      About,
      Category
    },
    data() {
      return {
        tabs: ["home", "about", "category"],
        // currentIndex: 0
        currentTab: "home"
      }
    },
    methods: {
      itemClick(tab) {
        this.currentTab = tab
      },
      homeClick(payload) {
        console.log("homeClick:", payload)
      }
    }
  }
</script>
<style scoped>
  .active {
    color: red;
  }
</style>
```

子组件 Home.vue

```vue
<template>
  <div>
    <h2>Home组件: {{ name }} - {{ age }}</h2>
    <button @click="homeBtnClick">homeBtn</button>
  </div>
</template>
<script>
  export default {
    props: {
      name: {
        type: String,
        default: ""
      },
      age: {
        type: Number,
        default: 0
      }
    },
    emits: ["homeClick"],
    methods: {
      homeBtnClick() {
        this.$emit("homeClick", "home")
      }
    }
  }
</script>
<style scoped>
</style>
```

-----

# 内置 keep-alive 组件

内置 keep-alive 组件的使用场景。

- 默认情况下，组件切换后会被销毁，切换回来会重新创建组件；
- 如果希望保持组件的状态，则需要使用 keep-alive。

App.vue

```vue
<template>
  <div class="app">
    <div class="tabs">
      <template v-for="(item, index) in tabs" :key="item">
        <button :class="{ active: currentTab === item }" 
                @click="itemClick(item)">
          {{ item }}
        </button>
      </template>
    </div>
    <div class="view">
      <!-- include: 组件的名称来自于组件定义时 name 选项，逗号后不能加空格 -->
      <keep-alive include="home,about">
        <component :is="currentTab"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import Home from './views/Home.vue'
  import About from './views/About.vue'
  import Category from './views/Category.vue'
  export default {
    components: {
      Home,
      About,
      Category
    },
    data() {
      return {
        tabs: ["home", "about", "category"],
        // currentIndex: 0
        currentTab: "home"
      }
    },
    methods: {
      itemClick(tab) {
        this.currentTab = tab
      },
      homeClick(payload) {
        console.log("homeClick:", payload)
      }
    }
  }
</script>
<style scoped>
  .active {
    color: red;
  }
</style>
```

子组件 Home.vue

```vue
<template>
  <div>
    <h2>Home组件</h2>
    <h2>当前计数: {{ counter }}</h2>
    <button @click="counter++">+1</button>
  </div>
</template>
<script>
  export default {
    name: "home",
    data() {
      return {
        counter: 0
      }
    },
    created() {
      console.log("home created")
    },
    unmounted() {
      console.log("home unmounted")
    },
    // 对于保持 keep-alive 组件, 监听有没有进行切换，keep-alive组件进入活跃状态
    activated() {
      console.log("home activated")
    },
    deactivated() {
      console.log("home deactivated")
    }
  }
</script>

<style scoped>
</style>
```

keep-alive 的属性

- include - string | RegExp | Array。只有名称匹配的组件会被缓存； 
- exclude - string | RegExp | Array。任何名称匹配的组件都不会被缓存； 
- max - number | string。最多可以缓存多少组件实例，一旦达到这个数字，那么缓存组件中最近没有被访问的实例会被销毁；

> keep-alive 中属性 include / exclude 实际上匹配的是组件中设置属性`name`值。

对于缓存的组件来说，再次进入时，我们是不会执行 created 或者 mounted 等生命周期函数的： 

- 但是有时候我们确实希望监听到何时重新进入到了组件，何时离开了组件；
- 这个时候我们可以使用 `activated` 和 `deactivated` 这两个生命周期钩子函数来监听；

-----

webpack 的代码分包理解，理解图解。

-----

Vue 中实现异步组件。

-----

组件的 v-model 的使用。绑定多个属性。

-----

认识 Mixin，如何使用？

-----

Options API 的缺点，认识 Composition API

-----

认识 setup 函数。