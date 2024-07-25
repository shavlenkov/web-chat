<template>
    <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="Change your nickname"
        class="nicknameInput"
    />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'NicknameInput',
    props: {
        modelValue: {
            type: String as PropType<string>,
            default: ''
        }
    }
})
</script>

<style scoped>
.nicknameInput {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}
</style>
