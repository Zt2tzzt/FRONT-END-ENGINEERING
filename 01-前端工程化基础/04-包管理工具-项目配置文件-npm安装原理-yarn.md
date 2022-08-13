npm 的配置文件是 package.json，它有什么用？

- 事实上，每一个项目都会有一个对应的配置文件，无论是前端项目（Vue、React）还是后端项目（Node）；
- 这个配置文件会记录着你项目的名称、版本号、项目描述等；
- 也会记录着项目所依赖的其他库的信息和依赖库的版本号；

如何创建它？

- 手动从零创建项目，`npm init –y`
- 通过脚手架创建项目，脚手架会帮助我们生成 package.json，并且里面有相关的配置。

-----

package.json 中有哪些常见的属性，它们有什么含义？
- 必须填写的属性：name、version
	- name 是项目的名称；
	- version 是当前项目的版本号；
	- description 是描述信息，很多时候是作为项目的基本描述；
	- author 是作者相关信息（发布时用到）；
	- license 是开源协议（发布时用到）；
- private 属性：
	- private 属性记录当前的项目是否是私有的；
	- 当值为 true 时，npm 是不能发布它的，这是防止私有项目或模块发布出去的方式；
- main 属性：
	- 设置程序的入口。
		- 比如我们使用 axios 模块 const axios = require('axios');
		- 如果有 main 属性，实际上是找到对应的 main 属性查找文件的；
- scripts属性
	- scripts 属性用于配置一些脚本命令，以键值对的形式存在；
	- 配置后我们可以通过 `npm run` 命令的 key 来执行这个命令；
	- npm start 和 npm run start 的区别是什么？
		- 它们是等价的；
		- 对于常用的 start、 test、stop、restart 可以省略掉 run 直接通过 npm start 等方式运行；
- dependencies 属性
	- dependencies 属性是指定无论开发环境还是生产环境都需要依赖的包；
	- 通常是我们项目实际开发用到的一些库模块 vue、vuex、vue-router、react、react-dom、axios 等等；
	- 与之对应的是 devDependencies；
- devDependencies 属性
	- 一些包在生产环境是不需要的，比如 webpack、babel 等；
	- 这个时候我们会通过 npm install webpack --save-dev，将它安装到 devDependencies 属性中；
- peerDependencies 属性
	- 还有一种项目依赖关系是对等依赖，也就是你依赖的一个包，它必须是以另外一个宿主包为前提的；
	- 比如 element-plus 是依赖于 vue3 的，ant design 是依赖于 react、react-dom；
- engines 属性（很少用）
	- engines 属性用于指定 Node 和 NPM 的版本号；
	- 在安装的过程中，会先检查对应的引擎版本，如果不符合就会报错；
	- 事实上也可以指定所在的操作系统 "os" : [ "darwin", "linux" ]，只是很少用到；
- browserslist 属性（很少用，开发中一般在项目根目录使用 .browserslistrc 文件）
	- 用于配置打包后的 JavaScript 浏览器的兼容情况，参考；
	- 否则我们需要手动的添加 polyfills 来让支持某些语法；
	- 也就是说它是为 webpack 等打包工具服务的一个属性（这里不是详细讲解 webpack 等工具的工作原理，所以不再给出详情）

-----

npm 包版本管理规范是怎样的？

- npm的包通常需要遵从 semver （semantic version）版本规范：
	- semver：https://semver.org/lang/zh-CN/
	- npm semver：https://docs.npmjs.com/misc/semver
- semver 版本规范是 X.Y.Z：
	- X主版本号（major）：当你做了不兼容的 API 修改（可能不兼容之前的版本）；
	- Y次版本号（minor）：当你做了向下兼容的功能性新增（新功能增加，但是兼容之前的版本）；
	- Z修订号（patch）：当你做了向下兼容的问题修正（没有新功能，修复了之前版本的bug）；
-  ^ 和 ~ 的区别：
	- x.y.z：表示一个明确的版本号；
	- ^x.y.z：表示x是保持不变的，y和z永远安装最新的版本；
	- ~x.y.z：表示x和y保持不变的，z永远安装最新的版本；

-----

npm 包安装分2种情况，如何理解？

