# React 的更新机制，更新流程。

我们在前面已经学习React的渲染流程：

- JSX -> 虚拟 DOM => 真实 DOM

那么React的更新流程呢？

- props / state 改变 -> render 函数重新执行 -> 产生新的 DOM Tree -> 新旧 DOM 进行 diff -> 计算出差异进行更新 -> 更新到正式 DOM

# React 中的 diff 算法

- React在props或state发生改变时，会调用React的render方法，会创建一颗不同的树。
- React需要基于这两颗不同的树之间的差别来判断如何有效的更新UI：
	- 如果一棵树参考另外一棵树进行完全比较更新，那么即使是最先进的算法，该算法的复杂程度为 O(n³)，其中 n 是树中元素的数量；
	- 如果在 React 中使用了该算法，那么展示 1000 个元素所需要执行的计算量将在十亿的量级范围；
	- 这个开销太过昂贵了，React的更新性能会变得非常低效；
- 于是，React对这个算法进行了优化，将其优化成了O(n)，如何优化的呢？
	- 同层节点之间相互比较，不会跨节点比较；
	- 不同类型的节点，产生不同的树结构；
	- 开发中，可以通过key来指定哪些节点在不同的渲染下保持稳定（与 Vue 中的 diff 算法原理类似。）；

## 列表渲染中 Keys 的优化

在遍历列表时，总是会提示一个警告，让我们加入一个 key 属性：React 是如何使用 keys 进行优化的？

情况一：更新列表时，在最后位置插入数据：

- 这种情况，有无key意义并不大

情况二：更新列表时，在列表非末尾的地方插入数据。

- 这种做法，假设列表中的元素是 li，在没有key的情况下，所有的li都需要进行修改；

情况二中，使用 key 进行优化：

- 当子元素(这里的li)拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素：
- 匹配到的子元素只需进行位移，不需要进行任何的修改；
- 没匹配到的元素在相应的位置插入即可。

key的注意事项：

- key应该是唯一的；
- key不要使用随机数（随机数在下一次render时，会重新生成一个数字）；
- 使用index作为key，对性能是没有优化的；

# render 函数性能优化

为什么要进行性能优化？

- 我们使用的普通组件（React.component），在执行 setState 操作时，会执行组件本身的 render 方法和子组件中的 render 方法，进行 diff 算法以及页面的刷新；
- 如果我们给 state 中的状态，setState 一个相同的值，仍然会调用组件本身和所有子组件的 render 方法，进行 diff 算法以及页面的刷新，这无疑是多余的操作。
- 或者我们给 state 中部分状态 setState 了新的值，而组件中的某些子组件不依赖这部分状态，这些字组件中的 render 方法仍然会执行，并进行 diff 算法更新页面。

案例演示：

03-learn-component\src\12-render函数的优化\App.jsx

```jsx
import React, { Component } from 'react'
import Home from './Home';

export class App extends Component {
	constructor() {
		super()
		this.state = {
			msg: 'Hello World',
		}
	}
	render() {
		console.log('App render'); // 点击按钮，执行了一次
		const { msg } = this.state
		return (
			<div>
				<h2>App: { msg }</h2>
				<button onClick={ e => this.changetext()}>修改文本</button>
				<Home />
			</div>
		)
	}

	changetext() {
		this.setState({ msg: 'Hello World' }) // 设置一个相同的值
	}
}

export default App
```

03-learn-component\src\12-render函数的优化\Home.jsx

```jsx
import React, { Component } from 'react'

export class Home extends Component {

	render() {
		console.log('Home render'); // 点击 App 中的 按钮，执行了一次
		const { msg } = this.props
		return (
			<div>
				<h2>Home：{ msg }</h2>
			</div>
		)
	}
}

export default Home
```

## SCU 优化

React给我们提供了一个生命周期方法 shouldComponentUpdate（很多时候，我们简称为SCU），这个方法接受参数，并且需要有 返回值：

该方法有两个参数： 

- 参数一：nextProps 修改之后，最新的props属性 
- 参数二：nextState 修改之后，最新的state属性

该方法返回值是一个boolean类型： 

- 返回值为true，那么就需要调用render方法； 
- 返回值为false，那么久不需要调用render方法；
- 默认返回的是true，也就是只要state发生改变，就会调用render方法；

03-learn-component\src\12-render函数的优化\App.jsx

