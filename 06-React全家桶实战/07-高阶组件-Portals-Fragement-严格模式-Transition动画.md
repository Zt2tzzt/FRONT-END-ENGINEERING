# React 高阶组件

什么是高阶函数？

- 接收一个函数作为参数输入，或者返回一个函数作为输出的函数，称为高阶函数。
- 常见的高阶函数有 filter，map，reduce 等等。

什么是高阶组件？

- 高阶组件的英文是 Higher-Order Components，简称为 HOC；
- 官方的定义：高阶组件是参数为组件，返回值为新组件的函数；
- 用于对需要增强的组件进行拦截。对渲染过程做劫持。

## 基本使用

```jsx
import React, { PureComponent } from 'react'

// 定义高阶组件
function hoc(Cpn) {

	// 定义类组件
	class NewCpn extends PureComponent {
		render() {
			return (
				<Cpn name="zzt" />
			)
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
		return (
			<div>HelloWorld</div>
		)
	}
}

const HelloWorldHOC = hoc(HelloWorld)

export class App extends PureComponent {
	render() {
		return (
			<HelloWorldHOC />
		)
	}
}

export default App
```

## 应用一 props 增强

03-learn-component\src\16-React高阶组件\hoc\enhanced_props.jsx

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

03-learn-component\src\16-React高阶组件\page\About.jsx

```jsx
import React, { PureComponent } from 'react'
import enhanceUserInfo from '../hoc/enhanced_props'

class About extends PureComponent {
	render() {
		return (
			<div>About: {this.props.name}</div>
		)
	}
}
// 类组件增强
export default enhanceUserInfo(About)
```

03-learn-component\src\16-React高阶组件\02-函数组件的应用.jsx

```jsx
import React, { PureComponent } from 'react'
import enhanceUserInfo from './hoc/enhanced_props';
import About from './page/About'

// 函数组件增强
const Home = enhanceUserInfo((props) => (
	<h1>Home {props.name}-{props.level}-{props.banners}</h1>
))
// 函数组件增强
const Profile = enhanceUserInfo(props => (
	<h1>Profile: {props.name}-{props.level}</h1>
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

总结：

- 高阶组件并不是 React API 的一部分，它是基于 React 的 组合特性而形成的设计模式；

> 高阶组件在一些 React 第三方库中非常常见：
> - 比如 redux 中的 connect；（后续会讲到）
> - 比如 react-router 中的 withRouter；（后续会讲到）

## 应用二 Context 共享

使用的是 props 劫持

03-learn-component\src\16-React高阶组件\context\theme-context.js

```js
import { createContext } from 'react';

const ThemeContext = createContext()
export default ThemeContext
```

03-learn-component\src\16-React高阶组件\hoc\withTheme.jsx

```jsx
import ThemeContext from '../context/theme-context'

const withTheme = OriginCpn => props => (
	<ThemeContext.Consumer>
		{
			value => (
				<OriginCpn {...value} {...props} />
			)
		}
	</ThemeContext.Consumer>
)

export default withTheme
```

03-learn-component\src\16-React高阶组件\page\Product.jsx

```jsx
import React, { PureComponent } from 'react'
import withTheme from '../hoc/withTheme';

export class Product extends PureComponent {
	render() {
		const { color, size } = this.props
		return (
			<div>
				<h2>Product: {color}-{size}</h2>
			</div>
		)
	}
}

export default withTheme(Product)
```

03-learn-component\src\16-React高阶组件\03-高阶组件应用Context共享.jsx

```jsx
import React, { PureComponent } from 'react'
import ThemeContext from './context/theme-context';
import Product from './page/Product';

export default class App extends PureComponent {
	render() {
		return (
			<div>
				<ThemeContext.Provider value={{color: 'red', size: 30}}>
					<Product />
				</ThemeContext.Provider>
			</div>
		)
	}
}
```

## 登录鉴权

03-learn-component\src\16-React高阶组件\hoc\loginAuth.jsx

```jsx
const loginAuth = OriginCpn => props => {
	// 从 localStorage 中获取 token
	const token = localStorage.getItem('token')
	return token ? <OriginCpn {...props} />
		: <h2>请先登录，再进行跳转到对应的页面中</h2>
}

export default loginAuth
```

03-learn-component\src\16-React高阶组件\page\Cart.jsx

```jsx
import React, { PureComponent } from 'react'
import loginAuth from '../hoc/loginAuth';

export class Cart extends PureComponent {
	render() {
		return (
			<div>Cart Page</div>
		)
	}
}

export default loginAuth(Cart)
```

03-learn-component\src\16-React高阶组件\04-高阶组件应用-登录鉴权.jsx

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
		// forceUpdate API - 强制调用 render 方法，刷星页面，不建议使用，刷新页面最好还是通过 state 来进行控制
		this.forceUpdate()
	}
}

export default App
```

## 测量页面渲染时间

使用的是生命周期劫持。

03-learn-component\src\16-React高阶组件\hoc\LogRenderTime.jsx

```jsx
import React, { PureComponent } from 'react'

function LogRenderTime(OriginCpn) {
	return class extends PureComponent {
		// 这个生命周期已经被废弃，不建议使用
		UNSAFE_componentWillMount() {
			this.beginTme = Date.now()
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

- 组件的名称问题：
	- 在 ES6 中，类表达式中类名是可以省略的；
	- 组件的名称都可以通过 `displayName` 来修改；

03-learn-component\src\16-React高阶组件\page\Detai.jsx

```jsx
import React, { PureComponent } from 'react'
import LogRenderTime from '../hoc/LogRenderTime';

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

