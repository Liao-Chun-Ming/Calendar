<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/NavBar.vue';
import FooterArea from '@/components/FooterArea.vue';
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
