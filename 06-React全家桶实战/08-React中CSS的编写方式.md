# 一、React 中编写 CSS 的要求

整个前端已经是组件化的天下，而 CSS 的设计就不是为组件化而生的；

所以在目前组件化的框架中，在寻找一种合适的 CSS 解决方案。这个方案应该符合以下条件：

- 可以编写局部 css（具备自己的作用域，不会随意污染其他组件内的元素）。
- 可以编写动态的 css（可以获取当前组件的一些状态（state），根据状态的变化改变 css 样式）；
- 支持所有的 css 特性：伪类、动画、媒体查询等；
- 编写起来简洁方便、最好符合一贯的 css 风格特点；

# 二、Vue 中的 CSS

在编写 CSS 的规范性上，Vue 做的要好于 React：

- Vue 通过在 .vue 文件中编写 `<style>` 标签来编写自己的样式；
- 通过是否添加 `scoped` 属性来决定编写的样式是全局有效还是局部有效；
- 通过 `lang` 属性来设置你喜欢的预处理器，如 less、sass 等。
- 通过内联样式风格的方式来根据最新状态设置和改变 css；

# 三、React 中的 CSS

事实上，css 一直是 React 的痛点，也是被很多开发者吐槽、诟病的一个点。

相比而言，React 官方对 CSS 编写方式没有明确的态度。

因此在 React 项目中，出现了诸多不同的 CSS 编写方式，比如：

- 从普通的 css，
- css modules，
- css in js，

有几十种不同的解决方案，上百个不同的库；

大家都在寻找最好的或者说最适合自己的 CSS 方案，但是到目前为止也没有统一的方案；

# 四、React 的内联样式

内联样式是官方文档中有在用的一种 css 别写方式。

## 1.写法

JSX 上的 `style` 属性，接收一个采用小驼峰命名的 JavaScript 对象，而不是 CSS 字符串；

## 2.优点:

样式之间不会有冲突。

可以动态获取当前 state 中的状态。

## 3.缺点：

写法上需要使用驼峰标识。与普通 CSS 写法不同。

编写 CSS 时没有提示。

大量的样式, 被嵌入在逻辑代码中，混乱阅读性差。

某些样式无法编写(比如伪类、伪元素)。

04-learn-react-css\src\01-内联样式 css\App.jsx

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
        <h2 style={{ color: 'red', fontSize: `${titleSize}px` }}>我是标题</h2>
        <p style={{ color: 'blue', fontSize: '20px' }}>我是内容，哈哈哈</p>
      </div>
    )
  }
  addTitleSize() {
    this.setState({ titleSize: this.state.titleSize + 2 })
  }
}

export default App
```

# 五、方案一：普通 CSS

## 1.写法：

通常编写到一个单独的 .css/.less/... 文件中，再进行引入。

## 2.优点

与传统的 CSS 编写方式无异。容易上手。

## 3.缺点

当引用普通的 css 样式，它会被应用于全局的 css，样式之间会相互影响；me 没有局部的作用域。

04-learn-react-css\src\02-普通的 CSS 写法\App.jsx

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

04-learn-react-css\src\02-普通的 CSS 写法\App.css

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

## 4.less 支持：

React 项目添加 less 支持

方案一：使用 `npm run eject`，在弹出的配置文件中进行修改。

方案二：使用 `craco`（create-react-app config）

### 1.craco 使用步骤

1. 安装 _craco_

   ```shell
   npm i @craco/craco -D # 生产时依赖
   ```

2. 修改 react 项目 `package.json` 中的启动配置。

   ```json
   {
     "scripts": {
       "start": "craco start",
       "build": "craco build",
       "test": "craco test",
       "eject": "react-scripts eject"
     }
   }
   ```

3. 安装 _craco-less_

   ```shell
   npm i craco-less -D
   ```

4. 配置 `craco.config.js` 文件

   04-learn-react-css\craco.config.js

   ```js
   const CracoLessPlugin = require('craco-less')

   module.exports = {
     plugins: [
       {
         plugin: CracoLessPlugin
         /* options: {
           lessLoaderOptions: {
             lessOptions: {
               modifyVars: { '@primary-color': '#1DA57A' },
               javascriptEnabled: true,
             },
           },
         }, */
       }
     ]
   }
   ```

### 2.项目中使用 less

04-learn-react-css\src\04-less 编写方式\App.jsx

```jsx
import React, { PureComponent } from 'react'
import './App.less'