```jsx
import React, { Component } from 'react'
import Home from './Home';

export class App extends Component {
	constructor() {
		super()
		this.state = {
			msg: 'Hello World',
			counter: 0
		}
	}

	shouldComponentUpdate(newProps, newState) {
		return this.state.msg !== newState.msg || this.state.counter !== newState.counter
	}

	render() {
		console.log('App render');
		const { msg, counter } = this.state
		return (
			<div>
				<h2>App: { msg }-{ counter }</h2>
				<button onClick={ e => this.changetext() }>修改文本</button>
				<button onClick={ e => this.changeCouter() }>counter+1</button>
				<Home />
			</div>
		)
	}

	changetext() {
		this.setState({ msg: 'Hello World' })
	}
	changeCouter() {
		this.setState({ counter: this.state.counter + 1})
	}
}

export default App
```

03-learn-component\src\12-render函数的优化\Home.jsx

```jsx
import React, { Component } from 'react'

export class Home extends Component {

	shouldComponentUpdate(newProps, newState) {
		return this.props.msg !== newProps.msg
	}

	render() {
		console.log('Home render');
		const { msg } = this.props
		return (
			<div>
				<h2>Home：{ msg }</h2>
			</div>
		)
	}
}

export default Home
```

## PureComponent

如果所有的类，我们都需要手动来实现 shouldComponentUpdate，那么会给我们开发者增加非常多的工作量。 

- 我们来设想一下shouldComponentUpdate中的各种判断的目的是什么？ 
- props或者state中的数据是否发生了改变，来决定shouldComponentUpdate返回true或者false；

事实上React已经考虑到了这一点，所以React已经默认帮我们实现好了，如何实现呢？

- 将class继承自PureComponent。

03-learn-component\src\12-render函数的优化\App.jsx

```jsx
import React, { PureComponent } from 'react'
import Home from './Home';

export class App extends PureComponent {
	constructor() {
		super()
		this.state = {
			msg: 'Hello World',
			counter: 0
		}
	}

	render() {
		console.log('App render');
		const { msg, counter } = this.state
		return (
			<div>
				<h2>App: { msg }-{ counter }</h2>
				<button onClick={ e => this.changetext() }>修改文本</button>
				<button onClick={ e => this.changeCouter() }>counter+1</button>
				<Home />
			</div>
		)
	}

	changetext() {
		this.setState({ msg: 'Hello World' })
	}
	changeCouter() {
		this.setState({ counter: this.state.counter + 1})
	}
}

export default App
```

03-learn-component\src\12-render函数的优化\Home.jsx

```jsx
import React, { PureComponent } from 'react'

export class Home extends PureComponent {

	render() {
		console.log('Home render');
		const { msg } = this.props
		return (
			<div>
				<h2>Home：{ msg }</h2>
			</div>
		)
	}
}

export default Home
```

PureComponent 会在 shouldComponentUpdate 生命周期中，使用 ShallowEqual 方法进行浅层比较

- ` !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)`

> PureComponent 源码位置：packages\react\src\ReactBaseClasses.js
>
> shallowEqual 源码位置：packages\shared\shallowEqual.js

## 高阶组件 memo

函数式组件不是类，不能继承 PureComponent，也没有生命周期函数，如何实现类似于 SCU 优化？

我们需要使用一个高阶组件 memo

03-learn-component\src\12-render函数的优化\Profile.jsx

```jsx
import React, { memo } from 'react'

const Profile = memo((props) => {
	console.log('profile render');
	return (
		<h2>Profile： { props.msg }</h2>
	)
})

export default Profile
```

* 理解不可变数据的力量，如何修改 state 中的引用类型数据？
	- 如果是 PureComponent，在渲染时会使用 shallowEqual 方法进行浅层比较。
	- 如果是 PureComponent，在修改 state 中引用类型数据中的深层引用值时，仍需要使用浅拷贝的方式修改。
* React 中获取 DOM 元素
* React 中获取 React 组件
	- 函数组件没有实例，需要绑定 jsx 中的某一个元素。使用 forwardRef 对 ref 进行转发。
* 什么是受控组件？什么是非受控组件？
* 受控组件的使用练习。
	- 基本使用；
	- 将表单中多个元素的 value 使用同一个事件做处理。
	- 受控组件其它演练。
* 如何操作非受控组件？

