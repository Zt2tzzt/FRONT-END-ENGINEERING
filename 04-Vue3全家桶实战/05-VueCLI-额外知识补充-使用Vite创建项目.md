# VueCLI 的运行原理

1. 执行命令 npm run serve -> 
2. 执行命令 vue-cli-service serve -> 
3. 找到并执行 node_modules/.bin/vue-cli-service -> 
4. 找到并执行 @vue/cli-service ->
5. 经过一系列操作加载 webpack 配置 ->
6. 启动 devServer 服务器。

<img src="NodeAssets/Vue CLI运行原理.jpg" alt="Vue CLI 运行原理" style="zoom:80%;" />

# 额外知识补充

在 vue.config.js 中配置 resolve 别名。

- “@”是 Vue 默认已经配置好的路径别名: 对应的是 src/ 路径

```js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {  
      alias: {
        "utils": "@/utils" // 配置路径别名，“@”是 Vue 默认已经配置好的路径别名: 对应的是 src/ 路径
      }
    }
  }
})
```

> 修改配置文件后，项目要重新运行。

-----

在 jsconfig.josn 中配置 VSCode 的路径提示。了解其它选项的作用。

```json
{
  "compilerOptions": {
    "target": "es5", // 最终打包出来的是 es5 的代码。
    "module": "esnext", // 采用 es 模块化规范。
    "baseUrl": "./", // 路径基于当前项目目录下。
    "moduleResolution": "node", // 模块的查找顺序，按照 node 的顺序查找。
    "paths": { // 指定路径别名。
      "@/*": [
        "src/*"
      ]
    },
    "lib": [ // 准备用到哪些语法。
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  }
}
```

-----

理解 Vue 的渲染流程。

- template -> (compiler 模块) -> createVNode 函数 -> VNode -> 虚拟 DOM -> 真实 DOM
- vue-loader 完成了 template 转换到 createVNode 函数的编译过程。
- 在非脚手架（没有 vue-loader 参与打包）的环境中，需要 Vue 的源码来完成上面的编译 compiler 过程，即需要引入非 runtime 版本的 Vue 源码，如 `vue.esm-buldel.js`。

-----

vue 的 sfc 文件 css 作用域的理解

- style 标签加上 scoped 可以防止样式污染（穿透）。

  ```vue
  <style scoped></style>
  ```

- 文件打包后通过给组件加上一个特殊的属性如 “data-v-f23aade0”，来防止样式穿透。

  > 然而，组件要是没有根元素，或使用的是元素选择器添加样式，可能还是会出现穿透效果。
  >
  > 所以在开发中，一般推荐给组件**加上根元素**，**通过 class 来给样式**。


# Vite 创建项目（一）

如何使用 vite 脚手架来创建项目：

- 直接使用 vite 脚手架创建项目，可创建 vue，react 等等项目：

  ```shell
  npm init @vitejs/app
  ```

- 先安装 vite 脚手架，再创建项目：

  ```shell
  npm install @vitejs/create-app -g
  create-app
  ```

# Vite 创建项目（二）（推荐）

使用 Vite 初始化 Vue 项目的第二种方式（一步到位的写法，官方推荐）：

```shell
npm init vue@latest
```

1. 首先要知道，能执行上面的命令，代表远程仓库已有 `create-vue` 工具，
2. 会安装一个本地工具 create-vue。
3. 再使用 create-vue 创建一个 vue 项目
4. 创建出的项目会通过 vite 打包

# 什么是 Vite

vite 的定位：下一代构建工具；vite 的发音：/vit/；vite 由两部分组成：

- 一个开发服务器，基于原生 ES 模块，提供了丰富的内建功能。HMR 的速度非常快。
- 一套构建指令，它使用 rollup 打开代码，并且是预配置的，可输出优化后的静态资源。

------

现在大部分新的浏览器，都已支持 ES6+ 语法和 ES 模块化，vite 只需帮助我们解决2点问题：

