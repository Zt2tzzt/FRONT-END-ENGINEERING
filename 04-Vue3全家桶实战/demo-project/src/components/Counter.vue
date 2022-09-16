<script>
import { ref } from 'vue'
  export default {
    setup() {
      // ref 函数: 定义简单类型的数据(也可以定义复杂类型的数据)，为 counter 定义响应式数据
      const counter = ref(0)
      function increment() {
        counter.value++
      }
      // 将 ref 对象，放入到对象中，在 template 中使用时，最初是浅层解包，现已可以做到不完全的深层解包（见 template）。
      const info = { counter }
      return {
        counter,
        increment,
        info
      }
    }
  }
</script>

<template>
	<div>
    <!-- 默认情况下在 template 中使用 ref 时, vue 会自动对其进行解包(取出其中 value) -->
    <h2>当前计数: {{ counter }}</h2>
    <button @click="increment">+1</button>
    <button @click="counter++">+1</button>
    <!-- 不完全的深层解包 -->
    <h2>当前计数: {{ info.counter }}</h2><!-- 使用的时候不需要写.value -->
    <button @click="info.counter.value++">+1</button><!-- 修改的时候需要写.value（很少这么用） -->
  </div>
</template>

<style scoped>

</style>