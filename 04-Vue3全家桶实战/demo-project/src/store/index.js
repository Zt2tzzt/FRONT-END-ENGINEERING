import { createStore } from 'vuex'
const store = createStore({
  state: () => ({
    rootCounter: 100
  }),
  mutations: {
    increment(state) {
      state.rootCounter++
    },
    decrement(state) {
      state.rootCounter--
    }
  }
})
export default store
