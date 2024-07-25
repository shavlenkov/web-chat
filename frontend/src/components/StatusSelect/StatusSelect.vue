<template>
    <select :value="modelValue" @change="handleChange" class="statusSelect">
        <option value="Online">Online</option>
        <option value="Do Not Disturb">Do Not Disturb</option>
        <option value="Away">Away</option>
    </select>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'StatusSelect',
    props: {
        modelValue: {
            type: String as PropType<string>,
            required: true
        }
    },
    emits: ['update:modelValue', 'change'],
    methods: {
        handleChange(event: Event) {
            const target = event.target as HTMLSelectElement
            const selectedValue = target.value
            this.$emit('update:modelValue', selectedValue)
            this.$emit('change')
        }
    }
})
</script>

<style scoped>
.statusSelect {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}
</style>
