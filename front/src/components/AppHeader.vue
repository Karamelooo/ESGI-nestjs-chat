<template>
  <header class="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border">
    <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <RouterLink to="/">
        <div class="flex items-center gap-2">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">C</span>
          <span class="font-semibold tracking-tight">ChatLine</span>
        </div>
      </RouterLink>
      <nav class="hidden sm:flex items-center gap-2">
        <RouterLink to="/features" class="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
          Fonctionnalités
        </RouterLink>
        <RouterLink to="/preview" class="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
          Aperçu
        </RouterLink>
        <RouterLink to="/faq" class="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
          FAQ
        </RouterLink>
      </nav>
      <div class="flex items-center gap-2">
        <RouterLink to="/login">
          <button class="h-9 rounded-md border border-input bg-transparent px-4 text-sm hover:bg-accent hover:text-accent-foreground">
            Se connecter
          </button>
        </RouterLink>
        <RouterLink to="/register">
          <button class="h-9 rounded-md bg-primary px-4 text-sm text-primary-foreground shadow hover:opacity-90">
            Créer un compte
          </button>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

