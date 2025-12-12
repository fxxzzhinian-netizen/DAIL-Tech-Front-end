<template>
  <div class="home-page">
    <Main />
    <Second />
    <Third />
    <End />
  </div>
</template>

<script setup>
import Main from './Main.vue'
import Second from './Second.vue'
import Third from './Third.vue'
import End from './End.vue'
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
}
</style>

