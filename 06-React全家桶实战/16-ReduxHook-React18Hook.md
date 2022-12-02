# Redux Hook


在之前的 redux 开发中，为了让组件和 redux 结合起来，我们使用了 react-redux 中的 `connect`：
- 但是这种方式必须使用高阶函数结合返回的高阶组件；
- 并且必须编写：mapStateToProps 和 mapDispatchToProps 映射的函数；

在 Redux7.1 开始，提供了 Hook 的方式，我们再也不需要编写 connect 以及对应的映射函数了。

useSelector 的作用是将 state 映射到组件中： 
- 参数一：将 state 映射到需要的数据中； 
- 参数二：可以进行比较来决定是否组件重新渲染；（后续讲解）

useSelector 默认会比较我们返回的两个对象是否相等； 
- 如何比较呢？ const refEquality = (a, b) => a === b； 
- 也就是我们必须返回两个完全相等的对象才可以不引起重新渲染；

useDispatch非常简单，就是直接获取dispatch函数，之后在组件中直接使用即可；

我们还可以通过useStore来获取当前的store对象；

* 计数器案例对比 react-redux 的普通用法和 Hook 用法。
* 案例理解，useSelector 进行浅层比较重要性
* 了解服务端渲染的概念。
	- 单页面富应用存在的2个问题（SSR 的2个优势）。
		原因：浏览器的渲染流程：根据 url -> 请求服务器页面 index.html；造成一个问题：SPA 项目中的 index.html，通常没有实质的内容。
		造成问题：
		1.需要下载打包后的 js 文件（如 bundle.js），再执行 JS 文件，发送网络请求，获取页面相关数据，再重新渲染，造成首屏速度慢的问题；
		2.搜索引擎的爬虫，通常只爬取一个网站的 index.hml 中的内容，存入到数据库中。而 SPA 项目的 index.html 通常没有实质内容，在成搜索引擎排名靠后
	- 什么是 SSR？
	- 什么是 SSR 同构应用？
	- 什么是 Hydration？
* useId 的使用。
* useTransition 的使用。
	- 使用 faker 库伪造数据。
* useDeferredValue 的使用。		

