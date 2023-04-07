# 一、高阶组件

## 1.是什么？

> 【回顾】高阶函数是什么？
>
> 一个函数接收另一个函数作为参数输入，或者返回一个函数作为输出，称为高阶函数。
>
> 常见的高阶函数有 `filter`，`map`，`reduce` 等等。

**高阶组件（Higher-Order Components）**，简称为 **HOC**；

官方的定义：高阶组件是参数为组件，返回值为新组件的函数，本质上还是函数；

用于对需要增强的组件进行拦截。对渲染过程做劫持。

## 2.基本使用

```jsx
import React, { PureComponent } from 'react'

// 定义高阶组件
function hoc(Cpn) {
  // 定义类组件
  class NewCpn extends PureComponent {
    render() {
      return <Cpn name='zzt' />
    }
  }
  return NewCpn
  // 定义函数式组件
  /* function NewCpn2() {
		return (
			<div>NewCpn2</div>
		)
	}
	return NewCpn2 */
}

class HelloWorld extends PureComponent {
  render() {
    return <div>HelloWorld：name-{this.props.name}</div>
  }
}

const HelloWorldHOC = hoc(HelloWorld)

export class App extends PureComponent {
  render() {
    return <HelloWorldHOC />
  }
}

export default App
```

## 3.案例理解

### 1.props 增强

03-learn-component\src\16-React 高阶组件\hoc\enhanced_props.jsx

```jsx
import { PureComponent } from 'react'

function enhanceUserInfo(OriginCpn) {
  class NewComponent extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        userInfo: {
          name: 'zzt',
          level: 99
        }
      }
    }
    render() {
      return (
        // 如果本身需要给子组件传递 props，使用 spread attribute 语法。
        <OriginCpn {...this.props} {...this.state.userInfo} />
      )
    }
  }

  return NewComponent
}

export default enhanceUserInfo
```

03-learn-component\src\16-React 高阶组件\page\About.jsx

```jsx
import React, { PureComponent } from 'react'
import enhanceUserInfo from '../hoc/enhanced_props'

class About extends PureComponent {
  render() {
    return <div>About: {this.props.name}</div>
  }
}
// 类组件增强
export default enhanceUserInfo(About)
```

03-learn-component\src\16-React 高阶组件\02-函数组件的应用.jsx

```jsx
import React, { PureComponent } from 'react'
import enhanceUserInfo from './hoc/enhanced_props'
import About from './page/About'

// 函数组件增强
const Home = enhanceUserInfo(props => (
  <h1>
    Home {props.name}-{props.level}-{props.banners}
  </h1>
))
// 函数组件增强
const Profile = enhanceUserInfo(props => (
  <h1>
    Profile: {props.name}-{props.level}
  </h1>
))

export class App extends PureComponent {
  render() {
    return (
      <div>
        <Home banners={['轮播1', '轮播2']} />
        <Profile />
        <About />
      </div>
    )
  }
}

export default App
```

总结：高阶组件并不是 React API 的一部分，它是基于 React 的组合特性而形成的**设计模式**；

> 高阶组件在一些 React 第三方库中非常常见：
>
> - 比如 _redux_ 中的 `connect`；（后续会介绍到）
> - 比如 _react-router_ 中的 `withRouter`；（后续会介绍，自行封装）

### 2.Context 共享

使用的是 `props` 劫持：

03-learn-component\src\16-React 高阶组件\context\theme-context.js

```js
import { createContext } from 'react'

const ThemeContext = createContext()
export default ThemeContext
```

03-learn-component\src\16-React 高阶组件\hoc\withTheme.jsx

```jsx
import ThemeContext from '../context/theme-context'

// 定义一个高阶组件
const withTheme = OriginCpn => props =>
  <ThemeContext.Consumer>{value => <OriginCpn {...value} {...props} />}</ThemeContext.Consumer>

export default withTheme
```

03-learn-component\src\16-React 高阶组件\page\Product.jsx

```jsx
import React, { PureComponent } from 'react'
import withTheme from '../hoc/withTheme'

export class Product extends PureComponent {
  render() {
    const { color, size } = this.props
    return (
      <div>
        <h2>
          Product: {color}-{size}
        </h2>
      </div>
    )
  }
}

export default withTheme(Product)
```

03-learn-component\src\16-React 高阶组件\03-高阶组件应用 Context 共享.jsx

```jsx
import React, { PureComponent } from 'react'
import ThemeContext from './context/theme-context'
import Product from './page/Product'

export default class App extends PureComponent {
  render() {
    return (
      <div>
        <ThemeContext.Provider value={{ color: 'red', size: 30 }}>
          <Product />
        </ThemeContext.Provider>
      </div>
    )
  }
}
```

