# reactive API

使用场景，

- 为 **Object / Array 类型**数据提供响应式的特性。

reactive API 响应式原理介绍，3点：

1. 使用 `reactive` 函数处理后的数据，数据再次使用时会进行依赖收集。
2. 当数据改变时，所有收集的依赖，进行对应的响应式操作（比如更新界面）。
3. 事实上，data 选项返回的对象， 也是交给 reactive 函数将其编程响应式对象的。

reactive API 的基本使用：

```vue
<script>
  import { reactive, ref } from 'vue'
  export default {
    setup() {
      // 定义响应式数据
      const account = reactive({
        username: "coderwhy",
        password: "123456"
      })
      function changeAccount() {
        account.username = "kobe"
      }
      return {
        account,
        changeAccount
      }
    }
  }
</script>
<template>
  <div>
    <h2>账号: {{ account.username }}</h2>
    <h2>密码: {{ account.password }}</h2>
    <button @click="changeAccount">修改账号</button>
  </div>
</template>
<style scoped>
</style>
```

-----

# ref API

使用场景：

- 用于处理需要响应式的数据，返回响应式对象。

认识 ref API

1. ref 意为 Reference，返回一个可变的响应式对象，该对象作为一个响应式的引用维护者它内部的值。
2. 它内部的值是在 ref 的 `value` 属性中维护的。

需要注意的是：

1. 在 \<template\> 模板中引入 ref 的值时，vue 会自动帮助我们进行解包操作，并不需要通过 `ref.value` 的方式使用。
2. 在 setup 函数内部，它依然是一个 ref 引用，所以需要通过 `ref.value` 的方式来使用。

------

如何理解Ref API的浅层解包。

- 如果ref对象在外层包裹一个对象，那么它在template模板中不会自动解包，除非外层包裹的对象是reactive对象。

Ref API的基本上使用：

```vue
<script>
  import { reactive, ref } from 'vue'
  export default {
    setup() {
      // ref 函数: 定义简单类型的数据(也可以定义复杂类型的数据)，为 counter 定义响应式数据
      const counter = ref(0)
      function increment() {
        counter.value++
      }
      // 将 ref 对象，放入到对象中，在 template 中使用时，最初是浅层解包，现已可以做到不完全的深层解包（见 template）。
      const info = {
        counter
      }
      return {
        counter,
        increment,
        info
      }
    }
  }
</script>
<template>
  <div>
    <!-- 默认情况下在template中使用ref时, vue会自动对其进行解包(取出其中value) -->
    <h2>当前计数: {{ counter }}</h2>
    <button @click="increment">+1</button>
    <button @click="counter++">+1</button>
    <!-- 使用的时候不需要写.value -->
    <h2>当前计数: {{ info.counter }}</h2>
    <!-- 修改的时候需要写.value（很少这么用） -->
    <button @click="info.counter.value++">+1</button>
  </div>
</template>
<style scoped>
</style>
```

-----

reactive 和 ref API 应该如何选择。

- 满足以下两个条件，推荐用 reactive：
	- 本地产生的数据，比如本地定义的用户名，密码。
	- 多个数据之间是有联系的，聚合的数据。
- 其它场景都推荐都使用 ref：
	- 如网络请求中获取的数据，

> ref 和 reactive 默认都能实现对象的深层响应式。

-----

在浏览器安装 Vue devtool 插件

-----

# readonly API

> Vue3 中新增的 API，Vue2 中没有这种功能。

使用场景

- 常见的，给另外一个地方（组件）传入**普通值，reactive 对象，ref 对象**时，我们希望它们是只读的，需要使用 readonly API。（默认就能做深度只读处理）

> 按照“单向数据流”的规范，在子组件中不能直接修改父组件的数据，不符合。

readonly API 的原理：

- readonly 会返回原始对象的只读代理（Proxy），这个代理对象中的 set 方法被劫持，使它不能进行修改。

readonly API结合普通对象和响应式对象的使用：

父组件 App.vue

```Vue
<script>
  import { reactive, readonly } from 'vue'
  import ShowInfo from './ShowInfo.vue'
  export default {
    components: {
      ShowInfo
    },
    setup() {
      // 本地定义多个数据, 都需要传递给子组件
      const info = reactive({
        name: "why",
        age: 18,
        height: 1.88
      })
      // 使用 readOnly 包裹 info
      const roInfo = readonly(info)
      function changeRoInfoName(payload) {
        info.name = payload
      }
      return {
        roInfo,
        changeRoInfoName
      }
    }
  }
</script>
<template>
  <h2>App: {{ info }}</h2>
  <show-info :roInfo="roInfo" @changeRoInfoName="changeRoInfoName"></show-info>
</template>
<style scoped>
</style>
```

子组件 ShowInfo.vue

```vue
<script>
  export default {
    props: {
      // readonly数据
      roInfo: {
        type: Object,
        default: () => ({})
      }
    },
    emits: ["changeRoInfoName"],
    setup(props, context) {
      function roInfoBtnClick() {
        context.emit("changeRoInfoName", "james")
      }
      return {
        showInfobtnClick,
        roInfoBtnClick
      }
    }
  }
</script>
<template>
  <div>
    <!-- 使用readonly的数据 -->
    <h2>ShowInfo: {{ roInfo }}</h2>
    <!-- 直接修改父组件中传过来的 readonly 对象，代码就会无效(报警告) -->
    <button @click="roInfo.name = 'james'">ShowInfo按钮</button>
    <!-- 正确的做法 -->
    <button @click="roInfoBtnClick">roInfo按钮</button>
  </div>
</template>
<style scoped>
</style>
```

