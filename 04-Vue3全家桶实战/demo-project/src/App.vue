<script setup>
import { ref } from 'vue';
import RoomArea from './components/RoomArea.vue';

const hightScore = ref({})
// 1.模拟网络请求获取数据
setTimeout(() => {
  import('./data/high_score.json').then(res => hightScore.value = res.default)
}, 1000);
</script>

<template>
  <div class="app">
    <RoomArea :areaData="hightScore" />
  </div>
</template>

<style scoped lang="less">
.app {
    width: 1032px;
    padding: 40px;
    margin: 0 auto;
  }
</style>
