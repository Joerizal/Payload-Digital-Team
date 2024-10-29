import MainLayout from '@/layouts/MainLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import PostList from '@/components/PostList.vue'
import CreatePage from '@/components/CreatePage.vue'

// Define the routes
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '', // Default child route of MainLayout for '/'
        name: 'Home', // This can be the main "home" route, loading PostList
        component: PostList,
        meta: { requireAuth: false },
      },
    ],
  },
  {
    path: '/post',
    name: 'PostList',
    component: PostList,
  },
  {
    path: '/create-page',
    name: 'CreatePage', // Name for the CreatePage component
    component: CreatePage,
  },
]

// Create the router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
