<template>
    <div class="messages">
        <h1>Chat Room: {{ roomId }}</h1>
        <MessageItem v-for="(msg, index) in messages" :key="index" :msg="msg" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { MessageInterface } from '@/interfaces/message.interface'

import MessageItem from '../MessageItem/MessageItem.vue'

export default defineComponent({
    name: 'MessageList',
    components: {
        MessageItem
    },
    props: {
        messages: {
            type: Array as PropType<MessageInterface[]>,
            required: true
        },
        roomId: {
            type: String as PropType<string>,
            required: true
        }
    }
})
</script>

<style scoped>
.messages {
    flex: 1;
    padding: 20px;
    border-right: 1px solid #ccc;
    overflow-y: auto;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