03-learn-component\src\16-React高阶组件\05-高阶函数的应用测量渲染时间.jsx

```jsx
import React, { PureComponent } from 'react'
import Detai from './page/Detai'

export class App extends PureComponent {
	render() {
		return (
			<div>
				<Detai />
			</div>
		)
	}
}

export default App
```

# 高阶函数的意义

我们会发现利用高阶组件可以针对某些 React 代码进行更加优雅的处理。

其实早期的 React 有提供组件之间的一种复用方式是 mixin，目前已经不再建议使用：

- Mixin 可能会相互依赖，相互耦合，不利于代码维护；
- 不同的 Mixin 中的方法可能会相互冲突；
- Mixin 非常多时，组件处理起来会比较麻烦，甚至还要为其做相关处理，这样会给代码造成滚雪球式的复杂性；

当然，HOC 也有自己的一些缺陷：

- HOC 需要在原组件上进行包裹或者嵌套，如果大量使用 HOC，将会产生非常多的嵌套，这让调试变得非常困难；
- HOC 可以劫持 props，在不遵守约定的情况下也可能造成冲突；

Hooks 的出现，是开创性的，它解决了很多 React 之前的存在的问题

- 比如 this 指向问题、比如 hoc 的嵌套复杂度问题等等；
- 后续我们还会专门来学习 hooks 相关的知识，敬请期待；

结合高阶组件的概念，理解之前的函数式组件中的 ref 转发。

# Portals 的使用。

- 通常来讲，当你从组件的 render 方法返回一个元素时，该元素将被挂载到 DOM 节点中离其最近的父节点：
- 某些情况下，我们希望渲染的内容独立于父组件，甚至是独立于当前挂载到的 DOM 元素中（默认都是挂载到 id 为 root 的 DOM 元素上的）。
- Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案：
	- 第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment；
	- 第二个参数（container）是一个 DOM 元素；


03-learn-component\src\17-React的Portals\Modal.jsx

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

03-learn-component\src\17-React的Portals\App.jsx

```jsx
import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import Modal from './Modal'

export class App extends PureComponent {
	render() {
		return (
			<div className='app'>
				<h1>App h1</h1>
				{
					createPortal(<h2>App h2</h2>, document.querySelector('#zzt'))
				}
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

Fragment 的使用，

- 在之前的开发中，我们总是在一个组件中返回内容时包裹一个 div 元素：
- 我们有时希望可以不渲染这样一个 div 应该如何操作呢？
	- 使用 Fragment
	- Fragment 允许你将子列表分组，而无需向 DOM 添加额外节点；
- React 还提供了 Fragment 的短语法：
	- 它看起来像空标签 `<>` `</>`（语法糖写法）；
	- 但是，如果我们需要在 Fragment 中添加 key，那么就不能使用短语法

03-learn-component\src\18-React的fragment写法\App.jsx

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
				{
					sections.map(item => (
						<Fragment key={item.title}>
							<h2>{item.title}</h2>
							<p>{item.content}</p>
						</Fragment>
					))
				}
			</>
		)
	}
}

export default App
```

# StricteMode 严格模式

StrictMode 是一个用来突出显示应用程序中潜在问题的工具：

- 与 Fragment 一样，StrictMode 不会渲染任何可见的 UI；
- 它为其后代元素触发额外的检查和警告；
- 严格模式检查仅在开发模式下运行；它们不会影响生产构建；

严格模式检查什么？

- 1.识别不安全的生命周期：
- 2.使用过时的 ref API
- 3.检查意外的副作用

	- 这个组件的 constructor 等生命周期会被调用两次；
	- 这是严格模式下故意进行的操作，让你来查看在这里写的一些逻辑代码被调用多次时，是否会产生一些副作用；React18 之后，且安装了 DevTools 时，第二次中的打印会显示半灰色。
	- 在生产环境中，是不会被调用两次的；

- 4.使用废弃的 findDOMNode 方法
- 在之前的 React API 中，可以通过 findDOMNode 来获取 DOM，不过已经不推荐使用了，
	- 一些第三方库，比如 Ant-Design 中还在使用这种 API。
	  - 消除警告的3种方式：1.关闭严格模式；2.修改库的源码；3.使用 ref

- 5.检测过时的 context API

	- 早期的 Context 是通过 static 属性声明 Context 对象属性，通过 getChildContext 返回 Context 对象等方式来使用 Context 的；目前这种方式已经不推荐使用，

03-learn-component\src\19-React的严格模式\page\Profile.jsx

```jsx
import React, { PureComponent } from 'react'

export class Profile extends PureComponent {
	UNSAFE_componentWillMount() {
		console.log('UNSAFE_componentWillMount');
	}
	componentDidMount() {
		console.log('Profile componentDidMount')
	}
	render() {
		console.log('Profile render');

		return (
			<div>
				<h2 ref="title">Profile Title</h2>
			</div>
		)
	}
}

export default Profile
```

03-learn-component\src\19-React的严格模式\App.jsx

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


* react-transition-group 介绍。
* react-transition-group 介绍。
	- 主要组件有哪些？
	- CSSTransition 组件的使用。常见属性。狗子函数。
	- SwitchTransition 有什么用？
	- TransitionGroup 的使用。

