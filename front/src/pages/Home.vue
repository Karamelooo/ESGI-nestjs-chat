<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
      <div class="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
            Discutez en temps réel avec une interface moderne
          </h1>
          <p class="mt-4 text-muted-foreground">
            ChatLine est une application de chat rapide, sûre et élégante, conçue avec les composants et les tokens shadcn.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <RouterLink to="/register">
              <button class="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:opacity-90">Commencer à discuter</button>
            </RouterLink>
            <RouterLink to="/features" class="h-10 inline-flex items-center rounded-md border border-input bg-transparent px-5 text-sm hover:bg-accent hover:text-accent-foreground">
              En savoir plus
            </RouterLink>
          </div>
          <div class="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <div class="flex items-center gap-2">
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-green-500"></span>
              <span>En ligne: 1 284</span>
            </div>
            <div>Chiffrement des messages • Groupes • Pièces jointes</div>
          </div>
        </div>
        <div class="order-first md:order-none">
          <!-- Carte d'aperçu du chat -->
          <div id="preview" class="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div class="flex items-center justify-between border-b border-border px-4 py-2">
              <div class="font-medium">Canal #général</div>
              <div class="text-xs text-muted-foreground">42 en ligne</div>
            </div>
            <div class="p-4 bg-muted/40">
              <div class="space-y-3 max-h-80 overflow-auto pr-2">
                <div class="flex items-start gap-3">
                  <div class="h-8 w-8 rounded-full bg-secondary"></div>
                  <div>
                    <div class="text-sm font-medium">Alicia</div>
                    <div class="text-sm text-muted-foreground">Salut tout le monde 👋</div>
                  </div>
                </div>
                <div class="flex items-start gap-3 justify-end">
                  <div>
                    <div class="text-right text-sm font-medium">Moi</div>
                    <div class="inline-block rounded-md bg-primary/10 px-3 py-2 text-sm">Hello ! Hâte de tester ChatLine.</div>
                  </div>
                  <div class="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px]">ME</div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="h-8 w-8 rounded-full bg-secondary"></div>
                  <div>
                    <div class="text-sm font-medium">Samir</div>
                    <div class="text-sm text-muted-foreground">Les pièces jointes fonctionnent-elles ?</div>
                  </div>
                </div>
                <div class="flex items-start gap-3 justify-end">
                  <div>
                    <div class="text-right text-sm font-medium">Moi</div>
                    <div class="inline-block rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow">Oui, images et fichiers ✅</div>
                  </div>
                  <div class="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px]">ME</div>
                </div>
              </div>
              <div class="mt-4 flex items-center gap-2">
                <input
                  class="flex-1 rounded-md border border-input bg-background px-3 h-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Écrire un message..."
                />
                <button class="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground shadow hover:opacity-90">Envoyer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="mx-auto max-w-6xl px-4 pb-16">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div class="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">💬</div>
          <h3 class="font-semibold">Messages en temps réel</h3>
          <p class="mt-1 text-sm text-muted-foreground">Synchronisation instantanée sur tous vos appareils.</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div class="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">🛡️</div>
          <h3 class="font-semibold">Sécurisé et fiable</h3>
          <p class="mt-1 text-sm text-muted-foreground">Chiffrement côté client et sauvegardes automatiques.</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div class="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">🎨</div>
          <h3 class="font-semibold">Design sobre</h3>
          <p class="mt-1 text-sm text-muted-foreground">UI épurée basée sur les tokens shadcn.</p>
        </div>
      </div>
    </section>

    <!-- FAQ / CTA -->
    <section id="faq" class="mx-auto max-w-6xl px-4 pb-20">
      <div class="rounded-lg border border-border p-6 md:p-10 text-center bg-card">
        <h2 class="text-2xl font-bold tracking-tight">Prêt à rejoindre la conversation ?</h2>
        <p class="mt-2 text-muted-foreground">Créez votre compte en quelques secondes et commencez à discuter.</p>
        <div class="mt-6 flex items-center justify-center gap-3">
          <RouterLink to="/register">
            <button class="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:opacity-90">Créer un compte</button>
          </RouterLink>
          <RouterLink to="/features" class="h-10 inline-flex items-center rounded-md border border-input bg-transparent px-5 text-sm hover:bg-accent hover:text-accent-foreground">
            En savoir plus
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page d'accueil
</script>