export class App extends PureComponent {
  render() {
    return (
      <div className='app'>
        <div className='section'>
          <h2 className='title'>我是标题</h2>
          <p className='content'>我是内容，哈哈哈哈</p>
        </div>
      </div>
    )
  }
}

export default App
```

# 六、方案二：CSS Moudules

css modules 并不是 React 项目特有的解决方案，而是所有使用了类似于 webpack 配置的环境下都可以使用的。

## 1.写法

React 的脚手架内置了 css modules 的配置：

非 React 项目，可能需要配置 `webpack.config.js` 中的 `modules: true` 等。

编写的样式文件后缀需要修改成 `.module.css`、`.module.less`、`.module.scss` 等；

之后就可以引用并且进行使用了；

## 2.优点

解决了局部作用域的问题。

## 3.缺点

所有的 `className` 都必须使用 `{styleModule.className}` 的形式来编写，比较麻烦；

引用的类名，不能使用连接符，如 `.home-title`，在 JavaScript 中是不识别的；

不能动态修改样式，依然需要使用内联样式的方式动态修改；

04-learn-react-css\src\03-CSS-Module\App.jsx

```jsx
import React, { PureComponent } from 'react'
import appStyle from './App.module.css'

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

04-learn-react-css\src\04-less 编写方式\App.less

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

# 七、方案三：CSS in JS

官方文档有提到过 CSS in JS 方案：又被人称之为 All in JS

这是指一种模式，其中 CSS 由 JavaScript 生成而不是在外部 css 文件中定义；

此功能需要由第三方库提供。

> React 2 个 UI 库使用 CSS 的方式
>
> - Material UI：CSS in JS
> - Ant-Desigh：CSS in JS

## 1.优点：

有局部作用域。

可以动态编写样式。

兼容传统 CSS 写法和 less 这样的预处理器的写法。

## 2.缺点：

这种开发的方式也受到了一些批评：

[Stop using CSS in JavaScript for web development](https://hackernoon.com/stop-using-css-in-javascript-for-web-development-fa32fb873dcc)

## 3.使用

目前比较常见的 CSS-in-JS 的库有：

- `styled-components`
- `emotion`
- `glamorous`

而 `styled-components` 是目前社区最流行的 CSS-in-JS 库。

### 1.styled-components 配置

1.安装 `styled-components`：

```shell
npm install styled-components
```

2.安装 _VSCode-style-component_ 插件，在编辑器中使代码高亮。

### 2.在项目中使用

04-learn-react-css\src\05-CSS-IN-JS\style.js

```js
import styled from 'styled-components'

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
import { AppWrapper } from './style'

export class App extends PureComponent {
  render() {
    return (
      <AppWrapper>
        <div className='footer'>
          <p>免责声明</p>
          <p>版权声明</p>
        </div>
      </AppWrapper>
    )
  }
}

export default App
```

### 3.原理分析

_styled-components_ 的本质是通过函数的调用，最终创建出一个组件：

这个组件会被自动添加上一个不重复的 `class`；

_styled-components_ 会给该这个 `class` 添加相关的样式；

### 4.props、attrs 属性

在 JSX 中通过 styled 组件的 attribute 传入 `props` 。

在 CSS IN JS 的模板字符串中通过 `${}` 传入一个插值函数，`props` 会作为该函数的参数传入；

还可在 `attrs` 方法中为 `props` 中的属性添加默认值。

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
import styled from 'styled-components'
import { primaryColor, largeSize } from './variables'

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
export const SectionWrapper = styled.div.attrs(props => ({
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
import { AppWrapper, SectionWrapper } from './style'

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
          <button onClick={e => this.setState({ color: 'skyblue' })}>修改颜色</button>
        </SectionWrapper>

        <div className='footer'>
          <p>免责声明</p>
          <p>版权声明</p>
        </div>
      </AppWrapper>
    )
  }
}

export default App
```

### 4.设置主题

_styled-components_ 高级特性-设置主题

04-learn-react-css\src\index.js

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './05-CSS-IN-JS/App'
import { ThemeProvider } from 'styled-components'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={{ color: 'purple', size: '50px' }}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
```

04-learn-react-css\src\05-CSS-IN-JS\Home\style.js

```js
import styled from 'styled-components'

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
        <div className='top'>
          <div className='banner'>BannerContent</div>
        </div>
        <div className='bottom'>
          <h2 className='header'>商品列表</h2>
          <ul className='poduct-list'>
            <li className='item'>商品列表1</li>
            <li className='item'>商品列表2</li>
            <li className='item'>商品列表3</li>
          </ul>
        </div>
      </HomeWrapper>
    )
  }
}

export default Home
```
