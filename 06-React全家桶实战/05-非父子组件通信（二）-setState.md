* 非父子组件通信，EventBus
* Vue 和 React 数据管理和渲染流程的对比。
* 为什么 rEact 中要使用 setState？
	- setState 源码位置 packages/react/src/ReactBaseClasses.js
* setState 的3种用法。
* setState 为什么要设计成异步的（react18 之后，所有情况都是异步调用。
* 验证 setState 是异步的，且 render 只执行了一次。
* 验证 setState 的合并过程。
* setState 一定是异步的吗？
	- React18 后是的。
	- React18 前，分不同情况。
* 如何手动的将 setState 改为同步的。	
