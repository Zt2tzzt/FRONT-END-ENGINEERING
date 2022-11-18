# 组件化的天下，对编写 CSS 的要求

整个前端已经是组件化的天下，而 CSS 的设计就不是为组件化而生的；所以在目前组件化的框架中，在寻找一种合适的 CSS 解决方案。这个方案应该符合以下条件：

- 可以编写局部 css：具备自己的作用域，不会随意污染其他组件内的元素；
- 可以编写动态的 css：可以获取当前组件的一些状态（state），根据状态的变化改变 css 样式；
- 支持所有的 css 特性：伪类、动画、媒体查询等；
- 编写起来简洁方便、最好符合一贯的 css 风格特点；

# Vue 中的 CSS

- 在编写 CSS 的规范性上，Vue 做的要好于 React：

  - Vue 通过在 .vue 文件中编写 <style><style> 标签来编写自己的样式；
  - 通过是否添加 `scoped` 属性来决定编写的样式是全局有效还是局部有效；
  - 通过 `lang` 属性来设置你喜欢的 less、sass 等预处理器；
  - 通过内联样式风格的方式来根据最新状态设置和改变 css；

- Vue 在 CSS上虽然不能称之为完美，但是已经足够简洁、自然、方便了，至少统一的样式风格不会出现多个开发人员、多个项目采用不一样的样式风格。

# React 中的 CSS

- 事实上，css 一直是 React 的痛点，也是被很多开发者吐槽、诟病的一个点。
- 相比而言，React 官方并没有给出在 React 中统一的样式风格（React 官方对 CSS 编写方式没有明确的态度）：

	- 由此，从普通的 css，到 css modules，再到 css in js，有几十种不同的解决方案，上百个不同的库；
	- 大家都在寻找最好的或者说最适合自己的 CSS 方案，但是到目前为止也没有统一的方案；


# 内联样式的写法。

内联样式是官方推荐的一种 css 样式的写法：
- style 接收一个采用小驼峰命名属性的 JavaScript 对象，而不是 CSS 字符串；可以引用 state 中的状态来设置相关的样式；

内联样式的优点:
- 内联样式, 样式之间不会有冲突。
- 可以动态获取当前 state 中的状态。

内联样式的缺点：
- 写法上都需要使用驼峰标识。
- 某些样式没有提示。
- 大量的样式, 代码混乱。
- 某些样式无法编写(比如伪类、伪元素)。

官方依然是希望内联样式和普通的 css 来结合编写；

04-learn-react-css\src\01-内联样式css\App.jsx

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
	constructor() {
		super()
		this.state = {
			titleSize: 30
		}
	}
	render() {
		const { titleSize } = this.state
		return (
			<div>
				<button onClick={e => this.addTitleSize()}>增加 titleSize</button>
				<h2 style={{color: "red", fontSize: `${titleSize}px`}}>我是标题</h2>
				<p style={{color: 'blue', fontSize: '20px'}}>我是内容，哈哈哈</p>
			</div>
		)
	}
	addTitleSize() {
		this.setState({ titleSize: this.state.titleSize + 2 })
	}
}

export default App
```

# 普通的 CSS 写法。

普通的 css 我们通常会编写到一个单独的文件，之后再进行引入。
这样的编写方式和普通的网页开发中编写方式是一致的：

- 如果我们按照普通的网页标准去编写，那么也不会有太大的问题；
- 但是组件化开发中我们总是希望组件是一个独立的模块，即便是样式也只是在自己内部生效，不会相互影响；
- 但是当引用普通的 css 样式，它会被应用于全局的 css，样式之间会相互影响；

这种编写方式最大的问题是样式之间会相互层叠掉；

04-learn-react-css\src\02-普通的CSS写法\App.jsx

```jsx
import React, { PureComponent } from 'react'
import './App.css'

export class App extends PureComponent {
	render() {
		return (
			<div>
				<h2 className='title'>我是标题</h2>
				<p className='content'>我是内容，哈哈哈</p>
			</div>
		)
	}
}

export default App
```

04-learn-react-css\src\02-普通的CSS写法\App.css

```css
.title {
	font-size: 32px;
	color: green;
}

.content {
	font-size: 22px;
	color: orange;
}
```

# CSS Moudules 的写法。

css modules 并不是 React 特有的解决方案，而是所有使用了类似于 webpack 配置的环境下都可以使用的。

- 如果在其他项目中使用它，那么我们需要自己来进行配置，比如配置 webpack.config.js 中的 `modules: true` 等。

React 的脚手架已经内置了 css modules 的配置：
- .css/.less/.scss 等样式文件都需要修改成 `.module.css`、`.module.less`、`.module.scss` 等；之后就可以引用并且进行使用了；

css modules 确实解决了局部作用域的问题，也是很多人喜欢在 React 中使用的一种方案。但是这种方案也有自己的缺陷：

- 引用的类名，不能使用连接符，如 `.home-title`，在 JavaScript 中是不识别的；
- 所有的 className 都必须使用 `{style.className}` 的形式来编写，比较麻烦；
- 不方便动态来修改某些样式，依然需要使用内联样式的方式；

如果你觉得上面的缺陷还算OK，那么你在开发中完全可以选择使用 css modules 来编写，并且也是在 React 中很受欢迎的一种方式。

04-learn-react-css\src\03-CSS-Module\App.jsx

```jsx
import React, { PureComponent } from 'react'
import appStyle from './App.module.css';

