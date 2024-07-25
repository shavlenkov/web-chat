import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import IndexPage from '@/views/IndexPage/IndexPage.vue'
import ChatRoomPage from '@/views/ChatRoomPage/ChatRoomPage.vue'

const routes: Array<RouteRecordRaw> = [
    { path: '/', component: IndexPage },
    { path: '/room/:id', component: ChatRoomPage }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
