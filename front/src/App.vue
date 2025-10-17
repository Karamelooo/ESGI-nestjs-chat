<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <AppHeader />
    <RouterView />
    <footer class="border-t border-border py-8">
      <div class="mx-auto max-w-6xl px-4 text-sm text-muted-foreground flex items-center justify-between">
        <span>© {{ new Date().getFullYear() }} ChatLine</span>
        <div class="flex gap-4">
          <RouterLink to="/privacy" class="hover:text-foreground">Confidentialité</RouterLink>
          <RouterLink to="/terms" class="hover:text-foreground">Conditions</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>
