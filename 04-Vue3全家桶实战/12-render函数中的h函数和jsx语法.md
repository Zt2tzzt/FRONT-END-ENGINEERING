# 认识 h 函数

h 函数，就是我们常说的 createVNode 函数。

## 使用场景

Vue 推荐在绝大数情况下使用模板（template）来创建你的 HTML 元素，
一些特殊的场景，你真的需要 JavaScript 的完全编程的能力，这个时候你可以使用渲染（render）函数 ，它比模板更接近编译器；

## template 模板到 VNode 的过程：

template -> compiler 编译 -> render 函数（返回 createVNode 函数） -> VNode ( -> 渲染器 patch / 挂载 -> 真实 DOM -> 显示在页面上)

## render 函数 option 的介绍：

1. option 选项 render 函数，不支持在`<script setup>`中编写，如果要在顶层语法中使用，必须要在 `<template>` 中将 render 函数当作组件使用。
2. render 函数是组件中的一个选项 option，它要求返回一个 VNode 对象，一般使用 h 函数生成这个 VNode 对象。

## h 函数的介绍2点：

1. h 函数是一个用于创建 VNode 对象的函数。
2. h 函数更准确的名命是`createVNode`函数，简化为 h，推测源于 hyperscript 工具，它是一个基于 JavaScript 编写模板的工具。


## render 函数与 h 函数的区别

render 函数是 Vue 中的一个选项 option，它需要返回一个 h 函数或 jsx 代码，

h 函数才是真正用于创建 VNode 的函数。

代码解释 render 函数与 h 函数之间的关系：

```javascript
export default {
  render() {
    return h(tag, props, children)
  }
}
```

## 基本使用

h 函数接收哪3个参数，

1. `tag`(String | Object | Function)：表示 html 元素 / 组件 / 异步组件、函数式组件。
2. `props`(Object)：表示：在模板中使用的 attribute / props / 事件。
3. `children`(String | Array | Object)：表示文本 / 用 `h()` 创建的子 VNodes / 有插槽的对象。

> 如果没有 props，children 可作为第二参数，但为了避免歧义，最好还是将 `null` 作为第二参数。

```vue
<script>
// vue3 中需要导入 h，方便代码抽取，vue2 中是 render(h)，即在 render 函数中传入 h 函数。
import { h } from 'vue'
  
export default {
  render() {
    return h('h2', { class: 'title' }, 'Hello Render')
  }
}
</script>
```

## VOA 实现计数器案例：

### 写法一：

使用 render option 结合 data option

```vue
<script>
import { h } from 'vue'
  
export default {
  data() {
    return { counter: 0 }
  },
  // render 中绑定了 this
  render() {
    return h('div', { class: 'app' }, [
      // ${} 模板字符串语法
      h('h2', null, `当前计数: ${this.counter}`),
      // h 函数中事件绑定使用 on 前缀
      h('button', { onClick: () => this.counter++ }, '+1'),
      h('button', { onClick: () => this.counter-- }, '-1'),
    ])
  }
}
</script>
```

### 写法二：

使用 render option 结合 setup option

```vue
<script>
import { h, ref } from 'vue'
  
export default {
  setup() {
    const counter = ref(0)
    return { counter }
  },
  render() {
    return h('div', { class: 'app' }, [
      h('h2', null, `当前计数: ${this.counter}`),
      h('button', { onClick: () => this.counter++ }, '+1'),
      h('button', { onClick: () => this.counter-- }, '-1'),
    ])
  }
}
</script>
```

## VCA 实现计数器案例：

### 写法一，

render 函数作为 setup 返回值，放在 setup 中：

```vue
<script>
import { h } from 'vue'
  
export default {
  setup() {
    const counter = ref(0)
    return function render() {
      return h('div', { class: 'app' }, [
        // 在 render 函数中，不能写 this，需要用 xxx.value 将 ref 对象解包。
        h('h2', null, `当前计数: ${ counter.value }`),
        h('button', { onClick: () => counter.value++ }, '+1'),
        h('button', { onClick: () => counter.value-- }, '-1'),
    	])
    }
  }
}
</script>
```

### 写法二：

在顶层语法中使用 render 函数：

- 必须将 render 函数作为组件，在 template 中使用

```vue
<script setup>
import { ref, h } from 'vue';
import Home from './Home.vue'

const counter = ref(0)
const increment = () => {
  counter.value++
}
const decrement = () => {
  counter.value--
}
const render = () => h("div", { className: "app" }, [
  h("h2", null, `当前计数: ${counter.value}`),
  h("button", { onClick: increment }, "+1"),
  h("button", { onClick: decrement }, "-1"),
  h(Home)
])
</script>

<template>
	<!-- 必须将 render 函数作为组件，在 template 中使用 -->
  <render/>
</template>
```

## h 函数中使用组件的写法：

App.vue

```vue
<script>
import { h } from 'vue'
import HelloFrog from './HelloFrog.vue'

export default {
  render() {
    // 直接使用组件对象
    return h(HelloFrog, null, null)
  }
}
</script>
```

HelloFrog.vue

```vue
<script>
import { h } from 'vue'
  
export default {
  render() {
    return h('h2', null, 'Hello Frog')
  }
}
</script>
```

## h 函数中使用插槽及作用域插槽的写法：

App.vue

```vue
<script>
import { h } from 'vue'
import HelloFrog from './HelloFrog.vue'

export default {
  render() {
    // 使用插槽，h() 第三个参数用对象 {}
    return h(HelloFrog, null,
      /*
      	- default 是要使用的插槽的名称。是一个函数，
        - 可接收参数 props，里面是子组件的作用域插槽传递给父组件的参数。
        - 返回一个用 h() 生成的要传入插槽的 VNode。
      */
     	{
      	default: props => h('span', null, `app 传入到 HelloFrog 中的内容：${props.name}`),
        title: props => h('span', null, `app 传入到 HelloFrog - title 中的内容：${props.title}`) 
      }
    )
  }
}
</script>
```

