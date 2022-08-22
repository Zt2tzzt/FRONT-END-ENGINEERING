# webpack 依赖图

webpack 依赖图的概念3点理解。

<img src="NodeAssets/webpack工作原理图.jpg" alt="webpack工作原理图" style="zoom:150%;" />

1. webpack 在处理应用程序时，会根据命令或者配置文件找到入口文件，默认是 `./src/index.js`。
2. 从入口开始，会生成一个依赖关系图，其中包含应用程序所需所有模块（如 js 文件，css文件，图片，字体等）
3. 然后遍历图结构，打包一个个模块（根据文件不同使用不同 loader 解析）

------

如何将 css 文件引入到 webpack 的依赖图结构中，以便进行打包。

- 要在入口文件或被入口文件引用的文件中引入 css，才能被打包：

./src/index.js

```javascript
import '../css/style.css'
```

------

# webpack loader

什么是 loader？

1. loader 可用于对模块的源代码进行转换。
2. 比如将 css 文件看作一个模块，我们通过 `import` 来加载这个模块，
3. 在加载这个模块时，webpack 并不知道如何对其加载，必须制定对应的 loader 来完成这个功能。
4. webpack 默认可以对 JS 打包，所以不需要 JS 的 loader

loader 的配置方式

- 配置方式表示的意思是在我们的 webpack.config.js 文件中写明配置信息： 
	- module.rules 中允许我们配置多个 loader（因为我们也会使用不止一个 loader，来完成其他文件模块的加载）； 
	- 这种方式可以更好的表示 loader 的配置，也方便后期的维护，同时也让你对各个 Loader 有一个全局的概览；

module.rules 的配置如下： 

- rules 属性对应的值是一个数组：[Rule] 
- 数组中存放的是一个个 Rule 对象，其中可以设置多个属性： 
	- test 属性：用于对 resource（资源）进行匹配的，通常会设置成正则表达式； 
	- use 属性：对应的值是一个数组：[UseEntry] 
		- UseEntry 是一个对象，可以通过对象的属性来设置一些其他属性 
			- loader：必须的属性，对应的是一个字符串； 
			- options：可选的属性，值是一个字符串或者对象，值会被传入到 loader 中； 
			- query：目前已经使用 options 来替代；
		- 传递字符串（如：use: [ 'style-loader' ]）是 loader 属性的简写方式（如：use: [ { loader: 'style-loader'} ]）；
	- loader 属性： Rule.use: [ { loader } ] 的简写。

------

# CSS 打包

## css-loader

css-loader 安装

```shell
npm install css-loader -D
```

css-loader 的3种使用方案。

1. 内联方式，使用较少，不方便管理。

   ```javascript
   import "css-loader!../css/style.css"
   ```

2. CLI方式（webpack5 中不再使用），不方便管理。

3. 在 `webpack.config.js` 中写明配置信息，方便后期维护。

------

## style-loader

style-loader 有什么用：

- css-loader 只是负责将 .css 文件进行解析，并不会将解析后的 css 插入到页面中，所以需要 style-loader 完成这步操作。

安装 style-loader：

```shell
npm install style-loader -D
```