export class App extends PureComponent {
	render() {
		return (
			<div>
				<h2 className={appStyle.title}>我是标题</h2>
				<p className={appStyle.content}>我是内容，哈哈哈哈</p>
			</div>
		)
	}
}

export default App
```

04-learn-react-css\src\03-CSS-Module\App.module.css

```css
.title {
	font-size: 32px;
	color: green;
}
.content {
	font-size: 22px;
	color: orange;
}
```

# 为 React 项目添加 less 支持：

## 两种方案：

- 方案一：使用 `npm run eject`，在弹出的配置文件中进行修改。
- 方案二：使用 craco（create-react-app config）

> React 2个 UI 库使用 CSS 的方式
>
> - Material UI：CSS in JS
> - Ant-Desigh：less

## 如何使用 craco

1. 安装 craco

   ```shell
   npm i @craco/craco
   ```

2. 修改 react 项目 package.json 中的启动配置。

   ```json
   {
     "scripts": {
       "start": "craco start",
       "build": "craco build",
       "test": "craco test",
       "eject": "react-scripts eject"
     },
   }
   ```

3. 安装 craco-less

   ```shell
   npm install craco-less
   ```

4. 配置 craco.config.js 文件

   04-learn-react-css\craco.config.js

   ```js
   const CracoLessPlugin = require('craco-less');

   module.exports = {
     plugins: [
       {
         plugin: CracoLessPlugin,
         options: {
           lessLoaderOptions: {
             lessOptions: {
               modifyVars: { '@primary-color': '#1DA57A' },
               javascriptEnabled: true,
             },
           },
         },
       },
     ],
   };
   ```

## 在项目中使用 less

04-learn-react-css\src\04-less编写方式\App.jsx

```jsx
import React, { PureComponent } from 'react'
import './App.less'

export class App extends PureComponent {
	render() {
		return (
			<div className="app">
				<div className="section">
					<h2 className="title">我是标题</h2>
					<p className='content'>我是内容，哈哈哈哈</p>
				</div>
			</div>
		)
	}
}

export default App
```

04-learn-react-css\src\04-less编写方式\App.less

```less
@primaryColor: red;

.section {
	bottom: 1px solid @primaryColor;

	.title {
		font-size: 30px;
		color: @primaryColor;
	}

	.content {
		font-size: 20px;
		color: @primaryColor;
	}
}
```

# CSS in JS 的写法

- 官方文档也有提到过 CSS in JS 这种方案：
	- 这是指一种模式，其中 CSS 由 JavaScript 生成而不是在外部文件中定义；
	- 注意此功能并不是 React 的一部分，而是由第三方库提供；**React 对样式如何定义并没有明确态度**；

- 在传统的前端开发中，我们通常会将结构（HTML）、样式（CSS）、逻辑（JavaScript）进行分离。
	- 但是在前面的学习中，我们就提到过，React 的思想中认为逻辑本身和 UI 是无法分离的，所以才会有了 JSX 的语法。而样式也是属于 UI 的一部分；
	- 事实上 CSS-in-JS 的模式就是一种将样式（CSS）也写入到 JavaScript 中的方式，并且可以方便的使用 JS 中的状态；
	- 这种写法又被人称之为 All in JS；

- 当然，这种开发的方式也受到了很多的批评：
	- [Stop using CSS in JavaScript for web development](https://hackernoon.com/stop-using-css-in-javascript-for-web-development-fa32fb873dcc)

## 认识 styled-components

- 批评声音虽然有，但是在我们看来很多优秀的 CSS-in-JS 的库依然非常强大、方便：
	- CSS-in-JS 通过 JavaScript 来为 CSS 赋予一些能力，包括类似于 CSS 预处理器一样的样式嵌套、函数定义、逻辑复用、动态修改状态等等；
	- 虽然 CSS 预处理器也具备某些能力，但是**获取动态状态**依然是一个不好处理的点；
	- 所以，目前可以说 CSS-in-JS 是 React 编写 CSS 最为受欢迎的一种解决方案；

- 目前比较流行的 CSS-in-JS 的库有哪些呢？
	- styled-components
	- emotion
	- glamorous

- 目前可以说 styled-components 依然是社区最流行的 CSS-in-JS 库。

## 使用 styled-components

1. 安装 styled-components：

   ```shell
   npm install styled-components
   ```
> 回顾标签模板字符串的用法。

2. 安装 VSCode-style-component 插件，使代码高亮。

### 基本使用。

04-learn-react-css\src\05-CSS-IN-JS\style.js

```js
import styled from 'styled-components';

