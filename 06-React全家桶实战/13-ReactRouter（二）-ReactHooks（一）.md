# React Router

## 代码实现跳转

在类组件中，使用代码实现路由跳转，封装高阶组件。

封装一个 Home Song Menu 页面

08-learn-reactrouter\src\pages\HomeSongMenu.jsx

```jsx
import React, { PureComponent } from 'react'

export class HomeSongMenu extends PureComponent {
	render() {
		return (
			<div>
				<h1>Home Song Menu</h1>
			</div>
		)
	}
}

export default HomeSongMenu
```

在 App 中注册路由

08-learn-reactrouter\src\App.jsx

```jsx
// ...
<Routes>
  {/* 注册路由 */}
  <Route path="/home/songmenu" element={<HomeSongMenu />}></Route>
</Routes>
// ...
```

使用高阶组件 `withRouter`

08-learn-reactrouter\src\hoc\withRouter.jsx

```jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

function withRouter(WrapperComponent) {
	return function (props) {
		const navigate = useNavigate()
		const router = { navigate }

		return <WrapperComponent {...props} router={ router } />
	}
}

export default withRouter
```

在 Home 中，跳转到 Home Song menu

08-learn-reactrouter\src\pages\Home.jsx

```jsx
import React, { PureComponent } from 'react'
import { Link, Outlet } from 'react-router-dom'
import withRouter from '../hoc/withRouter';

export class Home extends PureComponent {
	render() {
		return (
			<div>
				<h1>Home Page</h1>
				<div className="home-nav">
					<Link to='/home/recommend'>推荐</Link>
					<Link to='/home/ranking'>排行榜</Link>
					<button onClick={e => this.navigateTo('/home/songmenu')}>歌单</button>
				</div>

				{/* 占位组件 */}
				<Outlet />
			</div>
		)
	}

	navigateTo(path) {
		const { navigate } = this.props.router
		navigate(path)
	}
}

export default withRouter(Home)
```

## useNavigate Hook 使用总结

`useNavigate` 返回的函数 `navigate`，可传入那些参数？

- `to`：string 类型，跳转的路径。
- `option`: {replacement: boolean, state: any}，传入一些路由跳转的选项。
- `delta`：number 类型，表示前进或后退的层级数。

eg:

```js
navigate('/home', {replacement: false, state: ''})
navigate(-1)
```

## 路由跳转传递参数

传递参数有两种方式

### 方式一：动态路由

首先在 App 中注册一个动态路由。

08-learn-reactrouter\src\App.jsx

```jsx
// ...
<Routes>
	<Route path='/detail/:id' element={<Detail />} />
</Routes>
// ...
```

增强 `withRouter` 高阶组件中的功能，加入 `useParams` API，用于获取动态路由的参数。

08-learn-reactrouter\src\hoc\withRouter.jsx

```jsx
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function withRouter(WrapperComponent) {
	return function (props) {
		const navigate = useNavigate()
		const params = useParams()
		const router = { navigate, params }

		return <WrapperComponent {...props} router={ router } />
	}
}

export default withRouter
```

在 Home Song Menu 中进行跳转

08-learn-reactrouter\src\pages\HomeSongMenu.jsx

```jsx
import React, { PureComponent } from 'react'
import withRouter from '../hoc/withRouter'

export class HomeSongMenu extends PureComponent {
	constructor() {
		super()
		this.state = {
			songMenus: [
				{ id: 111, name: '华语流行' },
				{ id: 112, name: '古典音乐' },
				{ id: 113, name: '乡村民谣' },
			]
		}
	}
	render() {
		const { songMenus } = this.state
    
		return (
			<div>
				<h1>Home Song Menu</h1>
				<ul>
					{
						songMenus.map(item => (
							<li key={item.id} onClick={e => this.navigateToDetail(item.id)}>{item.name}</li>
						))
					}
				</ul>
			</div>
		)
	}

	navigateToDetail(id) {
		const { navigate } = this.props.router
		navigate('/detail/' + id)
	}
}

export default withRouter(HomeSongMenu)
```

跳转进入 Detail 页面，接收传入的参数。

08-learn-reactrouter\src\pages\Detail.jsx