### 3.登录鉴权

03-learn-component\src\16-React 高阶组件\hoc\loginAuth.jsx

```jsx
const loginAuth = OriginCpn => props => {
  // 从 localStorage 中获取 token
  const token = localStorage.getItem('token')
  return token ? <OriginCpn {...props} /> : <h2>请先登录，再进行跳转到对应的页面中</h2>
}

export default loginAuth
```

03-learn-component\src\16-React 高阶组件\page\Cart.jsx

```jsx
import React, { PureComponent } from 'react'
import loginAuth from '../hoc/loginAuth'

export class Cart extends PureComponent {
  render() {
    return <div>Cart Page</div>
  }
}

export default loginAuth(Cart)
```

03-learn-component\src\16-React 高阶组件\04-高阶组件应用-登录鉴权.jsx

```jsx
import React, { PureComponent } from 'react'
import Cart from './page/Cart'

export class App extends PureComponent {
  render() {
    return (
      <div>
        App
        <button onClick={e => this.loginClick()}>登录</button>
        <Cart />
      </div>
    )
  }

  loginClick() {
    localStorage.setItem('token', 'zzt')
    // forceUpdate API - 强制调用 render 方法，刷星页面，不建议使用，刷新页面最好还是通过 setState 来进行控制
    this.forceUpdate()
  }
}

export default App
```

### 4.测量页面渲染时间

使用的是生命周期劫持：

03-learn-component\src\16-React 高阶组件\hoc\LogRenderTime.jsx

```jsx
import React, { PureComponent } from 'react'

function LogRenderTime(OriginCpn) {
  return class extends PureComponent {
    // 这个生命周期已经被废弃，不建议使用
    UNSAFE_componentWillMount() {
      this.beginTime = Date.now()
    }

    componentDidMount() {
      this.endTime = Date.now()
      console.log('当前页面花费了', this.endTime - this.beginTme, 'ms 渲染完成')
    }

    render() {
      return <OriginCpn {...this.props} />
    }
  }
}

export default LogRenderTime
```

> 组件的名称问题：
>
> - 在 ES6 中，类表达式中类名是可以省略的；
> - 组件的名称都可以通过 `displayName` 来修改；

03-learn-component\src\16-React 高阶组件\page\Detai.jsx

```jsx
import React, { PureComponent } from 'react'
import LogRenderTime from '../hoc/LogRenderTime'

export class Detai extends PureComponent {
  render() {
    return (
      <div>
        <h2>Detail Page</h2>
        <ul>
          <li>数据列表</li>
          <li>数据列表</li>
          <li>数据列表</li>
          <li>数据列表</li>
          <li>数据列表</li>
          <li>数据列表</li>
          <li>数据列表</li>
          <li>数据列表</li>
          <li>数据列表</li>
          <li>数据列表</li>
        </ul>
      </div>
    )
  }
}

export default LogRenderTime(Detai)
```

03-learn-component\src\16-React 高阶组件\05-高阶函数的应用测量渲染时间.jsx

```jsx
import React, { PureComponent } from 'react'
import Detai from './page/Detai'

export class App extends PureComponent {
  render() {
    return <Detai />
  }
}

export default App
```

## 4.缺陷

由以上案例可知，利用高阶组件可以针对某些 React 代码进行更加优雅的处理。

### 1.Mixin 的缺陷

其实早期的 React 有提供组件之间的一种复用方式是 _Mixin_，目前已经不再建议使用：

_Mixin_ 可能会相互依赖，相互耦合，不利于代码维护；

不同的 _Mixin_ 中的方法可能会相互冲突；

_Mixin_ 非常多时，组件处理起来会比较麻烦，甚至还要为其做相关处理，这样会给代码造成滚雪球式的复杂性；

### 2.HOC 缺陷

当然，_HOC_ 也有自己的一些缺陷：

_HOC_ 需要在原组件上进行包裹或者嵌套，如果大量使用 _HOC_，将会产生非常多的嵌套，这让调试变得非常困难；

_HOC_ 可以劫持 `props`，多人开发时，如果不遵守约定的规范，也可能造成冲突；

### 3.Hooks 的引入

后面会介绍 _Hooks_，_Hooks_ 的出现，是开创性的，它解决了很多 React 之前的存在的问题。

比如 `this` 指向问题、比如 _HOC_ 的嵌套复杂度问题等等；

结合高阶组件的概念，理解之前的函数式组件中的 `ref` 转发。

# 二、Portals

从组件的 `render` 方法返回一个元素时，该元素将被挂载到 DOM 节点中离其最近的父节点：

