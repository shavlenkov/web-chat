<template>
    <div>
        <button class="sendMessageBtn" @click="sendMessage">Send</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'SendMessageBtn',
    props: {
        message: {
            type: String as PropType<string>,
            required: true
        }
    },
    methods: {
        sendMessage() {
            this.$emit('sendMessage', this.message)
        }
    }
})
</script>

<style scoped>
.sendMessageBtn {
    background-color: #4caf50;
    border: 2px solid transparent;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    transition-duration: 0.4s;
    box-sizing: border-box;
}

.sendMessageBtn:hover {
    background-color: white;
    color: black;
    border-color: #4caf50;
}
</style>
