import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/users/Users.vue';
import roles from '../components/rules/roles.vue';
import rights from '../components/rules/rights.vue';
import goods from '../components/goods/goods.vue';
import params from '../components/goods/params.vue';
import orders from '../components/orders/orders.vue';
import reports from '../components/data/reports.vue';
import categories from '../components/goods/categories.vue';


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
    },{
      path: '/users',
      name: 'Users',
      component: Users 
    }, {
      path: '/roles',
      name: 'roles',
      component: roles 
    }, {
      path: '/rights',
      name: 'rights',
      component: rights 
    }, {
      path: '/goods',
      name: 'goods',
      component: goods 
    },{
      path: '/params',
      name: 'params',
      component: params 
    },{
      path: '/categories',
      name: 'categories',
      component: categories 
    },{
      path: '/orders',
      name: 'orders',
      component: orders 
    },{
      path: '/reports',
      name: 'reports',
      component: reports 
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
  const tokenStr = window.localStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router