某些情况下，希望渲染的内容独立于父组件，甚至是独立于当前挂载到的 DOM 元素中（默认是挂载到 `id` 为 `root` 的 DOM 元素上的）。

`createPortal` 提供了一种将子节点渲染到父组件以外的 DOM 节点的优秀的方案：

- 参数一（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 `fragment`；
- 参数二（container）是一个 DOM 元素；

03-learn-component\src\17-React 的 Portals\Modal.jsx

```jsx
import { PureComponent } from 'react'
import { createPortal } from 'react-dom'

export class Modal extends PureComponent {
  render() {
    return createPortal(this.props.children, document.querySelector('#modal'))
  }
}

export default Modal
```

03-learn-component\src\17-React 的 Portals\App.jsx

```jsx
import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import Modal from './Modal'

export class App extends PureComponent {
  render() {
    return (
      <div className='app'>
        <h1>App h1</h1>
        {createPortal(<h2>App h2</h2>, document.querySelector('#zzt'))}
        {/* modal 组件 */}
        <Modal>
          <h2>我是标题</h2>
          <p>我是内容，哈哈哈</p>
        </Modal>
      </div>
    )
  }
}

export default App
```

03-learn-component\public\index.html

```html
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <div id="zzt"></div>
  <div id="modal"></div>
</body>
```

# 三、Fragment

在之前的开发中，编写的组件，总是返回一个被 `<div>` 元素包裹的内容，如果不渲染这样一个 `<div>` 应该使用 `Fragment`；

`Fragment` 允许将子列表分组，而无需向 DOM 添加额外节点；

`Fragment` 的短语法（语法糖写法）：它看起来像空标签 `<>` `</>`，但是，如果需要在 `Fragment` 上添加 `key`，就不能使用短语法。

03-learn-component\src\18-React 的 fragment 写法\App.jsx

```jsx
import React, { Fragment, PureComponent } from 'react'

export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      sections: [
        { title: '哈哈哈', content: '我是内容，哈哈哈' },
        { title: '呵呵呵', content: '我是内容，呵呵呵' },
        { title: '嘿嘿嘿', content: '我是内容，嘿嘿嘿' },
        { title: '吼吼吼', content: '我是内容，吼吼吼' }
      ]
    }
  }
  render() {
    const { sections } = this.state

    return (
      <>
        <h2>我是 App 的标题</h2>
        {sections.map(item => (
          <Fragment key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
          </Fragment>
        ))}
      </>
    )
  }
}

export default App
```

# 四、StricteMode

## 1.是什么？

`StrictMode` 是一个用来突出显示应用程序中潜在问题的工具：

与 `Fragment` 一样，`StrictMode` 不会渲染任何可见的 UI；

它为其后代元素触发额外的检查和警告；

严格模式检查仅在开发模式下运行；它们不会影响生产构建；

## 2.检测什么？

识别不安全的生命周期：

使用过时的 ref API。

检查意外的副作用。

- 组件的 `constructor` 等生命周期会被调用两次；
- 这是严格模式下故意进行的操作，方便查看编写的逻辑代码调用多次时，是否会产生一些副作用；
  - React 18 之后，且安装了 _DevTools_ 时，第二次中的打印会显示半灰色。
- 生产环境中，没有该效果；

检查使用废弃的 `findDOMNode` 方法。

- React 早期 API 中，通过 `findDOMNode` 来获取 DOM，现在不推荐使用了，
- 一些第三方库，如 _Ant-Design_，_react-transition-group_，中还在使用这种 API。
- 消除警告的 3 种方式：
  - 关闭严格模式；
  - 修改库的源码（不推荐）；
  - 某些库提供了使用 `ref` 的方式进行替换（见下方 `CSSTransition` 案例）

检测过时的用于共享的 `Context` API。

- 早期的 `Context` 是通过组件的 `static` 属性声明其对象属性的；
- 通过 `getChildContext` 返回 `Context` 对象等方式，来使用共享数据的；现在这种方式不推荐使用，

03-learn-component\src\19-React 的严格模式\page\Profile.jsx

```jsx
import React, { PureComponent } from 'react'

export class Profile extends PureComponent {
  UNSAFE_componentWillMount() {
    console.log('UNSAFE_componentWillMount') // 会打印两次
  }
  componentDidMount() {
    console.log('Profile componentDidMount') // 会打印两次
  }
  render() {
    console.log('Profile render') // 会打印两次
    return (
      <div>
        <h2 ref='title'>Profile Title</h2>
      </div>
    )
  }
}

export default Profile
```

