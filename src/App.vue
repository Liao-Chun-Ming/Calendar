<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useEventStore } from '@/stores/index.js'

const eventsStore = useEventStore()
const getEvents = () => eventsStore.getEvents()

onMounted(() => {
  getEvents()
})
</script>

<template>
  <RouterView />
</template>
