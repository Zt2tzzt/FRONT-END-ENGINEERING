# useEffect Hook

## 认识 Effect Hook。

在编程中，Effect 通常表示副作用。

事实上，类似于网络请求、DOM 操作、事件监听，都是 React 更新 DOM 需要携带的副作用（Side Effects）；

所以对于完成这些功能的 Hook 被称之为 Effect Hook；

## counter 改变更新 title 案例

需求：页面的 title 总是显示 counter 的数字，

使用 class 组件实现：

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
	constructor() {
		super()
		this.state = {
			counter: 100
		}
	}

	componentDidMount() {
		document.title = this.state.counter
	}

	componentDidUpdate() {
		document.title = this.state.counter
	}


	render() {
		const { counter } = this.state

		return (
			<div>
				<h2>计数：{counter}</h2>
				<button onClick={e => this.setState({ counter: counter + 1 })}>+1</button>
			</div>
		)
	}
}

export default App
```

使用函数式组件结合 Hook 实现：

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { memo, useState, useEffect } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(200)

	// document.title = count // 在函数中直接修改，这样写能达到效果，但是不规范。

	useEffect(() => {
		// 当前传入的回调函数，会在组件被渲染完成后，自动执行。
		// 可做操作：网络请求/DOM操作（修改标题）/事件监听。
		document.title = count
	})

	return (
		<div>
			<h2>当前计数：{count}</h2>
			<button onClick={e => setCount(count + 1)}>+1</button>
		</div>
	)
})

export default App
```

## useEffect 的副作用执行时机

- 通过 `useEffect` 的 Hook，可以告诉 React 需要在渲染后执行某些操作；
- `useEffect` 要求我们传入一个回调函数，在 React 执行完更新 DOM 操作之后，就会回调这个函数；
- 默认情况下，无论是**第一次渲染**之后，还是**每次更新**之后，都会执行这个回调函数；

## 清除 Effect 的使用。

在 class 组件的编写过程中，某些副作用的代码，我们需要在 `componentWillUnmount` 中进行清除：
- 比如我们之前的事件总线、Redux 中手动调用 subscribe；都需要在 componentWillUnmount 进行卸载、取消订阅；

Effect Hook 通过什么方式来模拟 `componentWillUnmount` 呢？
- `useEffect` 传入的回调函数本身可以有一个返回值，这个返回值是另外一个回调函数：
- `type EffectCallback = () => (void | (() => void | undefined));`
- 这样做可以将添加和移除订阅的逻辑放在一起；它们都属于 effect 的一部分；

清除 Effect 的执行时机：
- React 会在组件**更新和卸载**的时候执行清除操作；

使用代码模拟取消事件监听的操作

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { memo, useEffect, useState } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)

	// 当前组件渲染完成（初次渲染或更新）后，要执行的副作用。
	useEffect(() => {
		console.log('监听 redux 中的数据变化， 监听 eventBus 中的 zzt 事件')

		// 返回值：回调函数 => 组件被重新渲染（更新）或被卸载的时候执行。
		return () => {
			console.log('取消监听 redux 中的数据变化，取消监听 eventBus 中的 zzt 事件');
		}
	})

	return (
		<div>
			<button onClick={e => setCount(count + 1)}>+1{count}</button>
		</div>
	)
})

export default App
```

## 使用多个 useEffect

使用 Hook 的其中一个目的就是解决 class 中生命周期经常将很多的逻辑放在一起的问题：
- 比如网络请求、事件监听、DOM 操作，这些往往都会放在 `componentDidMount` 中；

使用 Effect Hook，我们可以将它们分离到不同的 useEffect 中：
-  React 将按照 effect 声明的顺序依次调用组件中的每一个 effect；

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { memo, useEffect, useState } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		// 1.DOM 操作，修改 document 的 title
		console.log('修改 title')
	})

	useEffect(() => {
		// 2.订阅（subscripe） redux 中状态的变化
		console.log('订阅 redux 中的状态变化')
		return () => {
			console.log('取消订阅');
		}
	})

	useEffect(() => {
		// 3.监听 eventBus 中的 zzt 事件
		console.log('监听 eventBus 中的 zzt 事件')
		return () => {
			console.log('取消监听');
		}
	})

	return (
		<div>
      <button onClick={e => setCount(count+1)}>+1({count})</button>
		</div>
	)
})

export default App
```