-----

# reactive 还有哪些相关的 API

- isProxy - 检查对象是否由 `reactive` 或 `readonly` 创建的 Proxy。
- isReactive - 检查对象是否由 `reactive` 创建的响应式代理（reactive 对象包裹的 `readonly` 也会返回 true）。
- isReadonly - 检查对象是否由 `readonly` 创建的只读代理。
- toRaw - 返回 `reactive` 或 `readonly` 代理的原始对象（不建议保留对原始对象的持久引用，谨慎使用）。
- shallowReactive - 创建一个响应式代理，它跟踪自身 property 的响应式，但不执行嵌套对象的深层响应式转换（深层还是原始对象）。
- shallowReadonly - 创建一个 proxy，使其自身 property 为只读，但不执行嵌套对象的深度只读转换（深层还是可读可写的）

基本使用举例

```javascript
import { reactive, isReactive } from 'vue'
export default {
  setup() {
    const state = reactive({username: 'John'， password: '123456'})
    console.log(isReactive(state)) // true
  }
}
```

-----

# toRefs 和 toRef API。

`toRefs` 的使用场景：使 reactive 返回的对象中的属性都转成 ref，可用于 reactive 对象的解构。

```javascript
import { reactive, toRefs } from 'vue'
export default {
  setup() {
    const state = reactive({ name: 'zzt', age: 18 })
    const { name, age } = toRefs(state)
  }
}
```

`toRef` 的使用场景：将 reactive 返回的对象中的某一个属性转成 ref

```javascript
import { reactive, toRef } from 'vue'
export default {
  setup() {
    const state = reactive({ name: 'zzt', age: 18 })
    const name = toRef(state, 'name')
  }
}
```

> 这种做法相当于将解构出来的值与 reactive 返回的对象中的属性建立联系，任何一个修改都会引起另外一个变化。

-----

# ref 还有哪些相关的 API

- unref - 用于获取 ref 引用中的 value，这是 `val = isRef(val) ? val.value : val` 的语法糖函数。
- isRef - 判断值是否是一个 ref 对象。
- shallowRef - 创建一个浅层的 ref 对象。
- triggerRef - 手动触发和 shallowRef 相关联的副作用。
- customRef - 创建一个自定义 ref，对其依赖项跟踪和重新触发。

shallowRef 和 triggerRef 的结合使用案例实现。

```vue
<template>
  <h2>{{ shallowInfo }}</h2>
  <button @click="changeInfo">修改Info</button>
</template>
<script>
import { shallowRef, triggerRef } from "vue";
export default {
  setup() {
    const shallowInfo = shallowRef({ name: "zzt" });
    const changeInfo = () => {
      shallowInfo.value.name = "Lingard";
      triggerRef(shallowInfo); // 手动触发shallowRef的副作用，执行shallowInfo对象深层的响应式。
    };
    return { shallowInfo, changeInfo, };
  },
};
</script>
```

------

customRef 的使用场景，ref-debounce 案例（双向绑定属性进行节流操作）

App.vue

```vue
<template>
  <input type="text" v-model="message" />
  <h2>{{ message }}</h2>
</template>
<script>
import debounceRef from "./hook/useDebounceRef";
export default {
  setup() {
    const message = debounceRef("Hello World");
    return { message };
  },
};
</script>
```

useDebounceRef.js

```javascript
import { customRef } from 'vue'
// 自定义ref
export default function (value, delay = 300) {
  let timer = null
  return customRef((track, trigger) => {
    return {
      get() {
        track() // 收集依赖
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger() // 触发响应式
        }, delay);
      }
    }
  })
}
```

-----

setup 中不可以使用 this。

1. setup 被调用之前，data, computed, methods 等选项都没有被解析。
2. setup 函数**调用时未绑定 this**，所以它的 this 没有指向组件实例 Instance，而是 undefined。

setup 函数的执行过程

- 在阅读源码的过程中，代码是按照如下顺序执行的： 
	- 调用 createComponentInstance 创建组件实例； 
	- 调用 setupComponent 初始化component内部的操 作；
	- 调用 setupStatefulComponent 初始化有状态的组 件；
	- 在 setupStatefulComponent 取出了 setup 函数； 
	- 通过 callWithErrorHandling 的函数执行 setup；
	
	<img src="NodeAssets/setup函数执行.jpg" alt="setup函数执行" style="zoom:50%;" />
- 从上面的代码我们可以看出， 组件的 instance 肯定是在执行 setup 函数之前就创建出来的。

-----

computed API 的使用。

-----

在 setup 中获取 DOM 元素。

-----

setup 中的生命周期钩子使用。

-----

setup 中使用 Provide 和 Inject。

-----

setup 中侦听数据变化。侦听 Reactive 对象后获取普通对象。

-----

理解 Hooks 的抽取思想。案例理解 useTitle。

-----

script setup 语法糖。