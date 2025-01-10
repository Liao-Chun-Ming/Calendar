<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useEventStore } from '@/stores/index.js';
import Navbar from '@/components/NavBar.vue';
import FooterArea from '@/components/FooterArea.vue';

const eventsStore = useEventStore();
const getEvents = () => eventsStore.getEvents();

onMounted(() => {
  getEvents();
});
</script>

<template>
  <div class="w-full min-h-screen flex flex-col font-Inter">
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <FooterArea />
  </div>
</template>
