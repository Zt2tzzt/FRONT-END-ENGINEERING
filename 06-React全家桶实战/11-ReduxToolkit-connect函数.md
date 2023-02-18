# 一、Redux Toolkit 是什么

Redux Toolkit 是官方推荐的编写 Redux 逻辑的库。

在前面我们使用 Redux 时应该已经发现：
- redux 的编写逻辑过于的繁琐和麻烦，并且代码通常分拆在多个文件中（虽然也可以放到一个文件管理，但是代码过多，不利于管理）;
- 创建 store 时，`createStore` API 也已不再推荐使用。

Redux Toolkit 库可解决以上问题，

- 它旨在成为编写 Redux 逻辑的标准方式，在很多地方也将之称为“RTK”；

安装 Redux Toolkit，推荐和 react-redux 一起使用：

```shell
npm install @reduxjs/toolkit react-redux
```

Redux Toolkit 的核心 API 主要是如下几个：

- `configureStore`：包装 createStore 以提供简化的配置选项和良好的默认值。它可以自动组合你的 slice reducer，添加你提供的任何 Redux 中间件，
  - 默认包含了 redux-thunk 中间件，
  - 默认启用了 Redux DevTools Extension。
- `createSlice`：接收【切片名称】、【初始状态值】、【包含 reducer 函数的对象】，并自动生成切片 reducer，并带有相应的 actions。
- `createAsyncThunk`: 接收一个动作类型字符串和一个返回承诺的函数，并生成一个拥有 pending / fulfilled / rejected 状态的承诺，基于该承诺分派动作类型的 thunk。

# Redux Toolkit 基本使用

重构上节代码：

创建 counter 的 reducer。

07-learn-reduxtoolkit\src\store\features\counter.js

```js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
	name: 'couter',
	initialState: {
		counter: 888
	},
	reducers: {
		addNumberAction(state, action) { // 该方法中编写的逻辑，相当于以前 reducer 函数中 case 语句中编写的逻辑。
			console.log(action.type, action.payload)
			// couter/addNumberAction 5
			state.counter = state.counter + action.payload // 可直接修改 state 中的值，内部使用了 immer.js 保证数据的不可变
		},
		subNumberAction(state, action) {
			state.counter = state.counter - action.payload
		}
	}
})
export const { addNumberAction, subNumberAction } = counterSlice.actions
export default counterSlice.reducer
```

store 的创建。

07-learn-reduxtoolkit\src\store\index.js

```js
import { configureStore } from '@reduxjs/toolkit'

import counterReducer from './features/counter';

const store = configureStore({
	reducer: {
		counter: counterReducer
	}
})

export default store
```

在组件中使用 store

07-learn-reduxtoolkit\src\page\About.jsx

```jsx
import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { addNumberAction } from '../store/features/counter'

export class About extends PureComponent {
	render() {
		const { counter } = this.props
		return (
			<div>
				<h2>About Counter: {counter}</h2>
				<button onClick={e => this.addNumber(5)}>+5</button>
			</div>
		)
	}

	addNumber(num) {
		this.props.addNumber(num)
	}
}

const mapStateToProps = state => ({
	counter: state.counter.counter
})
const mapDispatchToProps = dispatch => ({
	addNumber(num) {
		dispatch(addNumberAction(num))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(About)
```

## createSlice 的使用

`createSlice` 需要传入一个对象，该对象主要包含以下属性：

- `name`：用户标记 slice 的名词。
	- 在之后的 redux-devtool 中会显示对应的名词；
- `initialState`：初始化值。
	- 第一次初始化时的值；
- `reducers`：相当于之前的 reducer 函数。
	- 对象类型，并且可以添加很多的函数；
	- 函数类似于 redux 原来 reducer 中的一个 case 语句；
	- 函数的参数： 
		- 参数一：`state`；
		- 参数二：`action` ，其中有属性 `type` 和 `payload`；

createSlice 返回值是一个对象，其中包括 actions 对象和 reducer；

## configureStore 的使用

`configureStore` 用于创建 store 对象，常见参数如下：

- `reducer`：将 slice 中的 reducer 可以组成一个对象传入此处；
- `middleware`：可以使用参数，传入其他的中间件（自行了解）；
- `devTools`：是否配置 devTools 工具，默认为 true；


# Redux Toolkit 异步操作

在组件中派发 action，执行异步操作。在 Home 中请求数据，在 Profile 中展示。

07-learn-reduxtoolkit\src\store\features\home.js

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchHomeMultidateAction = createAsyncThunk('home/multidata', async (payload, { dispatch, getState }) => {
	console.log('payload:', payload)
	// payload: {name: 'zzt', age: 18}

	// 1. 发送网络请求
	const res = await axios.get("http://123.207.32.32:8000/home/multidata")
	// 2. 返回结果，action 变为 fullfilled 状态
	return res.data
})

