<template>
    <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="sendMessage"
        placeholder="Type a message"
        class="message-input"
    />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'MessageInput',
    props: {
        modelValue: {
            type: String as PropType<string>,
            default: ''
        }
    },
    emits: ['update:modelValue', 'sendMessage'],
    methods: {
        sendMessage() {
            this.$emit('sendMessage', this.modelValue)
        }
    }
})
</script>

<style scoped>
.message-input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}
</style>
