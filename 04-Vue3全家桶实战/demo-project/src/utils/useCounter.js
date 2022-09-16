import { ref } from 'vue'
export default function useCounter() {
  // 定义 counter 默认不是响应式数据，需要使用 ref 将它变为响应式数据，方便在 tenplate 中使用。
  let counter = ref(100)
  const increment = () => counter.value++
  const decrement = () => counter.value--
  return { counter, increment, decrement }
}