## Effect 的性能优化

默认情况下，`useEffect` 的回调函数会在每次渲染（更新）时都重新执行，但是这会导致两个问题：
- 问题一：某些代码我们只是希望执行一次即可，类似于 `componentDidMount` 和 `componentWillUnmount` 中完成的事情；（比如网络请求、订阅和取消订阅）；
- 问题二：多次执行也会导致一定的性能消耗；

我们如何决定 `useEffect` 在什么时候应该执行和什么时候不应该执行呢？useEffect 实际上可以传入两个参数：
- 参数一：执行的回调函数；
- 参数二：一个数组，数组中存放了 useEffect 中的回调函数重新执行所依赖的 state。

09-learn-reacthooks\src\04-useEffect的使用\App.jsx

```jsx
import React, { memo, useEffect, useState } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)
	const [msg, setMsg] = useState('Hello World')

	/**
	 * 使用 useEffect 模拟 componentDidMount 和 componentWillUnmount 生命周期，
	 * 	传入一个空数组。副作用只会在组件初次渲染完成后执行，取消副作用函数只会在组件卸载时执行。
	 */
	useEffect(() => {
		console.log('订阅 redux 中的数据')
		return () => {
			console.log('取消订阅');
		}
	}, [])

	useEffect(() => {
		console.log('监听 eventBus 的 zzt 事件')
		return () => {
			console.log(`取消监听`);
		}
	}, [])

	useEffect(() => {
		console.log('发送网络请求，从服务器获取数据')
		return () => {
			console.log('会在组件被卸载时，');
		}
	}, [])
  
  /**
   * 使用 useEffect 模拟 componentDidUpdate，传入一个数组，里面存放了依赖的状态
   * 	当依赖的状态改变，取消副作用函数，副作用函数才会重新执行，
   */
	useEffect(()=> {
		console.log('count 更新了', count);
    return () => {}
	}, [count])


	return (
		<div>
			<button onClick={e => setCount(count + 1)}>+1{count}</button>
			<button onClick={e => setMsg('你好啊！')}>修改msg{msg}</button>
		</div>
	)
})

export default App
```
> `useEffect` 用来执行副作用，可以模拟生命周期，但比生命周期更强大。

# useContext Hook

在之前的开发中，我们要在组件中使用共享的 Context 有两种方式：
- 类组件可以通过类名. `contextType = MyContext` 方式，在类中获取 context；
- 多个 Context 或者在函数式组件中需要通过 `<MyContext.Consumer>` 方式共享 context；

多个 Context 共享时的方式会存在大量的嵌套：

Context Hook 允许我们通过 Hook 来直接获取某个 Context 的值；

09-learn-reacthooks\src\05-useContext的使用\content\index.js

```js
import { createContext } from 'react'

const UserContext = createContext()
const ThemeContet = createContext()

export {
	UserContext,
	ThemeContet
}
```
09-learn-reacthooks\src\index.js

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './05-useContext的使用/App';
import { ThemeContet, UserContext } from './05-useContext的使用/content';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <UserContext.Provider value={{name: 'zzt', level: 99}}>
    <ThemeContet.Provider value={{color: 'red', size: 30}}>
      <App />
    </ThemeContet.Provider>
  </UserContext.Provider>
  // </React.StrictMode>
);
```

09-learn-reacthooks\src\05-useContext的使用\App.jsx

```jsx
import React, { memo, useContext } from 'react'
import { ThemeContet, UserContext } from './content'

const App = memo(() => {
	// 使用 Context
	const user = useContext(UserContext)
	const theme = useContext(ThemeContet)

	return (
		<div>
			<h2>User：{user.name}-{user.level}</h2>
			<h2 style={{color: theme.color, fontSize: theme.size}}>Theme</h2>
		</div>
	)
})

