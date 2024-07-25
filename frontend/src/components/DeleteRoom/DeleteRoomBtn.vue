<template>
    <button @click="deleteRoom" class="deleteRoomBtn">Delete Room</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'DeleteRoomBtn',
    props: {
        roomId: {
            type: String as PropType<string>,
            required: true
        }
    },
    setup(props) {
        const router = useRouter()

        const deleteRoom = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/delete-room?roomId=${props.roomId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        'Network response was not ok ' + response.statusText
                    )
                }

                router.push({ path: '/' })
            } catch (error) {
                console.error(
                    'There was a problem with the fetch operation:',
                    error
                )
            }
        }

        return { deleteRoom }
    }
})
</script>

<style scoped>
.deleteRoomBtn {
    position: absolute;
    left: 20px;
    bottom: 20px;
    background-color: #ff4d4d;
    color: white;
    border: 2px solid transparent;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 9px;
    transition:
        background-color 0.4s,
        color 0.4s,
        border-color 0.4s;
}

.deleteRoomBtn:hover {
    background-color: white;
    color: black;
    border-color: #ff4d4d;
}
</style>