03-learn-component\src\19-React 的严格模式\App.jsx

```jsx
import React, { PureComponent, StrictMode } from 'react'
// import Home from './page/Home'
import Profile from './page/Profile'

export class App extends PureComponent {
  render() {
    return (
      <div>
        <StrictMode>
          {/* <Home /> */}
          <Profile />
        </StrictMode>
      </div>
    )
  }
}

export default App
```

# 五、react-transition-group

给一个组件的显示和消失添加过渡动画，可以很好的增加用户体验。

可以通过原生的 CSS 来实现这些过渡动画，

同时，React 社区也提供了 _react-transition-group_ 库用来完成过渡动画。

- React 曾为开发者提供过动画插件 _react-addons-css-transition-group_，后由社区维护，形成了现在的 _react-transition-group_。
- 这个库本身非常小，不会为我们应用程序增加过多的负担。

- 这个库可以方便的实现组件的入场和离场动画，使用时需要额外安装：
- 与 Vue 中的 `<Transition>` 内置组件一样，本质上也是在合适的时机添加编写好的样式。

## 1.安装

```shell
# npm
npm install react-transition-group
```

主要组件有以下组件

## 1.Transition

该组件是一个和平台无关的组件（不一定要结合 CSS）；

在前端开发中，我们一般是结合 CSS 来完成样式，所以比较常用的是 `CSSTransition`；

## 2.CSSTransition

`CSSTransition` 是基于 `Transition` 组件构建的：

执行过程中，有三个状态：`appear`、`enter`、`exit`；对应需要定义的 CSS 样式：

- 开始状态：对应的类是 `-appear`、`-enter`、`-exit`；
- 执行动画：对应的类是 `-appear-active`、`-enter-active`、`-exit-active`；
- 执行结束：对应的类是 `-appear-done`、`-enter-done`、`exit-done`；

`CSSTransition` 组件常见对应的属性：

- `in`：触发进入或者退出状态:
  - `in` 为 `true` 时，触发进入状态，会添加 class：`-enter`、`-enter-acitve` 开始执行动画，当动画执行结束后，会移除两个 class，并且添加 `-enter-done` 的 class；
  - `in` 为 `false` 时，触发退出状态，会添加 class: `-exit`、`-exit-active` 开始执行动画，当动画执行结束后，会移除两个 class，并且添加 `-enter-done` 的 class；
- `classNames`：动画 class 的名称 ：
  - 决定了在编写 css 时，对应的 class 名称：比如当 `classNames="card"` 时，对应的类名为：`card-enter`、`card-enter-active`、`card-enter-done`；
