* react-redux 库的使用。
	重构上节中 Redux 与 React 中的代码，去除重复代码。
	1. 安装 react-redux 库。
	2. 使用库中的 Provider 组件，为 <App /> 提供 store
	3. 在需要使用 store 的组件中，使用 connect 函数返回一个高阶组件。获取 store 中的 state。
	4. 使用 connect 函数，使用 store 中的 state。对 dispatch 进行解耦。
	总结：connect 是高阶函数，返回一个高阶组件。

06-react-redux\src\index.js

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

06-react-redux\src\page\About.jsx

```jsx
import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { addAction, subAction } from '../store/actionCreators';

export class About extends PureComponent {
	render() {
		const { counter } = this.props
		return (
			<div>
				<h2>About Page: {counter}</h2>
				<button onClick={e => this.calcNumber(6, true)}>+6</button>
				<button onClick={e => this.calcNumber(8, false)}>-8</button>
			</div>
		)
	}

	calcNumber(num, isAdd) {
		if (isAdd) {
			console.log('加', num)
			this.props.addNumber(num)
		} else {
			console.log('减', num)
			this.props.subNumber(num)
		}
	}
}

const mapStateToProps = state => ({
	counter: state.counter
})
const mapDispatchToProps = dispatch => ({
	addNumber(num) {
		dispatch(addAction(num))
	},
	subNumber(num) {
		dispatch(subAction(num))
	}
})

// connect 返回值是一个高阶组件
export default connect(mapStateToProps, mapDispatchToProps)(About)
```

* 组件中的异步操作
  在 Category 中请求数据，通过 Redux，共享给 About
	- 发送网络请求的代码在 Category 中编写。

* Redux 中的异步操作。
	- 将发送网络请求，获取数据的代码，抽取到 Redux 中的 actionCreator 中。
	- 正常境况下，dispatch 只能派发一个 对象作为 action，如果需要派发一个函数，必须要对 store 进行增强，比如使用中间件 redux-thunk。
	- 使用中间件增强后，派发一个函数作为 action，在这个函数中发送网络请求。最终还是要在 action 中派发一个对象。

* 什么是中间件？
* 总结如何使用 redux-thunk。

* 安装2个工具 React Developer Tools 和 Redux DevTools
	- 使用代码开启 Redux DevTools，仅在开发环境中开启，生产环境需要关闭。

* 将 reducer 拆封成一个个小的模块
	1. 将 reducer 进行拆分。
	2. store.getState() 引用数据时，需要加入模块名	