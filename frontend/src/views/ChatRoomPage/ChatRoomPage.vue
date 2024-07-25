<template>
    <div class="chatRoom">
        <MessageList :roomId="roomId" :messages="messages" />
        <div class="rightSide">
            <NicknameInput v-model="nickname" @change="changeNickname" />
            <StatusSelect v-model="status" @change="changeStatus" />
            <MessageInput v-model="message" @sendMessage="sendMessage" />
            <SendMessageBtn :message="message" @sendMessage="sendMessage" />
            <UserList :users="users" :statusClass="statusClass" />
        </div>
        <DeleteRoomBtn :roomId="roomId" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import io from 'socket.io-client'
import moment from 'moment'

import MessageList from '@/components/MessageList/MessageList.vue'
import NicknameInput from '@/components/NicknameInput/NicknameInput.vue'
import StatusSelect from '@/components/StatusSelect/StatusSelect.vue'
import MessageInput from '@/components/MessageInput/MessageInput.vue'
import UserList from '@/components/UserList/UserList.vue'
import SendMessageBtn from '@/components/SendMessageBtn/SendMessageBtn.vue'
import DeleteRoomBtn from '@/components/DeleteRoom/DeleteRoomBtn.vue'

import notificationSound from '@/assets/sounds/new_message.mp3'

import { MessageInterface } from '@/interfaces/message.interface'
import { UserInterface } from '@/interfaces/user.interface'

export default defineComponent({
    name: 'ChatRoomPage',
    components: {
        DeleteRoomBtn,
        SendMessageBtn,
        MessageList,
        NicknameInput,
        StatusSelect,
        MessageInput,
        UserList
    },
    setup() {
        const socket = ref<any>(null)
        const roomId = ref<string>('')
        const message = ref<string>('')
        const messages = ref<MessageInterface[]>([])
        const nickname = ref<string>('')
        const status = ref<string>('Online')
        const users = ref<UserInterface[]>([])
        const inactivityTimer = ref<any | null>(null)
        const lastMessageSentTime = ref<number>(0)

        const route = useRoute()

        const changeNickname = (newNickname: { target: { value: string } }) => {
            socket.value.emit(
                'set-nickname',
                newNickname.target.value,
                roomId.value
            )
        }

        const playNotificationSound = () => {
            const sound = new Audio(notificationSound)
            sound.play().catch(error => {
                console.error('Audio playback error:', error)
            })
        }

        const sendMessage = (messageText: string) => {
            const currentTime = Date.now()
            if (
                messageText &&
                currentTime - lastMessageSentTime.value >= 1000
            ) {
                socket.value.emit(
                    'chat-message',
                    {
                        text: messageText,
                        nickname:
                            nickname.value === ''
                                ? 'anonymous'
                                : nickname.value,
                        date: moment().format('HH:mm')
                    },
                    roomId.value
                )
                message.value = ''
                lastMessageSentTime.value = currentTime
            }
        }

        const changeStatus = () => {
            socket.value.emit('change-status', status.value)
        }

        const statusClass = (statusValue: string) => {
            switch (statusValue) {
                case 'Online':
                    return 'status-online'
                case 'Away':
                    return 'status-away'
                case 'Do Not Disturb':
                    return 'status-dnd'
                default:
                    return ''
            }
        }

        const startInactivityTimer = () => {
            inactivityTimer.value = setTimeout(() => {
                status.value = 'Away'
                changeStatus()
            }, 60000)
        }

        const resetInactivityTimer = () => {
            if (inactivityTimer.value) {
                clearTimeout(inactivityTimer.value)
            }
            startInactivityTimer()
            if (status.value === 'Away') {
                status.value = 'Online'
                changeStatus()
            }
        }

        onMounted(() => {
            socket.value = io('http://localhost:3000')
            roomId.value = route.params.id as string
            socket.value.emit(
                'join-room',
                roomId.value,
                nickname.value === '' ? 'anonymous' : nickname.value
            )

            socket.value.on('chat-message', (msg: MessageInterface) => {
                messages.value.push(msg)
                if (status.value !== 'Do Not Disturb') {
                    playNotificationSound()
                }
            })

            socket.value.emit('list-messages')

            socket.value.on('list-messages', (msgs: MessageInterface[]) => {
                messages.value = msgs
            })

            socket.value.on('user-list', (userList: UserInterface[]) => {
                users.value = userList
            })

            socket.value.on('room-id', (roomId_value: string) => {
                roomId.value = roomId_value
            })

            startInactivityTimer()

            window.addEventListener('mousemove', resetInactivityTimer)
            window.addEventListener('keydown', resetInactivityTimer)
        })

        onUnmounted(() => {
            if (socket.value) {
                socket.value.disconnect()
            }
            window.removeEventListener('mousemove', resetInactivityTimer)
            window.removeEventListener('keydown', resetInactivityTimer)
        })

        return {
            socket,
            roomId,
            message,
            messages,
            nickname,
            status,
            users,
            inactivityTimer,
            lastMessageSentTime,
            changeNickname,
            playNotificationSound,
            sendMessage,
            changeStatus,
            statusClass,
            startInactivityTimer,
            resetInactivityTimer
        }
    }
})
</script>

<style scoped>
.chatRoom {
    display: flex;
    height: 100vh;
}

.rightSide {
    padding: 20px;
    background-color: #fff;
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

@media (max-width: 1300px) {
    .chatRoom {
        flex-direction: column;
    }
}
</style>
