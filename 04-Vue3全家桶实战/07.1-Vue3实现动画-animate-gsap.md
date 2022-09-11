两大框架对动画的支持2点

- Vue中提供了一些内置的组件和对应的API来完成动画，利用它们可以方便的实现过渡动画效果。
- React框架本身并没有提供动画相关的API，需要使用第三方库`react-transition-group`

------

如果希望单元素或者组件实现动画，可以用`transition`内置组件完成。

------

transition组件中，transition（过渡）的基本使用，必须有”from“和“to”的样式。

```vue
<template>
  <div>
    <button @click="isShow = !isShow">显示/隐藏</button>
    <transition name="zzt">
      <h2 v-if="isShow">Hello Frog</h2>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: true
    }
  },
}
</script>
<style scoped>
.zzt-enter-from,
.zzt-leave-to {
  opacity: 0;
}
/*可省略，是默认值↓*/ 
.zzt-enter-to,
.zzt-leave-from {
  opacity: 1;
}
.zzt-enter-active,
.zzt-leave-active {
  transition: opacity 1s ease;
}
</style>
```

------

transition 组件实现组件进入/离开过渡的3个情形。

- 条件渲染（v-if/v-show）
- 动态组件
- 组件根节点

------

transition 组件的工作机制3点。

1. 自动嗅探目标元素是否应用了css过渡/动画，如没有，那么在恰当的时间添加删除css类名。
2. 如果使用了transition提供的JS钩子函数，会在恰当时机被调用。
3. 如果没有找到JS钩子函数且没检查到css过渡/动画，DOM插入删除操作会立即执行。

------

transition中class的名命规则

- 如果transition上没有限定`name`属性，那么默认以`v-`开头，如 v-enter-from。

------

transition中用于过度的6个class，vue会在这些class之间来回切换完成动画。

1. v-enter-from：定义进入过渡的开始状态，在元素被插入之前生效，在元素被插入之后的下一帧移除。
2. v-enter-active：定义过渡生效时的状态，在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。
   - 这个类可用来定义进入过渡的过程时间，延迟和曲线函数。
3. v-enter-to：定义进入过渡的结束状态，在元素被插入的下一帧生效（与此同时v-enter-from被移除），在过渡/动画完成后移除。
4. v-leave-from：定义离开过渡的开始状态，在离开过度被触发时立刻生效，下一帧被移除。
5. v-leave-active：定义离开过渡生效时的状态，在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。
   - 这个类可以用来定义离开过渡的过程时间，延迟和曲线函数。
6. v-leave-to：离开过渡的结束状态，在离开过渡被触发后下一帧生效（与此同时v-leave-from被删除），在过渡/动画完成之后移除。

------

理解transition中class添加的时机图。

------

transition中css帧动画的基本使用。

```vue
<template>
  <button @click="isShow = !isShow">显示/隐藏</button>
  <transition name="zzt">
    <h2 class="title" v-if="isShow">Hello Frog</h2>
  </transition>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      isShow: true
    }
  },
}
</script>
<style scoped>
.app {
  width: 200px;
  margin: 0 auto;
}
.title {
  /*行内元素（如span）默认情况下是inline，变化它的大小，宽度，高度，位移等等会有限制，需要将它变为inline-block解除一些限制。*/
  display: inline-block;
}
.zzt-enter-active {
  animation: bounce 1s ease;
}
.zzt-leave-active {
  animation: bounce 1s ease reverse;
}
@keyframes bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

------

transition 会根据元素/组件的锚点来执行动画，所以若动画效果夸张，需要调整它的样式。

------

使用transition（过渡）和animation（动画）结合来实现动画。

```vue
<template>
  <div class="app">
    <div>
      <button @click="isShow = !isShow">显示/隐藏</button>
    </div>
    <transition name="zzt">
      <h2 class="title" v-if="isShow">Hello Frog</h2>
    </transition>
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      isShow: true
    }
  },
}
</script>
<style scoped>
.app {
  width: 200px;
  margin: 0 auto;
}
.title {
  display: inline-block;
}
.zzt-enter-from,
.zzt-leave-to {
  opacity: 0;
}
.zzt-enter-active,
.zzt-leave-active {
  transition: opacity 1s ease;
}
.zzt-enter-active {
  animation: bounce 1s ease;
}
.zzt-leave-active {
  animation: bounce 1s ease reverse;
}
@keyframes bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

------

设置transition或animation其中的一个，vue如何作监听：

- 自动识别类型并设置监听。

同时设置transition和animation，vue如何监听：

1. 这种情况下某一动画执行结束时，另一个动画还没结束。

2. 需要设置`type`属性为transition或animation来明确告知Vue监听的类型。以指定type的执行时间为准, 

   ```vue
   <template>
       <transition name="zzt" type="animation">
         <h2 class="title" v-if="isShow">Hello Frog</h2>
       </transition>
   </template>
   ```

------

transition组件`duration`属性的使用场景，

- 显示的来指定过渡时间。

