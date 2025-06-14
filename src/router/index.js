import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'


// 固定路由，不需要权限
export const constantRoutes = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path(.*)',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: '文档',
        meta: { title: '文档', icon: 'documentation', affix: true }
      }
    ]
  }
]

// 动态路由
export const asyncRoutes = [
  {
    path: '/student',
    component: Layout,
    redirect: '/student/list',
    alwaysShow: true, // will always show the root menu
    name: '学生',
    meta: {
      title: '学生',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/student/list'),
        name: 'StudentList',
        meta: {
          title: '学生列表',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'info',
        component: () => import('@/views/student/info'),
        name: 'StudentInfo',
        meta: {
          title: '学生详情'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