```jsx
import React, { PureComponent } from 'react'
import withRouter from '../hoc/withRouter'

export class Detail extends PureComponent {
	render() {
		const { params } = this.props.router
    
		return (
			<div>
				<h1>Detail Page</h1>
				<div>id: {params.id}</div>
			</div>
		)
	}
}

export default withRouter(Detail)
```

### 方式二：查询字符串（search）

在 App 中注册路由，为了方便，这里直接在 Link 的 to 属性上拼接查询字符串。

08-learn-reactrouter\src\App.jsx

```jsx
// ...
<div>
	<div className="header">
		header
		<div className="nav">
      {/* 查询字符串 */}
			<Link to='/user?name=zzt&age=18'>用户</Link>
		</div>
		<hr />
	</div>
	<div className="content">
		<Routes>
			<Route path='/user' element={<User />} />
		</Routes>
	</div>
	<div className="footer">
		<hr />
		footer
	</div>
</div>
// ...
```

增强 withRouter 的功能。使用 `useLoacation` 或 `useSearchParams` Hook 获取查询字符串。

08-learn-reactrouter\src\hoc\withRouter.jsx

```jsx
import React from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'

function withRouter(WrapperComponent) {
	return function (props) {
		// 导航
		const navigate = useNavigate()

		// 动态路由的参数：/detail/:id
		const params = useParams()

		// 查询字符串的参数：/user?name=zzt&age=18
		const location = useLocation()
		console.log('location:', location)
    // {pathname: '/user', search: '?name=zzt&age=18', hash: '', state: null, key: '1k1r7ie4'}
    
		const [searchParams] = useSearchParams()
		const query = Object.fromEntries(searchParams)
		console.log('query:', query);
    // {name: 'zzt', age: '18'}

		const router = { navigate, params, location, query }
		return <WrapperComponent {...props} router={ router } />
	}
}

export default withRouter
```

跳转到 User 中，接收传递的参数。

08-learn-reactrouter\src\pages\User.jsx

```jsx
import React, { PureComponent } from 'react'
import withRouter from '../hoc/withRouter'

export class User extends PureComponent {
	render() {
		const { query } = this.props.router

		return (
			<div>
				<h1>User Page</h1>
				<div>{query.name}-{query.age}</div>
			</div>
		)
	}
}

export default withRouter(User)
```

## 路由的配置文件


目前我们所有的路由定义都是直接使用 `Route` 组件，并且添加属性来完成的。

但是这样的方式会让路由变得非常混乱，我们希望将所有的路由配置放到一个地方进行集中管理，如一个单独的配置文件中：

- 在 Router 5.x 及以前的版本，需要借助于 `react-router-config` 库来完成；
- 在 Router 6.x 中，已为我们提供 `useRoutes` API 来完成相关的配置；

08-learn-reactrouter\src\App.jsx

```jsx
import React from 'react'
import { useNavigate, Link, useRoutes } from 'react-router-dom';
// 引入配置文件
import routes from './router';

export function App() {

  const navigate = useNavigate()
  function navigateTo(path) {
    navigate(path)
  }

  return (
    <div>
      <div className="header">
        header
        <div className="nav">
          <button onClick={e => navigateTo('/category') }>分类</button>
          <span onClick={e => navigateTo('/order') }>订单</span>
          <Link to='/user?name=zzt&age=18'>用户</Link>
        </div>
        <hr />
      </div>
      <div className="content">
        {/* 使用 useRoutes，传入配置好的数组 */}
        { useRoutes(routes) }
      </div>
      <div className="footer">
        <hr />
        footer
      </div>
    </div>
  )
}

export default App
```

配置文件：

08-learn-reactrouter\src\router\index.jsx

```jsx
import Category from '../pages/Category'
import Detail from '../pages/Detail'
import Home from '../pages/Home'
import HomeRanking from '../pages/HomeRanking'
import HomeRecommend from '../pages/HomeRecommend'
import HomeSongMenu from '../pages/HomeSongMenu'
import NotFound from '../pages/NotFound'
import Order from '../pages/Order'
import User from '../pages/User'
import { Navigate } from 'react-router-dom'

const routes = [
	{
		path: '/',
    // 重定向
		element: <Navigate to="/home" />
	},
	{
		path: '/home',
		element: <Home />,
    // 二级路由
		children: [
			{
				path: '/home',
				element: <Navigate to="/home/recommend" />
			},
			{
				path: '/home/recommend',
				element: <HomeRecommend />
			},
			{
				path: '/home/ranking',
				element: <HomeRanking />
			},
			{
				path: '/home/songmenu',
				element: <HomeSongMenu />
			}
		]
	},
	{
		path: '/category',
		element: <Category />
	},
	{
		path: '/order',
		element: <Order />
	},
  // 动态路由
	{
		path: '/detail/:id',
		element: <Detail />
	},
	{
		path: '/user',
		element: <User />
	},
  // NotFound
	{
		path: '*',
		element: <NotFound />
	}
]

export default routes
```

