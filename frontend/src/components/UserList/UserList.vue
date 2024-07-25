<template>
    <div class="userList">
        <h3 class="userList__title">Connected Users</h3>
        <ul class="userList__items">
            <UserItem
                :item="user"
                :statusClass="statusClass"
                v-for="(user, index) in users"
                :key="index"
            />
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import UserItem from '@/components/UserItem/UserItem.vue'

import { UserInterface } from '@/interfaces/user.interface'

export default defineComponent({
    name: 'UserList',
    components: { UserItem },
    props: {
        users: {
            type: Array as PropType<UserInterface[]>,
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
.userList {
    position: absolute;
    bottom: 150px;
    width: 600px;
    height: 150px;
    margin-top: 10px;
    padding-top: 10px;
    overflow-x: auto;
}

.userList__title {
    margin: 0 0 10px 0;
}

.userList__items {
    list-style: none;
    padding: 0;
}
</style>