配置 style-loader：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 对资源进行匹配，通常是正则表达式
        // loader: "css-loader", // 简写写法一
        // use: ["css-loader"], // 简写写法二
        use: [
        	{loader: "style-loader"},
        	{loader: "css-loader"},
        ]
      }
    ]
  }
}
```

- 多个 loader 的加载顺序：从下到上，从后到前，从右向左。
- 使用上述方法，css 打包后是作为内部样式添加到 html 模板文件上。如果要达到使用外部样式引入的效果，需要使用 plugin（后续讲解）

------

## less 打包

webpack 如何打包 less，

安装 less 工具，将 less 文件编译成 css，

```shell
npm install less -D
npx lessc ./src/css/title.less title.css
```

在 webpack 中使用 less-loader，自动完成编译转换：

1. 安装 less-loader

	```shell
	npm install less-loader -D
	```

2. 配置 `webpack.config.js`

   ```javascript
   module.exports = {
     module: {
       rules: [
         {
           test: /\.less$/,
           use: [
             {loader: "style-loader"},
             {loader: "css-loader"},
             {loader: "less-loader"}, // less 处理后会转成 css，所以上面还要加上 css 的 loader
           ]
         }
			 ]
		 }
   }
   ```
   

------

##  PostCSS 工具

什么是 PostCSS，3点：

1. PostCSS 是一个通过 JavaScript 来转换样式的工具。
2. 它可自动进行一些 css 转换和适配，比如自动添加浏览器前缀，css 样式的重置（语法向下兼容）。
3. 但是，实现这些功能，需要借助 PostCSS 插件，如 autoprefixer，可用于添加 css 前缀的插件。

PostCSS 如何单独使用，

1. 安装 postcss，postcss-cli

   ```shell
   npm install postcss postcss-cli -D
   ```

2. 安装需要的插件，如 autoprefixer：

	```shell
	npm install autoprefixer -D
	```

3. 执行命令，转换 css，（-o：输出到哪里）

	```shell
	npx postcss --use autoprefixer -o end.css ./src/css/style.css
	```

如何在 webpack 中使用，2点：

1. 安装 postcss-loader。

   ```shell
   npm install postcss-loader -D
   ```

2. 安装 PostCSS 的插件，如 autoprefixer。

   ```shell
   npm install autoprefixer -D
   ```

3. 在 `webpack.config.js` 中配置需要加载的 css 的 loader

   ```javascript
   module.exports = {
     module: {
       rules: [
         {
           test: /\.css$/,
           use: [
             // style-loader, //简写形式
             // css-loader,
           	{loader: "style-loader"},
           	{loader: "css-loader"},
             {
               loader: 'postcss-loader',
               options: {
                 postcssOptions: {
                   plugins: [
                     // require('autoprefixer')
                     "autoprefixer" // 现在已支持不写 require
                   ]
                 }
               }
             }
           ]
         }
       ]
     }
   }
   ```

------

如何单独的使用 PostCSS 配置文件：

- 可以i将配置信息放到单独的文件中进行管理，在项目根目录下创建 `postcss.config.js`

  ./postcss.config.js
  
  ```javascript
  module.exports = {
    plugins: [
      // require('autoprefixer')
      'autoprefixer' // 可省略 require
    ]
  }
  ```

------

postcss-preset-env 是 postcss 预设的插件，作用是：

1. 将一些现代 css 特性，转成大多数浏览器都认识的 css，根据目标浏览器或运行环境添加所需 polyfill。
2. 自动添加 autoprefixer，添加 css 前缀。

使用：

1. 安装 postcss-preset-env

   ```shell
   npm install postcss-preset-env -D
   ```

2. 替换掉之前的针对 autoprefixer 的配置

	./postcss.config.js

	```js
	module.exports = {
		plugins: [
			// require('postcss-preset-env')
			'postcss-preset-env'
		]
	}
	```

-----

# 各种资源打包

在项目中引入图片的2种方式

- img 元素，设置 src 属性； 
- 其他元素（比如 div ），设置 background-image 的 css 属性；

------

## file-loader & url-loader

加载文件时可使用 file-loader 和 url-loader，

file-loader 作用：

- 处理 import / require() 方式引入的一个文件资源，将它放到输出的文件夹中。

url-loader 作用：

- 和 file-loader 工作方式相似，默认情况下会把文件转成 base64 URL。

url-loader 可以取代 file-loader。

以上2个 loader，webpack5 中已不推荐使用。

------

为什么有些资源不直接引用路径，而是通过 import 引入？

- 因为只有将文件当作一个**模块**导入，才能被 file-loader 识别，并执行解析和打包

```js
import zznhImage from '../img/zznh.png'
const imgEl = document.createElement('img')
imgEl.src = zznhImage
document.body.append(imgEl)
```

------

用于文件名配置的占位符 placeHolders，6个

- [ext]：处理文件的扩展名。
- [name]：处理文件的名称。
- [hash]：文件的内容，使用 MD4 的散列函数处理，生成的一个128位的 hash 值（32个十六进制）
- [contentHash]：在 file-loader 中和 [hash] 结果是一致的。
- [hash:\<length\>]：截取 hash 的长度，默认32个字符太长了。
- [path]：文件相对于 webpack 配置文件的路径。

------

在配置中设置 file-loader 文件路劲和名称：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/, // 匹配图片文件的正则表达式
        use: {
          loader: 'file-loader',
          options: {
            // outputPath: 'img', // 可在name中直接设置。
            name: 'img/[name]_[hash:8].[ext]'
          }
        }
      }
    ]
  }
}
```

------

在开发中为什么需要使用 base64 编码的图片：

- 因为小的图片转换 base54 后可以与页面一起被请求，减少不必要的请求过程。

------

url-loader 配置某个数值大小的图片转成 base64：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'img/[name]_[hash:8].[ext]',
            limit: 10 * 1024, // 大于 10kb 的图片不会做 base64 转换。
          }
        }
      }
    ]
  }
}
```

------

## asset module type

webpack5 中内置的资源模块类型（asset module type）4个，作用

- asset/resource：发送一个单独的文件并导出 URL，类似 file-loader 的作用。
  - 缺点：要发送额外的网络请求下载资源。
- asset/inline：导出一个资源的 data URL，类似 url-loader 的作用。
  - 缺点：可能造成 JS 文件过大，代码执行阻塞。
- asset/source：导出资源的源代码，之前通过使用 raw-loader 实现。
  - 如二进制的文件源码，没什么用，只有需要自己对源代码做解码的时候才会用到。
- asset：在发送一个单独的文件和导出一个data URL 之间自动选择，之前通过使用 url-loader，并且配置资源体积限制实现。

开发中如何选择？

- 往往是小的图片需要转换 base64，而大的图片直接请求即可 。
- 这是因为小的图片转换 base64 之后可以和页面一起被请求，减少不必要的请求过程；
- 如果大的图片也进行 base64 转换，反而会影响页面的请求速度；

------

使用 asset module type 配置文件名和路径，2种，实现 limit 效果。

```javascript
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: 'js/bundle.js',
    assetModuleFilename: 'img/[name]_[hash:6][ext]' // [ext]前不用加"."
  },
  module: {
    rules: [
      {
        test: '/\.(jpe?g|png|gif|svg)$/',
        type: 'asset',
     /* generator: {
          filename: 'img/[name]_[hash:6][ext]'
        },*/ // 也可在 output -> assetModuleFilename 中配置。
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 实现 url-loader 的 limit 效果。
          }
        }
      }
    ]
  }
}
```

------

打包字体的2种方式：

1. 可以使用 file-loader 来处理：

   ```javascript
   {
     test: /\.(eot|ttf|woff2?)$/,
     use: {
       loader: 'file-loader',
       options: {
         name: 'font/[name]_[hash:8].[ext]',
       }
     }
   }
   ```

2. 推荐使用 asset module type 来处理：

   ```javascript
   {
     test: /\.(eot|ttf|woff2?)$/,
     type: 'asset/resource',
     generator: {
       filename: 'font/[name]_[hash:6][ext]'
     }
   }
   ```
