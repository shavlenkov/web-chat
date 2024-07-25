<template>
    <li class="userList__item">
        <span :class="statusClass(item.status)" class="status-circle"></span>
        {{ item.nickname }} ({{ item.status }})
    </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { UserInterface } from '@/interfaces/user.interface'

export default defineComponent({
    name: 'UserItem',
    props: {
        item: {
            type: Object as PropType<{ nickname: string; status: string }>,
            required: true
        },
        statusClass: {
            type: Function as PropType<
                (status: UserInterface['status']) => string
            >,
            required: true
        }
    }
})
</script>

<style scoped>
.userList__item {
    padding: 5px 0;
    display: flex;
    align-items: center;
}

.status-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
}

.status-online {
    background-color: green;
}

.status-away {
    background-color: yellow;
}

.status-dnd {
    background-color: red;
}
</style>