const homeSlice = createSlice({
	name: 'home',
	initialState: {
		banners: [],
		recommends: []
	},
	reducers: {
		// 如果在组件中派发 action，在 action 中发送网络请求，组需要使用 extraReducers
		// 如果在组件中直接发送网络请求，需要使用这种方式来同步的修改 state，
		changeBanners(state, { payload }) {
			state.banners = payload
		},
		changeRecommends(state, { payload }) {
			state.recommends = payload
		}
	},
	extraReducers: {
		[fetchHomeMultidateAction.pending](state, action) {
			console.log('fetchHomeMultidateAction pending')
		},
		// 一般监听该状态即可
		[fetchHomeMultidateAction.fulfilled](state, { payload }) {
			state.banners = payload.data.banner.list
			state.recommends = payload.data.recommend.list
		},
		[fetchHomeMultidateAction.rejected](state, action) {
			console.log('fetchHomeMultidateAction rejected')
		}
	}
})

export const { changeBanners, changeRecommends } = homeSlice.actions
export default homeSlice.reducer
```

07-learn-reduxtoolkit\src\store\index.js

```js
import { configureStore } from '@reduxjs/toolkit'

import counterReducer from './features/counter';
import homeReducer from './features/home'

const store = configureStore({
	reducer: {
		counter: counterReducer,
		home: homeReducer
	}
})

export default store
```

07-learn-reduxtoolkit\src\page\Home.jsx

```jsx
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { fetchHomeMultidateAction } from '../store/features/home'

export class Home extends PureComponent {
	componentDidMount() {
		this.props.fetchHomeMultidata()
	}