export default App
```

# useReducer Hook（了解，用的很少）

很多人看到 `useReducer` 的第一反应应该是 redux 的某个替代品，其实不然。 `useReducer` 仅仅是 `useState` 的一种替代方案：

- 在某些场景下，如果 state 的处理逻辑比较复杂，我们可以通过 useReducer 来对其进行拆分；
- 或者这次修改的 state 需要依赖之前的 state 时，也可以使用；

现在有一个计数器案例：

09-learn-reacthooks\src\06-useReducer的使用（了解）\App.jsx

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)

	return (
		<div>
			<h2>当前计数：{count}</h2>
			<button onClick={e => setCount(count + 1)}>+1</button>
			<button onClick={e => setCount(count - 1)}>-1</button>
			<button onClick={e => setCount(count + 5)}>+5</button>
			<button onClick={e => setCount(count - 5)}>-5</button>
			<button onClick={e => setCount(count + 100)}>+100</button>
		</div>
	)
})

export default App
```

使用 `useReducer` 重构以上案例：

```jsx
import React, { memo, useReducer } from 'react'

function reducer(state, action) {
	switch (action.type) {
		case 'increment':
			return { ...state, count: state.count + 1}
		case 'decrement':
			return { ...state, count: state.count - 1 }
		case 'add_number':
			return { ...state, count: state.count + action.num }
		case 'sub_number':
			return { ...state, count: state.count - action.num }
		default:
			return state;
	}
}

const App = memo(() => {
	// const [count, setCount] = useState(0)

	// useReducer + Context => redux

	// useReducer 一般用于管理多个状态。
	const [state, dispatch] = useReducer(reducer, {
		count: 0,
		friends: [],
		user: []
	})

	return (
		<div>
			<h2>当前计数：{state.count}</h2>
			<button onClick={e => dispatch({ type: 'increment' })}>+1</button>
			<button onClick={e => dispatch({ type: 'decrement' })}>-1</button>
			<button onClick={e => dispatch({ type: 'add_number', num: 5})}>+5</button>
			<button onClick={e => dispatch({ type: 'sub_number', num: 5})}>-5</button>
			<button onClick={e => dispatch({ type: 'add_number', num: 100})}>+100</button>
		</div>
	)
})

export default App
```


# useCallback Hook

思考下面的这个案例，应该如何优化？

09-learn-reacthooks\src\07-useCallback的使用\App.jsx

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)

	/**
	 * 函数式组件中的状态更新，组件就会重新渲染；意味着函数会被重新执行；
	 * 如果频繁的更新状态，那么，像 increment 这样的函数，就会被定义很多次。
	 * 然而无需担心，每次函数执行定义的 increment，当没有引用再指向它时，它会被 GC 回收销毁。
	 */
	function increment() {
		setCount(count + 1)
	}

	return (
		<div>
			<h1>计数：{count}</h1>
			<button onClick={increment}>+1</button>
		</div>
	)
})

export default App
```

`useCallback` 实际的目的是为了进行性能的优化（到底是优化哪一方面的性能？见下文分析）。

如何进行性能的优化呢？

- useCallback 会返回一个函数的 memoized（记忆） 值；
- 在依赖的状态（传入的第二个参数（数组）中的元素）不变的情况下，多次定义的时候，返回的值是相同的；

如果我们想要在函数的定义层面做优化，让函数只定义一次，很难做到。尝试使用 `useCallback` 解决。

```jsx
import React, { memo, useState, useCallback } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)

	/**
	 * 使用 useCallback，传入一个匿名函数，返回该匿名函数的 memorized，即 increment 函数。
	 * 那么每次组件更新后，函数重新执行，onClick 中使用的 increment 函数不会改变。
	 * 但是，useCallback 中传入的匿名函数，在每次组件更新时，还是会被重复定义。
	 * 所以这么写，对函数定义层面的性能优化，是没有意义的。
	 */
	const increment = useCallback(function() {
		setCount(count + 1)
	})

	return (
		<div>
			<h1>计数：{count}</h1>
			<button onClick={increment}>+1</button>
		</div>
	)
})

