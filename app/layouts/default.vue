<template>
  <div class="min-h-screen flex flex-col font-sans">
    <Header />
    <div class="flex-1">
      <slot></slot>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup></script>
