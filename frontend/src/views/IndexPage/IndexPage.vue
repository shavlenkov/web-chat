<template>
    <div class="createRoomContainer">
        <div class="createRoomContainer__leftSide">
            <CreateRoomForm />
        </div>
        <div class="createRoomContainer__middleSide">
            <div class="title"><h2>Web Chat</h2></div>
            <div class="divider"></div>
        </div>
        <div class="createRoomContainer__rightSide">
            <JoinRoomForm />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import CreateRoomForm from '@/components/CreateRoomForm/CreateRoomForm.vue'
import JoinRoomForm from '@/components/JoinRoomForm/JoinRoomForm.vue'

export default defineComponent({
    name: 'IndexPage',
    components: {
        CreateRoomForm,
        JoinRoomForm
    }
})
</script>

<style scoped>
.createRoomContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.createRoomContainer__leftSide,
.createRoomContainer__rightSide {
    width: 45%;
}

.createRoomContainer__middleSide {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 10%;
}

.title {
    width: 140px;
    font-size: 20px;
    margin: 0;
}

.divider {
    width: 1px;
    height: 190px;
    background-color: #ccc;
    margin-top: 10px;
}
</style>