export default App
```

什么是 useCallback 形成的“闭包陷阱”

```jsx
import React, { memo, useState, useCallback } from 'react'

const App = memo(() => {
	const [count, setCount] = useState(0)

	/**
	 * 传入第二个参数，类型为数组，如果数组中有依赖的状态：
	 * 	那么当该状态改变时，increment 也会重新生成。
	 * 
	 * 如果是一个空数组，表示不依赖任何状态；
	 * 	那么 increment 永远不会改变。
	 * 	这种情况下，就会产生“闭包陷阱”的问题：
	 * 		组件状态 count 更新，引起函数重新执行；
	 * 		useCallback 中会传入一个新的匿名函数；
	 * 		而 useCallback 返回的 memorized（即 increment 函数） 使用的仍然是最初的匿名函数；
	 * 		该匿名函数形成的闭包，引用的外层作用域中的 count，也就是组件初始的 count。
	 */
	const increment = useCallback(function() {
		setCount(count + 1)
	}, [])

	return (
		<div>
			<h1>计数：{count}</h1>
      {/* 仅第一次点击有效 */}
			<button onClick={increment}>+1</button>
		</div>
	)
})

export default App
```

## useCallback 的真正用途

经过以上案例的探索，得出结论，`useCallback` 的真正用途，
- 是当需要给子组件传递函数时，对该函数使用 useCallback；将返回的 memorized 传递给子组件，
- 避免与子组件无关联的状态改变后，子组件发生重新渲染的情况，以节省性能开支。

```jsx
import React, { memo, useState, useCallback } from 'react'

const ZtButton = memo((props) => {
	console.log('zt button 被渲染');
	const { increment } = props
	return (
		<div>
			<button onClick={increment}>ZtButton +1</button>
		</div>
	)
})

const App = memo(() => {
	const [count, setCount] = useState(0)
	const [msg, setMsg] = useState('Hello Frog')

	const increment = useCallback(function() {
		setCount(count + 1)
	}, [count])

	return (
		<div>
			<h1>计数：{count}</h1>
			<button onClick={increment}>+1</button>
			<ZtButton increment={increment} />
			<h1>文本：{msg}</h1>
			{/* 当点击修改文本按钮时，increment 不会改变，接收了 increment 传入的 ZtButton 组件也就不会重新渲染 */}
			<button onClick={e => setMsg('你好啊，李银河！')}>修改文本</button>
		</div>
	)
})

export default App
```

## 最终优化

目前看来，上述案例中，

- 与子组件不相关的状态 msg 改变，useCallback 返回的 memorize 不会改变。
- 而当状态 count 改变时，memorized 就会改变。

有没有一种办法，使得 count 改变后，memorized 不变，而只改变 memorized 使用的匿名函数中，引用的上层作用域状态值（count），以解除“闭包陷阱”？

- 使用 `useRef` Hook 做优化

```jsx
import React, { memo, useState, useCallback, useRef } from 'react'

const ZtButton = memo((props) => {
	console.log('zt button 被渲染');
	const { increment } = props
	return (
		<div>
			<button onClick={increment}>ZtButton +1</button>
		</div>
	)
})

const App = memo(() => {
	const [count, setCount] = useState(0)
	const [msg, setMsg] = useState('Hello Frog')

	/**
	 * 在 useCallback 中将 count 依赖移除掉，即传入的第二个参数为一个空数组，会产生“闭包陷阱”
	 * 	使用 useRef hook，生成一个 countRef，将其中的 current 属性赋值为 count。
	 * 	将 useCallback 中使用的匿名函数的闭包引用外层作用域变量改为 countRef
	 */
	const countRef = useRef()
	countRef.current = count
	const increment = useCallback(function() {
		setCount(countRef.current + 1)
	}, [])

	return (
		<div>
			<h1>计数：{count}</h1>
      {/* 即使修改 count，ZtButton 也不会重新刷新 */}
			<button onClick={increment}>+1</button>
			<ZtButton increment={increment} />
			<h1>文本：{msg}</h1>
			<button onClick={e => setMsg('你好啊，李银河！')}>修改文本</button>
		</div>
	)
})

export default App
```