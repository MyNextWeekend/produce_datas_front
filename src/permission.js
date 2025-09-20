import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面的title
  document.title = getPageTitle(to.meta.title)

  // 从 Cookies 获取用户的token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果用户已登录，重定向到主页
      console.log('已经有token了,跳转到首页')
      next({ path: '/documentation' })
      NProgress.done()
    } else {
      // 确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户的角色 such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // 基于角色生成可访菜单
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加路由
          router.addRoutes(accessRoutes)

          // hack方法确保addRoutes完整
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 路由 在白名单的 直接放行
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面。
      console.log('没有token,跳转到登录页')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
