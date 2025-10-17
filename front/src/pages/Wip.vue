<template>
  <div class="min-h-screen bg-background text-foreground grid place-items-center px-4 py-10">
    <div class="w-full max-w-md rounded-lg border border-border bg-card text-card-foreground shadow-sm p-8 text-center">
      <div class="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">🛠️</div>
      <h1 class="text-2xl font-bold tracking-tight">Travaux en cours</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        Cette page est en cours de construction. Revenez bientôt !
      </p>
      <div class="mt-6 flex items-center justify-center gap-3">
        <RouterLink
          to="/"
          class="h-10 inline-flex items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
        >Retour à l’accueil</RouterLink>
        <RouterLink
          to="/login"
          class="h-10 inline-flex items-center rounded-md border border-input bg-transparent px-5 text-sm hover:bg-accent hover:text-accent-foreground"
        >Se connecter</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page WIP (Work In Progress)
</script>

