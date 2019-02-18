import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/Users'

Vue.use(Router);

var router = new Router({
  routes: [
    { path: '/', redirect: '/welcome' },
    { path: '/login', component: Login },
    { path: '/home', component: Home, redirect: '/welcome', children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
      ]}
  ]
});

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next();
  }
  // 如果访问的路径不是则查看是否携带有token值，若没有则返回登录页
  var token = window.sessionStorage.getItem('token');
  if (!token) {
    return next('/login');
  }
  next();
});

export default router;