- `timeout`：过渡动画的时间，最好与样式中的时间保持一致（**必须添加**，否则没有动画效果）。
- `appear`：是否在初次进入时，添加动画（需要和 `in` 同时为 `true`）
- `unmountOnExit`：退出后卸载组件。
- [其他属性参考官方文档](https://reactcommunity.org/react-transition-group/transition)

`CSSTransition` 对应的钩子函数：主要为了检测动画的执行过程，来完成一些 JavaScript 的操作

- `onEnter`：在进入动画之前被触发；
- `onEntering`：在应用进入动画时被触发；
- `onEntered`：在应用进入动画结束后被触发；
- `onExit`：在离开动画之前被触发。
- `onExiting`：在应用离开动画时被触发。
- `onExited`：在应用离开动画结束后被触发。

### 1.淡入淡出动画

03-learn-component\src\20-React 的动画实现\01-CSSTransition 动画\App.jsx

```jsx
import React, { createRef, PureComponent } from 'react'
import { CSSTransition } from 'react-transition-group'
import './style.css'

export class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isShow: true
    }
    this.sectionRef = createRef()
  }
  render() {
    const { isShow } = this.state

    return (
      <div>
        <button onClick={e => this.setState({ isShow: !isShow })}>切换</button>
        {/* CSSTransition 底层用到了 findDOMNode API，在严格模式下会报警告，使用 nodeRef 关联需要执行动画的 React DOM 实例来消除警告 */}
        <CSSTransition
          nodeRef={this.sectionRef}
          classNames='zzt'
          in={isShow}
          timeout={2000}
          unmountOnExit={true}
          appear
          onEnter={e => console.log('开始进入动画')}
          onEntering={e => console.log('执行进入动画')}
          onEntered={e => console.log('执行进入结束')}
          onExit={e => console.log('开始离开动画')}
          onExiting={e => console.log('执行离开动画')}
          onExited={e => console.log('执行离开结束')}
        >
          <div className='section' ref={this.sectionRef}>
            <h2>呵呵呵</h2>
            <p>我是内容，呵呵呵</p>
          </div>
        </CSSTransition>
      </div>
    )
  }
}

export default App
```

03-learn-component\src\20-React 的动画实现\01-CSSTransition 动画\style.css

```css
/* 第一次进入动画 */
.zzt-appear {
  transform: translateX(-150px);
}
.zzt-appear-active {
  transform: translateX(0);
  transition: transform 2s ease;
}
/* 进入动画 */
.zzt-enter {
  opacity: 0;
}
.zzt-enter-active {
  opacity: 1;
  transition: opacity 2s ease;
}
/* 离开动画 */
.zzt-exit {
  opacity: 1;
}
.zzt-exit-active {
  opacity: 0;
  transition: opacity 2s ease;
}
```

## 3.SwitchTransition

`SwitchTransition` 用于完成组件之间切换的动画：

- 比如有点击按，组件从左侧退出，再次点击，组件从右侧进入；
- 这个动画在 vue 中被称之为 _Vue Transition modes_；

`SwitchTransition` 中主要有一个属性：`mode`，有两个值

- `in-out`：表示新组件先进入，旧组件再移除；
- `out-in`：表示旧组件先移除，新组建再进入；

如何使用 `SwitchTransition` 呢？

- `SwitchTransition` 组件里面要有 `CSSTransition` 或者 `Transition` 组件，不能直接包裹你想要切换的组件；
- `SwitchTransition` 里面的 `CSSTransition` 或 `Transition` 组件不再像以前那样接受 `in` 属性来判断元素是何种状态，取而代之的是 `key` 属性；

### 1.按钮切换动画

03-learn-component\src\20-React 的动画实现\02-SwitchTransition\App.jsx

```jsx
import React, { PureComponent } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import './style.css'

export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      isLogin: true
    }
  }
  render() {
    const { isLogin } = this.state

    return (
      <div>
        <SwitchTransition mode='out-in'>
          <CSSTransition key={isLogin ? 'exit' : 'login'} classNames='login' timeout={1000}>
            <button onClick={e => this.setState({ isLogin: !isLogin })}>
              {isLogin ? '退出' : '登录'}
            </button>
          </CSSTransition>
        </SwitchTransition>
      </div>
    )
  }
}

export default App
```

03-learn-component\src\20-React 的动画实现\02-SwitchTransition\style.css

```css
.login-enter {
  transform: translateX(100px);
  opacity: 0;
}
.login-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 1s ease;
}
.login-exit {
  transform: translateX(0);
  opacity: 1;
}
.login-exit-active {
  transform: translateX(-100px);
  opacity: 0;
  transition: all 1s ease;
}
```

## 4.TransitionGroup

将多个动画组件包裹在其中，一般用于列表中元素的动画；

需要将一些 `CSSTransition` 放入到一个 `TransitionGroup` 中来完成动画：

### 1.列表中添加书籍

03-learn-component\src\20-React 的动画实现\03-TransitionGroup\App.jsx

```jsx
import React, { PureComponent } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import './style.css'

export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      books: [
        { id: 111, name: '你不知道的JavaScript', price: 99 },
        { id: 222, name: 'JavaScript高级程序设计', price: 88 },
        { id: 333, name: 'Vuejs高级设计', price: 77 }
      ]
    }
  }

  render() {
    const { books } = this.state

    return (
      <div>
        <h2>书籍列表</h2>
        {/* 使用 component 属性，指定包裹的元素 */}
        <TransitionGroup component='ul'>
          {books.map((item, index) => (
            // 如果不添加 key 属性，则无法正确的执行删除动画
            <CSSTransition classNames='book' key={item.id} timeout={1000}>
              <li>
                <span>
                  {item.name}-{item.price}
                </span>
                <button onClick={e => this.removeBook(index)}>删除</button>
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
        <button onClick={e => this.addNewBook()}>添加新书籍</button>
      </div>
    )
  }

  removeBook(index) {
    const books = [...this.state.books]
    books.splice(index, 1)
    this.setState({ books })
  }

  addNewBook() {
    const books = [...this.state.books]
    books.push({ id: Date.now(), name: 'React高级程序设计', price: 99 })
    this.setState({ books })
  }
}

export default App
```

03-learn-component\src\20-React 的动画实现\03-TransitionGroup\style.css

```css
/* 进入动画 */
.book-enter {
  transform: translateX(150px);
  opacity: 0;
}
.book-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 1s ease;
}
/* 离开动画 */
.book-exit {
  transform: translateX(0);
  opacity: 1;
}
.book-exit-active {
  transform: translateX(150px);
  opacity: 0;
  transition: all 1s ease;
}
```
