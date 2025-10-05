<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Item from './Item.vue'

// 接收父组件传来的 props
defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const router = useRouter()

// 当前激活菜单
const activePath = computed(() => route.path)

// 点击菜单跳转
function handleClick(path) {
  router.push(path)
}
</script>

<template>
  <!-- 如果有子菜单就渲染 el-sub-menu -->
  <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
    <template #title>
      <item v-if="item.meta?.title" :icon="item.meta?.icon" :title="item.meta?.title"></item>
    </template>
    <sidebar-item v-for="child in item.children" :key="child.path" :item="child"></sidebar-item>
  </el-sub-menu>

  <!-- 没有子菜单就渲染 el-menu-item -->
  <el-menu-item v-else-if="item.meta?.title" :index="item.path" @click="handleClick(item.path)"
    :class="{ 'is-active': activePath.value === item.path }">
    <item v-if="item.meta?.title" :icon="item.meta?.icon" :title="item.meta?.title"></item>
  </el-menu-item>
</template>