- 全局安装（global install）： 如：npm install webpack -g;
	- 全局安装是直接将某个包安装到全局；
	- 会被添加到 node 全局管理的一个目录，这个目录会添加到环境变量中，可以在命令行中全局使用该目录下的包。
	- 通常使用 npm 全局安装的包都是一些工具包：yarn、webpack 等；
	- 所以即使全局安装了像 axios 这样的依赖，也并不能在所有的项目中使用。
- 项目（局部）安装（local install）： 如：npm install webpack
	- 项目安装会在当前目录下生成一个 node_modules 文件夹

使用 npm 安装包的命令有哪些？

```shell
# 默认安装开发和生产依赖
npm install axios
npm i axios
# 开发依赖
npm install webpack --save-dev
npm install webpack -D
npm i webpack –D
# 根据 package.json 中的依赖包
npm install
```

-----

npm install 的原理是什么？分2种情况。

- npm install 会检测是有 package-lock.json 文件：
- 没有 lock 文件
	- 分析依赖关系，这是因为可能包会依赖其他的包，并且多个包之间会产生相同依赖的情况；
	- 从 registry 仓库中下载压缩包（如果我们设置了镜像，那么会从镜像服务器下载压缩包）；
	- 获取到压缩包后会对压缩包进行缓存（从 npm5 开始有的）；
	- 将压缩包解压到项目的 node_modules 文件夹中（前面我们讲过，require 的查找顺序会在该包下面查找）
- 有 lock 文件
	- 检测 lock 中包的版本是否和 package.json 中一致（会按照 semver 版本规范检测）；
		- 如不一致，那么会重新构建依赖关系，直接会走顶层的流程；
		- 一致的情况下，会去优先查找缓存：
			- 没有找到，会从 registry 仓库下载，直接走顶层流程；
			- 查找到，会获取缓存中的压缩文件，并且将压缩文件解压到 node_modules 文件夹中；

理解图解。

<img src="NodeAssets/npm install 的原理图.jpg" alt="npm install 的原理图" style="zoom:150%;" />

-----

package-lock.json 有哪些属性，分别有什么含义？

- name：项目的名称；
- version：项目的版本；
- lockfileVersion：lock文件的版本；
- requires：使用requires来跟踪模块的依赖关系；（默认用 dependencies 来记录）
- dependencies：项目的依赖
	- 当前项目依赖 axios，但是axios依赖follow-redireacts；
	- axios 中的属性如下：
		- version 表示实际安装的axios的版本；
		- resolved 用来记录下载的地址，registry仓库中的位置；
		- requires/dependencies 记录当前模块的依赖；
		- integrity 用来从缓存中获取索引，再通过索引去获取压缩包文件；

<img src="NodeAssets/package-lock.json 结构图.jpg" alt="package-lock.json 结构图" style="zoom:80%;" />

-----

npm 还有哪些其它常用命令？

```shell
# 卸载某个依赖包：
npm uninstall package
npm uninstall package --save-dev
npm uninstall package -D
# 强制重新 build，删除 package-lock.json 以及 node_modules，根据 package.json 重新下载包。
npm rebuild
# 清除缓存
npm cache clean
# 获取缓存目录的路径。
npm config get cache
```

-----

什么是 yarn 工具，它与 npm 命令对应的命令是什么？

- yarn 是由Facebook、Google、Exponent 和 Tilde 联合推出了一个新的 JS 包管理工具； 
- yarn 是为了弥补 早期 npm 的一些缺陷而出现的； 
- 早期的 npm 存在很多的缺陷，比如安装依赖速度很慢、版本依赖混乱等等一系列的问题；
- 虽然从 npm5 版本开始，进行了很多的升级和改进，但是依然很多人喜欢使用 yarn；

<img src="NodeAssets/yarn 与 npm 相对应的命令.jpg" alt="yarn 与 npm 相对应的命令" style="zoom:150%;" />

-----

什么是 cnpm 工具，它有什么用？

- 由于一些特殊的原因，某些情况下我们没办法很好的从 https://registry.npmjs.org下载下来一些需要的包。
```shell
# 查看npm镜像：
npm config get registry 
# 我们可以直接设置 npm 的镜像：
npm config set registry https://registry.npm.taobao.org
```
- 但是对于大多数人来说，并不希望将 npm 镜像修改： 
	1. 不太希望随意修改 npm 原本从官方下来包的渠道； 
	2. 担心某天淘宝的镜像挂了或者不维护了，又要改来改去；
- 这个时候，我们可以使用 cnpm，并且将 cnpm 设置为淘宝的镜像：
```shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm config get registry
```