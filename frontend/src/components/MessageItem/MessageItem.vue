<template>
    <div class="message">
        <div>
            <strong>{{ msg.nickname }}</strong
            >: {{ msg.text }}
        </div>
        <span class="timestamp">{{ msg.date }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { MessageInterface } from '@/interfaces/message.interface'

export default defineComponent({
    name: 'MessageItem',
    props: {
        msg: {
            type: Object as PropType<MessageInterface>,
            required: true
        }
    }
})
</script>

<style scoped>
.message {
    display: flex;
    justify-content: space-between;
    width: 600px;
    margin-bottom: 10px;
    padding: 20px;
    border-radius: 5px;
    background-color: #e0e0e0;
    text-align: left;
}

.timestamp {
    display: block;
    font-size: 0.8em;
    color: #888;
}
</style>
