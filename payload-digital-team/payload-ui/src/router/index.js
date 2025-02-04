import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import PostList from '@/components/PostList.vue'
import CreatePage from '@/components/CreatePage.vue'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import LoginLayout from '@/layouts/LoginLayout.vue'

const routes = [
  {
    path: '/',
    component: LoginLayout,
    children: [
      {
        path: '', // Default child route
        name: 'Login',
        component: LoginPage,
      },
      {
        path: 'pages/:id',
        name: 'PostList',
        component: PostList,
        props: true,
      },
      {
        path: 'create-page',
        name: 'CreatePage',
        component: CreatePage,
      },
    ],
  },
  {
    path: '/dashboard',
    component: MainLayout,
    redirect: '/dashboard/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: HomePage,
      },
      {
        path: 'pages/:id',
        name: 'PostList',
        component: PostList,
        props: true,
      },
      {
        path: 'create-page',
        name: 'CreatePage',
        component: CreatePage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// Add navigation guard for debugging
router.beforeEach((to, from, next) => {
  console.log('Navigation to:', to.fullPath)
  console.log('Params:', to.params)
  next()
})

export default router
