import { defineStore } from 'pinia'
import { publicRoutes, privateRoutes, resetRouter } from '@/router/index.js'
import { getToken, setToken, removeToken } from '@/utils/auth.js'

/**
 * 判断当前用户是否有权限访问该路由
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * 过滤私有路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })
    return res
}

/**
 * 深度提取路由信息，只保留 path/meta/children
 * @param {Array} routes 路由数组
 * @returns {Array} 纯数据路由
 */
function extractRouteData(routes = []) {
  return routes.map(route => {
    const { path, meta, children } = route
    return {
      path,
      meta,
      children: children ? extractRouteData(children) : []
    }
  })
}


const useUserStore = defineStore('user', {
    state: () => ({
        name: '',
        token: getToken() || '',
        avatar: '',
        introduction: '',
        roles: [],

        routes: [],
    }),
    actions: {
        login(UserInfo) {
            const { username, password } = UserInfo
            // 直接使用静态数据模拟登录
            return new Promise((resolve, reject) => {
                if (username === 'admin' && password === 'admin') {
                    this.token = 'admin-token'
                    // 将 token 存储到 Cookies 中
                    setToken(this.token)
                    resolve()
                } else {
                    reject('账号或密码错误')
                }
            })
        },

        getInfo() {
            return new Promise((resolve, reject) => {
                console.log('token', this.token)
                if (this.token === 'admin-token') {
                    this.roles = ['admin']
                    this.name = 'Admin'
                    this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
                    this.introduction = 'I am a super administrator'
                    resolve()
                } else {
                    reject('验证失败，请重新登录。')
                }
            })
        },

        logout() {
            return new Promise((resolve) => {
                this.name = ''
                this.token = null
                this.roles = []
                this.routes = []

                removeToken() // 移除 Cookies 中的 token
                resetRouter() // 重置路由

                resolve()
            })
        },

        generateRoutes() {
            let accessedRoutes
            if (this.roles.includes('admin')) {
                accessedRoutes = privateRoutes || []
            } else {
                accessedRoutes = filterAsyncRoutes(privateRoutes, roles)
            }
            accessedRoutes = publicRoutes.concat(accessedRoutes)
            // 去掉路由中的多余信息，只保留 path/meta/children
            this.routes = extractRouteData(accessedRoutes)
            return accessedRoutes
        }
    },
})

export { useUserStore };