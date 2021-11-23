import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: () => import(/* webpackChunkName: "transfers" */ '../views/Transfers.vue'),
  },
  {
    path: '/tokens',
    name: 'Tokens',
    component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
  },
  {
    path: '/network',
    name: 'NetWork',
    component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
  },
  {
    path: '/channels',
    name: 'Channels',
    component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
  },
  {
    path: '/relayers',
    name: 'Relayers',
    component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
