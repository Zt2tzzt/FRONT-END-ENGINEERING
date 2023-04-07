<script setup>
import AreaHeader from './AreaHeader.vue'
import Roomitem from './Roomitem.vue'

defineProps({
  areaData: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <section class="room-area">
    <!-- 1. 区域 header -->
    <AreaHeader :title="areaData.title" :subtitle="areaData.subtitle" />
    <!-- 2.房间列表 -->
    <ul class="room-list">
      <template v-for="item in areaData.list" :key="item.id">
        <Roomitem :itemData="item" />
      </template>
    </ul>
  </section>
</template>

<style scoped lang="less">
.room-list {
  display: flex;
  flex-wrap: wrap;
  margin: 20px -8px;
}
</style>
