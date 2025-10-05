import { createRouter, createWebHistory } from 'vue-router'


import Layout from '@/layout/index.vue'


// 公开的路由
export const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  }
]

// 私有的路由
export const privateRoutes = [
  {
    path: '/news',
    component: Layout,
    redirect: '/news/dashboard',
    meta: { title: '首页', icon: 'wallet' },
    children: [
      {
        path: '/news/dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '大盘', icon: 'user' }
      },
      {
        path: '/news/user',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户', icon: 'user' }
      }
    ]
  },
  {
    path: '/summer',
    component: Layout,
    redirect: '/summer/summer',
    meta: { title: '凭证处理', icon: 'more' },
    children: [
      {
        path: '/summer/summer',
        component: () => import('@/views/summer/index.vue'),
        meta: { title: '凭证', icon: 'game' }
      },
      {
        path: '/summer/user',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户', icon: 'document' }
      }
    ]
  }
]

// 初始化路由只有公开路由
const create = () => createRouter({
  history: createWebHistory(),
  routes: publicRoutes
})

const router = create()

// 退出登陆 之后 重置路由
export function resetRouter() {
  const newRouter = create()
  router.matcher = newRouter.matcher
}

export default router
