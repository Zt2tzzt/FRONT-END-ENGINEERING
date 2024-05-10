# Vue3 Tips

Vue3 中，加载图片的方法

静态加载图片：

```vue
<script setup>
import logo from './assets/logo.png'
<script>

<template>
<img :src="logo" alt="logo" />
<template>
```

动态加载图片：

```vue
<script setup>
  const url = 'logo.png'
  const getAssetsMenuFile = (url: string) =>
    new URL(`../assets/images/menu/${url}`, import.meta.url).href
<script>

<template>
<img :src="getAssetsMenuFile(url)" alt="logo" />
<template>
```
