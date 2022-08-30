# 本地服务配置

## host 配置

devServer 中使用 host 设置主机地址，两个值，区别

- 默认值是 locahost：
  - 本质是域名，会被解析为 127.0.0.1，它是回环地址（loop back address），意思是主机自己发送的包，被自己接收。
  - 正常的数据包经过**应用层-传输层-网络层-数据链路层-物理层**，在回环地址中，数据包在网络层被获取到，不会经过后面2层。
  - 比如我们监听 127.0.0.1 时，在同一个网段下的主机中，通过 ip 地址是不能访问的;
- 0.0.0.0：( windows 浏览器解析可能会出错。)
  - 监听 IPV4 上所有的地址，再根据端口找到不同的应用程序。
  - 比如监听 0.0.0.0 时，同一网段下的主机，通过 ip 地址可以访问

```javascript
module.exports = {
  devServer: {
    host: '0.0.0.0'
  }
}
```

------

##  port，open，compress 配置

devServer 中 port，open，compress 等属性的配置，可用的值含义。

- port：设置监听的端口，默认是 8080

- open：是否打开浏览器：默认是 false，设为 true 自动打开浏览器。

- compress：是否为静态文件开启 gzip compression，不会压缩 HTML 文件，浏览器可自动对 gzip 格式解压，

```javascript
module.exports = {
  devServer: {
    port: 8000,
    open: true,
    compress: false
  }
}
```

------

## 跨域问题怎么产生的？

比如一个 api 请求是 `http://localhost:8888` ，但本地启动服务器域名是 `http://localhost:8000`，这个时候浏览器发送网络请求就会出现跨域问题。

跨域问题的解决办法，3点：

- 将静态资源和 api 服务器部署在一起。
- 让服务器关闭跨域。
- 使用 nginx 代理访问静态资源和 api

以上方式都需要后端参与，那么在开发中我们如何临时解决跨域问题？在 webpack 中设置代理。

------

## proxy 配置

devServer 中 proxy 有什么用：

设置代理来解决跨域的问题。将请求发送到代理服务器，代理服务器和 api 服务器没有跨域问题。

devServer 中的 proxy 怎么配置：

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
				target: 'http://localhost:8888', // 代理的目标地址，默认情况下将代理 http://localhost:8888/api 这个路径
				pathRewrite: {
					"^/api": '' // 在代理路径中删除掉/api
				},
        secure: false, // 在 https 的情况下，仍代理，默认为 true
        changeOrigin: true // 表示是否更新代理后，请求的 headers 中 host 地址，默认 http://localhost:8000 ,应该为 http://localhost:8888
      }
    }
  }
}
```

------

# 环境区分

区分开发和生产环境的 `webpack.config.js` 步骤

1. 在根目录下建立 `config` 文件夹

2. 在其中添加三个文件 `webpack.comm.config.js`，`webpack.dev.config.js`，`webpack.prod.config.js`

3. 在 `webpack.dev.config.js` 和 `webpack.prod.config.js` 中导入 `webpack.comm.config.js` 并合并。

   ```shell
   npm install webpack-merge -D
   ```

   webpack.dev.config.js

   ```javascript
   const { merge } = require('webpack-merge') 
   const commonConfig = require('./webpack.comm.config')
   module.exports = merge(commonConfig, {
     // ...
   })
   ```

4. 修改文件中引用的路径，注意，入口文件路径比较特殊，与 context 属性有关，该属性一般不设置，默认值是 webpack 命令执行的目录，也就是项目根目录。

   ./config/webpack.comm.config.js

   ```javascript
   const path = require('path')
   module.exports = {
     context: path.resolve(__dirname, './'), // 为入口文件设置相对路径，此时代表 ./config 目录，
     entry: "../src/index.js" // 默认是 ./src/index.js，即 webpack 运行的目录，即项目根目录
   }
   ```

5. 配置`package.json`文件中的指令

   ```json
   "script": {
     "build": "webpack --config ./config/webpack.prod.config.js",
     "serve": "webpack serve --config ./config/webpack.dev.config.js"
   }
   ```

