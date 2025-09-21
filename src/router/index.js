import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

// 固定路由，不需要权限
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/documentation/index'),
        name: '文档',
        meta: { title: '文档', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }
]

// 动态路由
export const asyncRoutes = [
  {
    path: '/tool',
    component: Layout,
    // redirect: '/student/list',
    alwaysShow: true, // will always show the root menu
    name: '实用工具',
    meta: {
      title: '实用工具',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/tool/list'),
        name: 'ToolList',
        meta: {
          title: '工具001',
          icon: 'edit',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'info',
        component: () => import('@/views/tool/info'),
        name: 'ToolInfo',
        meta: {
          title: '工具002'
        }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/api',
    alwaysShow: true, // will always show the root menu
    name: '设置',
    meta: {
      title: '设置',
      icon: 'el-icon-setting',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'api',
        component: () => import('@/views/settings/api'),
        name: 'SettingApi',
        meta: {
          title: '接口设置',
          icon: 'el-icon-sunny',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'parameter',
        component: () => import('@/views/settings/parameter'),
        name: 'SettingParameter',
        meta: {
          title: '参数设置',
          icon: 'el-icon-sugar'
        }
      },
      {
        path: 'user',
        component: () => import('@/views/settings/user'),
        name: 'SettingUser',
        meta: {
          title: '用户管理',
          icon: 'el-icon-sunny'
        }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/case',
    alwaysShow: true, // will always show the root menu
    name: '任务',
    meta: {
      title: '任务',
      icon: 'el-icon-wind-power',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'case',
        component: () => import('@/views/task/case'),
        name: 'TaskCase',
        meta: {
          title: '用例信息',
          icon: 'el-icon-crop',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'history',
        component: () => import('@/views/task/history'),
        name: 'TaskHistory',
        meta: {
          title: '执行记录',
          icon: 'el-icon-monitor'
        }
      },
      {
        path: 'report',
        component: () => import('@/views/task/report'),
        name: 'TaskReport',
        meta: {
          title: '执行报告',
          icon: 'el-icon-tickets'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