duration 可设置2种类型的值：

- Number类型，同时设置进入和离开的过渡时间。

  ```vue
  <template>
		<transition name="zzt" :duration="1000">
			<h2 class="title" v-if="isShow">Hello Frog</h2>
		</transition>
  </template>
  ```

- Object类型：分别设置进入和离开的过渡时间：

  ```vue
  <template>
  	<transition name="zzt" :duration="{enter: 800, leave: 1000}">
  		<h2 class="title" v-if="isShow">Hello Frog</h2>
  	</transition>
  </template>
  ```

------

transition组件`mode`属性的使用场景，

- 默认情况下新老元素进入和离开过渡是同时发生的，如果不希望同时执行，需要设置transition的过渡模式。

mode可设置的2个值：

- in-out：新元素先过渡进入，完成之后老元素过渡离开。
- out-in：老元素先过渡离开，完成之后新元素过渡进入。

```vue
<template>
	<transition name="zzt" mode="out-in">
		<h2 class="title" v-if="isShow">Hello Frog</h2>
		<h2 class="title" v-else>你好啊,李银河</h2>
	</transition>
</template>
```

------

transition组件`appear`属性的使用场景：

- 默认情况下，首次渲染是没有动画的，如果我们希望给它添加上动画，那么就可以添加属性`appear`

```vue
<template>
	<transition name="zzt" appear>
    <component :is="isShow ? 'Hone' : 'About'"></component>
	</transition>
</template>
```

------

transition组件中自定义过渡class6个：

- enter-from-class
- enter-active-class
- enter-to-class
- leave-from-class
- leave-active-class
- leave-to-class

**它们的优先级高于普通的类名，**

对于Vue的过渡系统和其它第三方css动画库，如`animate.css`结合使用十分有用。

------

什么是animate.css

- animate.css是一个准备好的、**跨平台的**动画库，其中帮我们定义了大量css动画相关的**序列帧**以及**类**，我们只需要添加类或使用动画名即可。

animate.css使用步骤：

1. 安装animate.css

   ```shell
   npm install animate.css
   ```

2. 在`main.js`中引入animate.css

   ```javascript
   import "animate.css"
   ```

3. 使用的时候有两种用法：

   - 使用animate库提供给我们的类。

     ```vue
     <template>
       <transition
         enter-active-class="animate__animated animate__backInUp"
         leave-active-class="animate__animated animate__backOutRight">
         <component :is="isShow ? 'home' : 'about'" />
       </transition>
     </template>
     <!-- script... -->
     <style>
       .animate__backOutRight {
         /*离开时使用动画反转*/
         animation-direction: reverse;
       }
     </style>
     ```

   - 使用animate库中定义的 keyframes 动画。

     ```vue
     <template>
       <button @click="isShow = !isShow">显示/隐藏</button>
     	<transition name="zzt">
       	<h2 class="title" v-if="isShow">Hello Frog</h2>
       </transition>
     </template>
     <!-- script... -->
     <style scoped>
     .app {
       width: 200px;
       margin: 0 auto;
     }
     .title {
       display: inline-block;
     }
     .zzt-enter-active {
       animation: flip 1s;
     }
     .zzt-leave-active {
       /*离开时使用动画反转*/
       animation: flip 1s reverse;
     }
     </style>
     ```

------

什么是gsap库2点：

1. gsap是The GreenSock Animation Platform（GreenSock动画平台）的缩写。
2. 它可以通过JavaScript为css属性，svg，canvas等设置动画，并且是浏览器兼容的。

使用步骤：

1. 安装gsap库。

   ```shell
   npm install gsap
   ```

2. `xxx.vue`文件中导入gsap库。

   ```javascript
   import gsap from 'gsap'
   ```

3. 使用对应的api

------

transition组件上给我们提供了8个JavaScript钩子

- beforEnter
- enter
- afterEnter
- enterCancelled
- beforeLeave
- leave
- afterLeave
- leaveCancelled

与gsap库结合使用。

```vue
<template>
  <div class="app">
    <div>
      <button @click="isShow = !isShow">显示/隐藏</button>
    </div>
    <transition @enter="enter" @leave="leave" :css="false">
      <h2 class="title" v-if="isShow">Hello Frog</h2>
    </transition>
  </div>
</template>
<script>
import gsap from 'gsap'
export default {
  name: "",
  data() {
    return {
      isShow: true
    };
  },
  methods: {
    enter(ele, done) {
      // gsap.to(target, {})
      gsap.from(ele, {
        scale: 0,
        x: 200,
        onComplete: done // 进行done回调
      })
    },
    leave(ele, done) {
      gsap.to(ele, {
        scale: 0,
        x: 200,
        onComplete: done // 进行done回调
      })
    }
  }
}
</script>
<style scoped>
.app {
  width: 200px;
  margin: 0 auto;
}
.title {
  display: inline-block;
}
</style>
```

------

transition上的`css`属性有什么用：