### 异步加载组件

在路由的配置文件中，配置组件的懒加载

08-learn-reactrouter\src\router\index.js

```jsx
// import Category from '../pages/Category'
// import Order from '../pages/Order'
import React from 'react'

const Category = React.lazy(() => import('../pages/Category'))
const Order = React.lazy(() => import('../pages/Order'))

const routes = [
	{
		path: '/category',
		element: <Category />
	},
	{
		path: '/order',
		element: <Order />
	}
]

export default routes
```

在顶层使用 `Suspense` 组件包裹。

08-learn-reactrouter\src\index.js

```jsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Suspense fallback={<h1>Loading...</h1>}>
        <App />
      </Suspense>
    </HashRouter>
  </React.StrictMode>
);
```

# React Hooks

## 函数式组件的缺陷

函数式组件存在的最大缺陷，结合案例分析.

09-learn-reacthooks\src\01-不适用Hooks\App.jsx

```jsx
import React from 'react'

function App() {
	let msg = 'Hello World'

	/**
	 * 函数式组件存在的最大缺陷：
	 * 	1.修改 msg 之后，组件不会被重新渲染。
	 * 	2.即使页面重新渲染，意味着函数会被重新执行，那么会重新给 msg 赋值为“Hello World”
	 * 	3.类似于生命周期的回调函数，也是没有的。
	 */

	return (
		<div>
			<h2>内容：{msg}</h2>
			<button onClick={e => msg = '你好啊，李银河！'}>修改文本</button>
		</div>
	)
}

export default App
```

## 类组件相对于函数式组件的优势

class 组件可以定义自己的 state，用来保存组件自己内部的状态；

- 函数式组件不可以，因为函数每次调用都会产生新的临时变量；

class 组件有自己的生命周期，我们可以在对应的生命周期中完成自己的逻辑；比如在 `componentDidMount` 中发送网络请求，并且该生命周期函数只会执行一次；
- 如果在函数中发送网络请求，意味着每次重新渲染都会重新发送一次网络请求；

class 组件可以在状态改变时重新执行 `render` 函数以及生命周期函数 `componentDidUpdate` 等；

- 函数式组件在重新渲染时，整个函数都会被执行，似乎没有什么地方可以只让它们调用一次；

## 类组件的缺陷


复杂组件变得难以理解：
- 随着业务的增多，我们的 class 组件会变得越来越复杂；比如 componentDidMount 中，可能就会包含大量的逻辑代码：像是网络请求、一些事件的监听（还需要在 componentWillUnmount 中移除）；
- 而对于这样的 class 实际上非常难以拆分：因为它们的逻辑往往混在一起，强行拆分反而会造成过度设计，增加代码的复杂度；

组件复用状态很难：
- 在前面为了一些状态的复用我们需要通过高阶组件；
- 像我们之前学习的 redux 中 `connect` 或者 react-router 中的 `withRouter`，这些高阶组件设计的目的就是为了状态的复用；
- 或者类似于 Context 中的 `Provider`、`Consumer` 来共享一些状态，但是多次使用 Consumer 时，我们的代码就会存在很多嵌套；
- 这些代码让我们不管是编写和设计上来说，都变得非常困难；

难以理解的 class：
- 很多人发现学习 ES6 的 class 是学习 React 的一个障碍。
- 比如在 class 中，我们必须搞清楚 this 的指向到底是谁，所以需要花很多的精力去学习 this；
- 虽然我认为前端开发人员必须掌握 this，但是依然处理起来非常麻烦；


## Hooks 的出现

Hook 是 React 16.8 的新增特性，它可以让我们在不编写 class 的情况下使用类组件的特性。可以延伸出非常多的用法。

