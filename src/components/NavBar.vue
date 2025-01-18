<script setup>
import { ref, onMounted } from 'vue';
import lottie from 'lottie-web';

const iconRef = ref(null);

function loadAnimation(iconRef) {
  lottie.loadAnimation({
    container: iconRef.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'calendar.json'
  });
}

onMounted(() => {
  loadAnimation(iconRef);
});
</script>

<template>
  <nav>
    <div class="bg-white flex items-center justify-center flex-col sm:flex-row">
      <div ref="iconRef" class="w-20 bg-transparent"></div>
      <h1 class="text-5xl font-BugeeTint">Calendar</h1>
    </div>
  </nav>
</template>
