import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue';
import Welcome from '../components/Welcome.vue';
Vue.use(VueRouter)

const routes = [{
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      name: 'Welcome',
      component: Welcome
    }, ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router