Hook 的使用场景：
- Hook 的出现基本可以代替我们之前所有使用 class 组件的地方；
- Hook 只能在函数组件中使用，不能在类组件，以及函数组件之外的地方使用；除非是自定义 Hook 函数，即以“use”开头的函数。
- 如果是一个旧的项目，你并不需要直接将所有的代码重构为 Hooks，因为它完全向下兼容，你可以渐进式的来使用它；

在我们继续之前，请记住 Hook 是完全可选的：你无需重构任何已有代码，就可以在原有项目中使用 Hook。它是 100% 向后兼容的：Hook 不包含任何破坏性改动。
## 计数器案例

使用计数器案例对比函数式组件结合 Hooks 和类组件的实现方式。

09-learn-reacthooks\src\02-计数器案例对比\App.jsx

```jsx
import React, { memo } from 'react'
import CounterClass from './CounterClass'
import CounterHook from './CounterHook'

const App = memo(() => {
	return (
		<div>
			<h1>App Component</h1>
			<CounterClass />
			<CounterHook />
		</div>
	)
})

export default App
```

使用类组件实现计数器。

09-learn-reacthooks\src\02-计数器案例对比\CounterClass.jsx

```jsx
import React, { PureComponent } from 'react'

export class CounterClass extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			counter: 0
		}
	}

	render() {
		const { counter } = this.state

		return (
			<div>
				<h1>当前计数：{counter}</h1>
				<button onClick={e => this.increment()}>+1</button>
				<button onClick={e => this.decrement()}>-1</button>
			</div>
		)
	}

	increment() {
		this.setState({
			counter: this.state.counter + 1
		})
	}
	decrement() {
		this.setState({
			counter: this.state.counter - 1
		})
	}
}

export default CounterClass
```

使用函数式组件结合 Hooks

09-learn-reacthooks\src\02-计数器案例对比\CounterHook.jsx

```jsx
import React, { memo, useState } from 'react'

const CounterHook = memo(() => {
	const [counter, setCounter] = useState(0)

	return (
		<div>
			<h1>当前计数：{counter}</h1>
			<button onClick={e => setCounter(counter + 1)}>+1</button>
			<button onClick={e => setCounter(counter - 1)}>-1</button>
		</div>
	)
})

export default CounterHook
```

## useState 的使用

`useState` 来自 react，需要从 react 中导入；

它是一个 hook；帮助我们定义一个 state 变量，它与 class 里面的 `this.state` 提供的功能完全相同。

一般来说，在函数退出后变量就会”消失”，而 state 中的变量会被 React 保留。

- 参数：接受唯一一个参数，表示初始化值，如果不设置，默认为 undefined；
- 返回值：数组，包含两个元素；可以通过数组的解构进行使用，非常方便。
	- 元素一：当前状态的值（第一此调用为初始化值）； 
	- 元素二：设置状态值的函数；

在上述案例中，点击 button 按钮后，会做两件事情： 
1. 调用 `setCount`，设置一个新的值；
2. 组件重新渲染，并且根据新的值返回 DOM 结构；

Hook 就是 JavaScript 函数，这个函数可以帮助你钩入（hook into）React State 以及生命周期等特性；

使用 React Hooks 两个规则：
- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。 
- 只能在 React 的函数式组件中调用 Hook。不要在其他普通 JavaScript 函数中调用，除非是在自定义 Hook 函数中调用，即以“use”开头的函数。

```jsx
import { memo, useState } from "react";

// 普通的函数, 里面不能使用 hooks
// 在自定义的 hooks 中（必须使用“use”开头）, 可以使用 react 提供的其他 hooks:
function useFoo() {
  const [ message ] = useState("Hello World")
  return message
}

function CounterHook(props) {
  const [counter, setCounter] = useState(0)

  const message = useFoo()

  return (
    <div>
      <h2>当前计数: {counter}</h2>
      <button onClick={e => setCounter(counter+1)}>+1</button>
      <button onClick={e => setCounter(counter-1)}>-1</button>
    </div>
  )
}

export default memo(CounterHook)
```

> FAQ：为什么叫 useState 而不叫 createState? 
> - “create” 可能不是很准确，因为 state 只在组件首次渲染的时候被创建。 
> - 在下一次重新渲染时，useState 返回给我们当前的 state。 
> - 如果每次都创建新的变量，它就不是 “state”了。
> - 这也是 Hook 的名字总是以 use 开头的一个原因。