- 引入第三方依赖如 lodash，加载了上百个 js 代码，对于浏览器是巨大消耗（打包代码）。
- 代码中有 Typescript，less，vue 等代码时，浏览器并不能直接识别（预处理器）。

------

vite 依赖 Node 环境，Node 版本要 >= 12.0.0

# vite 的使用（一）：

## 安装

```shell
npm install vite -g
```

vite 的使用

```shell
npx vite
```

默认打包后的效果：

- 引用模块路径不用加后缀名。
- 引用第三方依赖可直接使用依赖名。
- 将请求的第三方依赖打包在一个文件中，减少发送请求的次数。
- 第一次使用 vite 打包，会对第三方依赖做预打包，放在 node_modules/vite 中。

------

## css 支持

vite 对 css 的默认支持，直接导入 css 即可。

## less 支持

vite 对 less 的支持步骤：

1. 安装 less 编译器

   ```shell
   npm install less -D
   ```

2. 直接导入 less 即可

## postcss 支持

vite 对 postcss 的支持步骤：

1. 安装 postcss，和预设

   ```shell
   npm install postcss postcss-preset-env -D
   ```

2. 在 `postcss.config.js` 中配置 postcss：

   ```javascript
   module.exports = {
     plugins: {
       require('postcss-preset-env')
     }
   }
   ```

## TypeScript 支持

Vite 对 TypeScript 的支持：原生支持，会直接使用 ESBuild 来完成编译：直接导入 ts 即可。

# vite 原理

理解 vite 的原理（ vite2 中不再使用 Koa 作为服务器）

1. 浏览器发送请求给 vite 中的 Connect 服务器。
2. Connect 服务器对请求进行转发。
3. 给浏览器返回编译后的代码，浏览器可直接解析（比如，浏览器中获取的仍是 .ts 结尾的代码文件，但里面的代码是 js 的语法）。

# vite 的使用（二）

## Vue 的支持

vite 对 vue 提供的3种版本的支持。

- vue3 的 SFC 支持：@vitejs/plugin-vue
- vue3 的 JSX 支持：@vitejs/plugin-vue-jsx
- Vue2 的支持：underfin/vite-plugin-vue2

vite 对 vue3 的 SFC 打包的步骤：

1. 安装 vite 插件 @vitejs/plugin-vue：

   ```shell
   npm install @vitejs/plugin-vue -D
   ```

2. 安装 vue 插件 @vue/compiler-sfc

   ```shell
   npm install @vue/compiler-sfc -D
   ```

3. 在`vite.config.js`中配置插件

   ```javascript
   import vue from '@vitejs/plugin-vue';
   
   module.exports = {
     plugins: [ vue() ]
   }
   ```

## 打包、预览

vite 的打包操作：

```shell
npx vite build
```

vite 的预览操作：(开启一个本地服务来预览打包后的效果)

```shell
npx vite preview
```

在`package.json`中配置：

```json
"script": {
  "serve": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

> 为什么 vite 打包的项目中，package.json 有 `preview` 的脚本？
>
> 因为 Vite 中打包用的是 rollup 工具，而开启本地服务（npm run dev）时并不是用的该打包工具。
>
> 为验证打包后部署到服务器上的项目，和本地开启服务的项目环境一致，可以使用 `preview` 命令进行预览。

# 认识 ESBuild

ESBuild 特点：（有 babel 的功能，同时也兼顾一些 webpack 的功能）

- 超快构建速度，且不需要缓存。
- 支持 ES 和 CommonJS 模块化（webpack）
- 支持 ES6 的 Tree Shaking（webpack）
- 支持 Go、JavaScript 的 API（babel 不支持 Go）
- 支持 TypeScript、JSX 等语法编译（babel）
- 支持 SourceMap。（webpack）
- 支持代码压缩；（webpack）
- 支持扩展其它插件；(webpack)

ESBuild 为什么这么快：

- 使用 Go 编写，无需经过字节码，直接转换成机器码；
- 可充分利用 CPU 的多核，尽可能让它们饱和运行；
- ESBuild 从0编写，不使用第三方库，考虑了各种性能问题。