	render() {
		const { counter } = this.props
		return (
			<div>
				<h2>Home Counter: {counter}</h2>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	counter: state.counter.counter
})
const mapDispatchToProps = dispatch => ({
	fetchHomeMultidata() {
		dispatch(fetchHomeMultidateAction({name: 'zzt', age: 18}))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
```

07-learn-reduxtoolkit\src\page\Profile.jsx

```jsx
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

export class Profile extends PureComponent {
	render() {
		const { counter, banners, recommends } = this.props
		return (
			<div>
				<h2>Page Counter: {counter}</h2>
				<div className="banner">
					<h2>轮播图展示</h2>
					<ul>
						{
							banners.map((item, index) => (
								<li key={index}>{item.title}</li>
							))
						}
					</ul>
				</div>
				<div className="recommend">
					<h2>推荐展示</h2>
					<ul>
						{
							recommends.map((item, index) => (
								<li key={index}>{item.title}</li>
							))
						}
					</ul>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	counter: state.counter.counter,
	banners: state.home.banners,
	recommends:state.home.recommends 
})

export default connect(mapStateToProps)(Profile)
```

## createAsyncThunk 的使用

在之前的开发中，我们通过 redux-thunk 中间件让 dispatch 的 action 中可以进行异步操作。 Redux Toolkit 默认已经集成了 Thunk 相关的功能：即使用 `createAsyncThunk` API：

当 createAsyncThunk 创建出来的 action 被 dispatch 时，会存在三种状态： 

- `pending`：action 被发出，但是还没有最终的结果；
- `fulfilled`：获取到最终的结果（有返回值的结果）；
- `rejected`：执行过程中有错误或者抛出了异常；

我们可以在 `createSlice` 的 `extraReducer` 中监听这些结果：

## extraReducer 另一种写法

链式编程写法：

- `extraReducer` 还可以传入一个函数，函数接收一个 `builder` 参数。 
- 我们可以向 builder 中添加 case 来监听异步操作的结果：

07-learn-reduxtoolkit\src\store\features\home.js

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchHomeMultidateAction = createAsyncThunk('home/multidata', async (payload, { dispatch, getState }) => {
	console.log('payload:', payload)
	// payload: {name: 'zzt', age: 18}

	// 1. 发送网络请求
	const res = await axios.get("http://123.207.32.32:8000/home/multidata")
	// 2. 返回结果，action 变为 fullfilled 状态
	return res.data
})

const homeSlice = createSlice({
	name: 'home',
	initialState: {
		banners: [],
		recommends: []
	},
	reducers: {
		// 如果在组件中派发 action，在 action 中发送网络请求，组需要使用 extraReducers
		// 如果在组件中直接发送网络请求，需要使用这种方式来同步的修改 state，
		changeBanners(state, { payload }) {
			state.banners = payload
		},
		changeRecommends(state, { payload }) {
			state.recommends = payload
		}
	},
	extraReducers: builder => builder
    .addCase(fetchHomeMultidateAction.pending, (state, action) => {
      console.log('fetchHomeMultidateAction pending')
    })
    .addCase(fetchHomeMultidateAction.fulfilled, (state, { payload }) => {
      state.banners = payload.data.banner.list
      state.recommends = payload.data.recommend.list
    })
    .addCase(fetchHomeMultidateAction.rejected, (state, action) => {
      console.log('fetchHomeMultidateAction rejected')
    })
	
})

export const { changeBanners, changeRecommends } = homeSlice.actions
export default homeSlice.reducer
```

## 异步操作还能怎么实现？

在网络请求获取到结果后，直接 dispatch action

07-learn-reduxtoolkit\src\store\features\home.js

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const homeSlice = createSlice({
	name: 'home',
	initialState: {
		banners: [],
		recommends: []
	},
	reducers: {
		changeBanners(state, { payload }) {
			state.banners = payload
		},
		changeRecommends(state, { payload }) {
			state.recommends = payload
		}
	}
})

export const { changeBanners, changeRecommends } = homeSlice.actions

export const fetchHomeMultidateAction = createAsyncThunk('home/multidata', async (payload, { dispatch, getState }) => {
	console.log('payload:', payload)
	// payload: {name: 'zzt', age: 18}

	// 1. 发送网络请求
	const res = await axios.get("http://123.207.32.32:8000/home/multidata")
	// 2.取出数据，并且在此处直接 dispatch action
	const banners = res.data.data.banner.list
	const recommends = res.data.data.recommend.list
	dispatch(changeBanners(banners))
	dispatch(changeRecommends(recommends))
})

export default homeSlice.reducer
```

# Redux Toolkit 中数据不可变的原理

在 React 开发中，我们总是会强调数据的不可变性： 
- 无论是类组件中的 state，还是 redux 中管理的状态；如果 state 不修改，就不会通知订阅者，也就不会产生页面刷新。
- 事实上在整个 JavaScript 编码过程中，数据的不可变性都是非常重要的；

所以在前面我们经常会进行浅拷贝来完成某些操作，但是浅拷贝事实上也是存在问题的： 
- 比如过大的对象，进行浅拷贝也会造成性能的浪费； 
- 比如浅拷贝后的对象，在深层属性改变时，依然会对之前的对象产生影响；

事实上 Redux Toolkit 底层使用了 `immerjs` 库来保证数据的不可变性

> immutable.js 和 immer.js 是两个库。

[immutable-js 库的底层原理和使用方法](https://mp.weixin.qq.com/s/hfeCDCcodBCGS5GpedxCGg)

为了节约内存和性能消耗，它们实现了一个新的算法：Persistent Data Structure（持久化数据结构或一致性数据结构）； 
- 用一种数据结构来保存数据； 
- 当数据被修改时，会返回一个对象，该新对象会尽可能的利用之前的数据结构而不会对内存造成浪费；

<img src="NodeAssets/Persistent Data Structure.gif" alt="Persistent Data Structure1" style="zoom:80%;" />

# 自定义 connect 函数

自己封装 redux-react 中的 connect 函数。

07-learn-reduxtoolkit\src\hoc\connect.js

```js
import { PureComponent } from 'react'
import { StoreContext } from './StoreContext'

export function connect(mapStateToProps, mapDispatchToProps) {
	// 返回一个高阶组件
	return function (OriginCpn) {
    
		return class extends PureComponent {
			static contextType = StoreContext // 就是 store

			constructor(props, context) {
				super(props)
				this.state = mapStateToProps(context.getState())
			}
    
			componentDidMount() {
				this.unSubscripbe = this.context.subscriibe(() => {
					this.setState(mapStateToProps(this.context.getState()))
				})
			}
    
			componentWillUnmount() {
				this.unSubscripbe()
			}
    
			render() {
				const stateObj = mapStateToProps(this.context.getState())
				const dispatchObj = mapDispatchToProps(this.context.dispatch)
				return <OriginCpn {...this.props} {...stateObj} {...dispatchObj} />
			}
		}
	}
}
```

使用 Context 处理 store，对 store 进行解耦操作。

07-learn-reduxtoolkit\src\hoc\StoreContext.js

```js
import { createContext } from 'react'

export const StoreContext = createContext()
```

07-learn-reduxtoolkit\src\hoc\index.js

```js
export { StoreContext } from './StoreContext'
export { connect } from './connect'
```

为 App 提供 store

07-learn-reduxtoolkit\src\index.js

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
// import { Provider } from "react-redux"
import { StoreContext } from "./hoc"
import App from './App';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
		<StoreContext.Provider value={store}>
			<App />
		</StoreContext.Provider>
    {/* </Provider> */}
  </React.StrictMode>
);
```