- 添加`:css="false"`，会让vue跳过css的检测，除了性能略高之外，可以避免过渡过程中css规则的影响

JS钩子函数中的done怎么用：

- 当我们使用JavaScript钩子来执行过渡动画时，需要进行done回调，否则它们将会被同步调用，过渡会立即完成。

------

使用gasp实现数字滚动变化的效果。

```vue
<template>
  <div class="app">
    <input type="number" step="100" v-model="counter" />
    <h2>当前计数： {{ showCounter }}</h2>
  </div>
</template>
<script>
import gsap from 'gsap'//
export default {
  name: "",
  data() {
    return {
      counter: 0,
      number: 0
    };
  },
  computed: {
    showCounter() {
      return this.number.toFixed(0)
    }
  },
  watch: {
    counter(newValue) {
      gsap.to(this, {
        duration: 1,
        number: newValue // 给showNumber赋值
      })
    }
  }
}
</script>
<style scoped>
.div {
  background-color: #fff;
}
</style>
```

------

transition-group 内置组件的使用场景。

- 以上案例中，过渡针对的都是单个元素或组件，或同一时间渲染多个节点中的一个。
- 如果我们希望渲染的是一个列表，并且该列表中添加删除数据也希望有动画执行要使用`transition-group`

transition-group的4个特点：

1. 默认情况下，它不会渲染一个元素的包裹器（根元素），但可以使用`tag` attribute指定一个元素作为包裹器并渲染。
2. 过渡模式不可用（mode属性没效），因为不再相互切换特有的元素。
3. 内部元素总是需要提供唯一`key` attribute值。(一般列表使用for渲染，都会添加key)
4. css过渡的类将会应用在内部的元素中，而不是这个组/容器本身。

------

transition-group的基本使用，实现列表元素添加/删除的动画。

```vue
<template>
  <div>
    <button @click="addNum">添加数字</button>
    <button @click="removeNum">删除数字</button>
    <button @click="shuffle">数字洗牌</button>
    <transition-group tag="p" name="zzt">
      <span v-for="item in numbers" :key="item" class="item">{{ item }}</span>
    </transition-group>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: '',
  data() {
    return {
      numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      numberCounter: 10
    }
  },
  methods: {
    // 新增数字
    addNum() {
      this.numbers.splice(this.randomIndex(), 0, this.numberCounter++)
    },
    // 删除数字
    removeNum() {
      this.numbers.splice(this.randomIndex(), 1)
    },
    // 数字洗牌
    shuffle() {
      this.numbers = _.shuffle(this.numbers)
    },
    // 获取随机数
    randomIndex() {
      return Math.floor(Math.random() * this.numbers.length)
    }
  },
}
</script>
<style scoped>
.item {
  margin-right: 10px;
  /*行内元素（如span）默认情况下是inline，变化它的大小，宽度，高度，位移等等会有限制，需要将它变为inline-block解除一些限制。*/
  display: inline-block;
}
.zzt-enter-from,
.zzt-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.zzt-enter-active,
.zzt-leave-active {
  transition: all 1s ease;
}
</style>
```

------

transition-group 实现列表过度中组件移动的动画，通过`v-move`的class来使用。

```vue
<style scoped>
.zzt-leave-active {
  /*使移除的元素脱离标准流，实现流畅的动画效果。*/
  position: absolute;
}
.zzt-move {
  /*不需要告知 transform, translate 的具体大小，vue会自动帮助我们处理。*/
  transition: transform 1s ease;
}
</style>
```

------

transition-group 结合gsap实现列表元素交错过渡的效果，注意元素上`data-xxx`的使用

```vue
<template>
  <div>
    <input type="text" v-model="keyword" />
    <transition-group
      tag="ul"
      name="zzt"
      :css="false"
      @beforeEnter="beforeEnter"
      @enter="enter"
      @leave="leave">
      <li v-for="(item, index) in showNames" :key="item" :data-index="index">{{ item }}</li>
    </transition-group>
  </div>
</template>
<script>
import gsap from "gsap";
export default {
  name: "",
  data() {
    return {
      names: ["abc","cba","nba","zzt","Lingard","Ronaldo","Debruyne","Salah",],
      keyword: "",
    };
  },
  computed: {
    showNames() {
      return this.names.filter((item) => item.includes(this.keyword));
    },
  },
  methods: {
    // 进入时给一个初始状态。
    beforeEnter(ele) {
      ele.style.opacity = 0;
      ele.style.height = 0;
    },
    enter(ele, done) {
      // 也可以在这使用gsap.from，不使用beforeEnter
      gsap.to(ele, {
        opacity: 1,
        height: "1.5em",
        // 根据数组中元素的索引，设置动画延迟时间
        delay: ele.dataset.index * 0.5,
        onComplete: done,
      });
    },
    leave(ele, done) {
      gsap.to(ele, {
        opacity: 0,
        height: "0",
        delay: ele.dataset.index * 0.5,
        onComplete: done,
      });
    },
  },
};
</script>
```

