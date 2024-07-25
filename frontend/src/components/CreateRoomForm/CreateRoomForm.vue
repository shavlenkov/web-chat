<template>
    <div class="createRoom">
        <form class="createRoom__form" @submit.prevent="createRoom">
            <button class="createRoom__form-submit" type="submit">
                Create Room
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'CreateRoomForm',
    setup() {
        const router = useRouter()

        const createRoom = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3000/create-room'
                )
                const data = await response.json()

                if (response.ok) {
                    router.push({
                        path: `/room/${data.roomId}`
                    })
                }
            } catch (error) {
                console.error('Error creating room:', error)
                alert('Error creating room: ' + (error as Error).message)
            }
        }

        return { createRoom }
    }
})
</script>

<style scoped>
.createRoom__form-submit {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.createRoom__form-submit:hover {
    background-color: #45a049;
}
</style>
