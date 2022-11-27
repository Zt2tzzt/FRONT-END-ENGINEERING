# React Router

## 代码实现跳转

在类组件中，使用代码实现路由跳转，封装高阶组件。

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

别忘了在 App 中注册路由

08-learn-reactrouter\src\App.jsx

```jsx
// ...

export function App() {

  return (
    <div>
      <div className="header">
        header
        <div className="nav">
          <button onClick={e => navigateTo('/category') }>分类</button>
          <span onClick={e => navigateTo('/order') }>订单</span>
        </div>
        <hr />
      </div>
      <div className="content">
        <Routes>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/home' element={<Home />}>
            <Route path='/home' element={<Navigate to='/home/recommend' />} />
            <Route path='/home/recommend' element={<HomeRecommend />} />
            <Route path='/home/ranking' element={<HomeRanking />} />
						{/* 注册路由 */}
            <Route path="/home/songmenu" element={<HomeSongMenu />}></Route>
          </Route>
        </Routes>
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

## useNavigate API 的使用总结

useNavigate 返回的函数 navigate，可传入那些参数？

- `to`：string 类型，跳转的路径。
- `option: {replacement: boolean, state: any}`: 传入一些路由跳转的选项。
- `delta`：number 类型，表示前进或后退的层级数。

eg:

```js
navigate('/home', { replacement: false, state: ''})
navigate(-1)
```

## 路由跳转传递参数

传递参数有两种方式

### 方式一：动态路由的方式

首先在 App 中注册一个动态路由。

08-learn-reactrouter\src\App.jsx

```jsx
// ...
<Routes>
	<Route path='/detail/:id' element={<Detail />} />
</Routes>
// ...
```

增强 withRouter 高阶组件中的功能

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

跳转进入 Detail 页面，并接收传入的参数。

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

### 方式二：查询字符串（search）传递参数

在 App 中注册路由，为了方便，这里直接在 Link 的 to 属性上拼接查询字符串。

08-learn-reactrouter\src\App.jsx

```jsx
// ...
<div>
	<div className="header">
		header
		<div className="nav">
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

增强 withRouter 的功能。

08-learn-reactrouter\src\hoc\withRouter.jsx

```jsx
import React from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

function withRouter(WrapperComponent) {
	return function (props) {
		// 导航
		const navigate = useNavigate()

		// 动态路由的参数：/detail/:id
		const params = useParams()

		// 查询字符串的参数：/user?name=zzt&age=18
		const location = useLocation()
		console.log('location:', location) // {pathname: '/user', search: '?name=zzt&age=18', hash: '', state: null, key: '1k1r7ie4'}
		const [searchParams] = useSearchParams()
		const query = Object.fromEntries(searchParams)
		console.log('query:', query); // {name: 'zzt', age: '18'}

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
		const { router } = this.props
		const query = router.query

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


目前我们所有的路由定义都是直接使用 Route 组件，并且添加属性来完成的。

但是这样的方式会让路由变得非常混乱，我们希望将所有的路由配置放到一个地方进行集中管理：

- 在 Router 5.x 及以前的版本，需要借助于 react-router-config 完成；
- 在 Router 6.x 中，使用 useRoutes API 可以完成相关的配置；

08-learn-reactrouter\src\App.jsx

```jsx
import React from 'react'
import { useNavigate, Link, useRoutes } from 'react-router-dom';
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

08-learn-reactrouter\src\router\index.js

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
		element: <Navigate to="/home" />
	},
	{
		path: '/home',
		element: <Home />,
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
	{
		path: '/detail/:id',
		element: <Detail />
	},
	{
		path: '/user',
		element: <User />
	},
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

在顶层使用 Suspense 组件包裹。

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
	 * 	2.即使页面重新渲染，意味着函数会被重新执行，那么重新给 msg 赋值为“Hello World”
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

## 类组件的缺陷

## Hooks 的出现

## 计数器案例

使用计数器案例对比函数式组件结合 Hooks 和类组件的实现方式。

## useState 的使用