HelloFrog.vue

```vue
<script>
import { h } from 'vue'
  
export default {
  render() {
    return h('div', null, [
      h('h2', null, 'Hello Frog'),
      /* 
      	插槽用 h 函数来体现，返回一个 VNode，
      	 - 插入了内容，则通过 $slot 调用该函数，返回一个 VNode，
      	 - 没插入内容，则调用默认的 h 函数返回一个 VNode
      */
      this.$slots.default ? this.$slots.default({ name: 'zzt' })
      : h('span', null, '我是Hello Frog组件的插槽默认值'),
      this.$slots.title ? this.$slots.title({ title: 'abaaba' })
      : h('span', null, '我是Hello Frog - tilte组件的插槽默认值')
    ])
  }
}
</script>
```

# 认识 jsx

> jsx 是 JavaScript Extension 的简称。

在 Vue 中生成 VNode 的3种方式

- template 通过 vuew-loader 转化（常用）。
- render 函数不需要转化，直接调用。
- jsx 通过 babel 转化。

babel 有什么用？

- babel 最早用于将浏览器中的 es6 及以上代码，转为向下兼容的代码，现在也可以做一些语法上的转化，本质上是一个编译器。

比如：es6 -> es5; ts -> js; jsx -> js;

## jsx 支持环境配置

jsx 通过 babel 进行转换，配置对 jsx 的支持2步

1. 安装 babel 针对 vue 的 jsx 语法转化插件：

   ```shell
   npm install @vue/babel-plugin-jsx -D # webpack 环境
	npm install @vitejs/plugin-vue-jsx -D # vite 环境
   ```

2. 修改配置文件

	webpack 环境下，在项目根目录新建 `babel.config.js` 在其中配置预设和插件：

	```javascript
	module.exports = {
		presets: ['@vue/cli-plugin-babel/preset'],
		plugin: ['@vue/babel-plugin-jsx']
	}
	```

	vite 环境下，在 `vite.config.js` 中进行配置

	```js
	import { fileURLToPath, URL } from 'node:url'
	import { defineConfig } from 'vite'
	import vue from '@vitejs/plugin-vue'
	import jsx from '@vitejs/plugin-vue-jsx'

	export default defineConfig({
		plugins: [
			vue(),
			jsx()
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			}
		}
	})

	```

> 实际上，目前 Vue CLI 创建的 webpack 项目已默认支持 jsx，可不用配置。
>
> 但在 Vite 脚手架创建的 Vite 项目环境中，仍需配置。

## 基本使用

使用 jsx 语法时，需要在 `<script>` 标签上，加上属性 `lang="jsx"`

```vue
<script lang="jsx">
// ...
</script>
```

HelloFrog.vue

```jsx
export default {
  render() {
    return <div>Hello Frog</div>
  }
}
```

## 实现案例，引用组件，实现插槽：

使用 jsx 实现计数器案例，并引用组件，实现插槽：

App.vue（使用 VCA setup option）

```jsx
import HelloFrog from "./HelloFrog.vue";
import { ref } from 'vue'

export default {
  setup() {
    const counter = ref(0)
    const increment = () => counter.value++
    const decrement = () => counter.value--
    return function render() {
      // 使用 () 包裹
      return (
        <div>
          <!-- jsx 特殊语法使用 {} 引用值 -->
          <h2>当前计数：{ counter.value }</h2>
          <!-- 使用 on 前缀来绑定事件 -->
          <button onClick={ increment }>+1</button>
          <button onClick={ decrement }>-1</button>
          <!-- 引用子组件 -->
          <HelloFrog>
            <!-- 使用插槽，在 {} 中写引用值，每个插槽函数需要放在一个对象 {} 中 -->
            {{
              default: props => <button>{ props.name }</button>,
              title: props => <button>{ props.title }</button>
            }}
          </HelloFrog>
        </div>
      )
    }
  }
}
```

HelloFrog.js（使用 VOA）

```jsx
export default {
  render() {
    return (
      <div>
        <h2>Hello Frog</h2>
        <!-- 在 {} 中引用值 -->
        { this.$slots.default ? this.$slots.default({ name: 'zzt' }) : <span>哈哈哈</span> }
        { this.$slots.title ? this.$slots.title({ title: 'title' }) : <span>嘿嘿嘿</span> }
      </div>
    )
  }
}
```

HelloFrog.js（使用  VCA setup option）

```jsx
export default {
  // 使用 setup 的 ctx 属性 slots
  setup(props, { slots }) {
    return function render() {
      return (
        <div>
          <h2>Hello Frog</h2>
          <!-- 在 {} 中应用值 -->
          { slots.default ? slots.default({ name: 'zzt' }) : <span>哈哈哈</span> }
          { slots.title ? slots.title({ title: 'title' }) : <span>嘿嘿嘿</span> }
        </div>
      )
    }
  }
}
```

HelloFrogs.js （使用 VCA 顶层写法）

```jsx
<script setup lang="jsx">
import { useSlots } from 'vue'
  
const slots = useSlots()
const jsx = () => (
  <div>
    <h2>Hello Frog</h2>
    {/* 在 {} 中应用值  */}
    { slots.default ? slots.default({ name: 'zzt' }) : <span>哈哈哈</span> }
    { slots.title ? slots.title({ title: 'title' }) : <span>嘿嘿嘿</span> }
  </div>
)
</script>

<template>
	<jsx />
</template>
```

