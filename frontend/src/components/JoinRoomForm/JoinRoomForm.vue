<template>
    <div class="joinRoom">
        <form class="joinRoom__form" @submit.prevent="joinRoom">
            <input
                class="joinRoom__form-input"
                v-model="roomId"
                placeholder="Enter Room ID"
            />
            <button class="joinRoom__form-submit" type="submit">
                Join Room
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'JoinRoomForm',
    setup() {
        const router = useRouter()
        const roomId = ref<string>('')

        const joinRoom = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/check-room?roomId=${roomId.value}`
                )
                const data = await response.json()

                data.has
                    ? await router.push(`/room/${roomId.value}`)
                    : alert('Room is not found')
            } catch (error) {
                console.error('Error checking room:', error)
                alert('An error occurred while checking the room')
            }
        }

        return { roomId, joinRoom }
    }
})
</script>

<style scoped>
input {
    width: 300px;
    padding: 10px;
    margin-top: 10px;
    margin-right: 2px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
button {
    width: 321px;
    padding: 10px;
    margin-top: 10px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:hover {
    background-color: #0b7dda;
}
</style>