// style.div`` 返回一个组件，这个组件渲染一个 div 元素。
export const AppWrapper = styled.div`
	.footer {
		border: 1px solid orange;
	}
`
```

04-learn-react-css\src\05-CSS-IN-JS\App.jsx

```jsx
import React, { PureComponent } from 'react'
import { AppWrapper } from './style';

export class App extends PureComponent {
	render() {
		return (
			<AppWrapper>
				<div className="footer">
					<p>免责声明</p>
					<p>版权声明</p>
				</div>
			</AppWrapper>
		)
	}
}

export default App
```

- styled-components 的本质是通过函数的调用，最终创建出一个组件：
	- 这个组件会被自动添加上一个不重复的 class；
	- styled-components 会给该 class 添加相关的样式；

- 另外，它支持类似于 CSS 预处理器一样的样式嵌套：
	- 支持直接子代选择器或后代选择器，并且直接编写样式；
	- 可以通过 `&` 符号获取当前元素；
	- 支持伪类选择器、伪元素等；

### props、attrs 属性的使用

- props 可以传递

- props 可以被传递给 styled 组件
	- 获取 props 需要通过 `${}` 传入一个插值函数，props 会作为该函数的参数；
	- 这种方式可以有效的解决动态样式的问题；

- 添加 attrs 属性

04-learn-react-css\src\05-CSS-IN-JS\variables.js

```jsx
export const primaryColor = '#ff8822'
export const secondColor = '#ff7788'

export const smallSize = '12px'
export const middleSize = '14px'
export const largeSize = '18px'
```

04-learn-react-css\src\05-CSS-IN-JS\style.js

```jsx
import styled from 'styled-components';
import { primaryColor, largeSize } from './variables';

// style.div`` 返回一个组件，这个组件渲染一个 div 元素。
export const AppWrapper = styled.div`
	.footer {
		border: 1px solid orange;
	}
`

// 1. 子元素单独抽取到一个样式组件
// 2. 可以接收外部传入的 props
// 3. 可以通过 attrs 给标签模板字符串中提供属性值
// 4. 从一个单独的文件中引入变量
export const SectionWrapper = styled.div.attrs(props =>({
	tcolor: props.color || 'blue' // 为避免递归，使用 tcolor 代替传递过来的 color
}))`
	border: 1px solid red;

	.title {
		font-size: ${props => props.size}px;
		color: ${props => props.tcolor};

		&:hover {
			background-color: purple;
		}
	}

	.content {
		font-size: ${largeSize}px;
		color: ${primaryColor};
	}
`
```

04-learn-react-css\src\05-CSS-IN-JS\App.jsx

```jsx
import React, { PureComponent } from 'react'
import { AppWrapper, SectionWrapper } from './style';

export class App extends PureComponent {
	constructor() {
		super()
		this.state = {
			size: 30,
			color: 'yellow'
		}
	}
	render() {
		const { size, color } = this.state
		return (
			<AppWrapper>
				<SectionWrapper size={size} color={color}>
					<h2 className='title'>我是标题</h2>
					<p className='content'>我是内容，哈哈哈</p>
					<button onClick={e => this.setState({color: 'skyblue'})}>修改颜色</button>
				</SectionWrapper>

				<div className="footer">
					<p>免责声明</p>
					<p>版权声明</p>
				</div>
			</AppWrapper>
		)
	}
}

export default App
```

### styled 高级特性-设置主题

04-learn-react-css\src\index.js

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './05-CSS-IN-JS/App'
import { ThemeProvider } from 'styled-components'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<ThemeProvider theme={{color: 'purple', size: '50px'}}>
			<App />
		</ThemeProvider>
	</React.StrictMode>
)
```

04-learn-react-css\src\05-CSS-IN-JS\Home\style.js

```js
import styled from 'styled-components';

export const HomeWrapper = styled.div`
	.top {
		.banner {
			color: red;
		}
	}

	.bottom {
		.header {
			color: ${props => props.theme.color};
			font-size: ${props => props.theme.size};
		}

		.product-list {
			.item {
				color: blue;
			}
		}
	}
`
```

04-learn-react-css\src\05-CSS-IN-JS\Home\index.jsx

```jsx
import React, { PureComponent } from 'react'
import { HomeWrapper } from './style'

export class Home extends PureComponent {
	render() {
		return (
			<HomeWrapper>
				<div className="top">
					<div className="banner">BannerContent</div>
				</div>
				<div className="bottom">
					<h2 className="header">商品列表</h2>
					<ul className="poduct-list">
						<li className="item">商品列表1</li>
						<li className="item">商品列表2</li>
						<li className="item">商品列表3</li>
					</ul>
				</div>
			</HomeWrapper>
		)
	}
}

export default Home
```
