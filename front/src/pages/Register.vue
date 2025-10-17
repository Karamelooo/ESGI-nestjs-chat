<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const agree = ref(false)
const loading = ref(false)
const error = ref('')

const onSubmit = async () => {
  error.value = ''
  if (!agree.value) {
    error.value = "Vous devez accepter les conditions."
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  loading.value = true
  try {
    // TODO: Appeler l’API d’inscription ici
    await new Promise((r) => setTimeout(r, 800))
    // Redirection vers la page de connexion
    router.push('/login')
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground grid place-items-center px-4 py-10">
    <div class="w-full max-w-md rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div class="px-6 pt-6">
        <h1 class="text-2xl font-bold tracking-tight">Créer un compte</h1>
        <p class="mt-1 text-sm text-muted-foreground">Rejoignez ChatLine en quelques secondes.</p>
      </div>
      <form class="px-6 pb-6 pt-4 space-y-4" @submit.prevent="onSubmit">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Nom</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            autocomplete="name"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Votre nom"
          />
        </div>
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="vous@exemple.com"
          />
        </div>
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="••••••••"
          />
        </div>
        <div class="space-y-2">
          <label for="confirm" class="text-sm font-medium">Confirmer le mot de passe</label>
          <input
            id="confirm"
            v-model="confirm"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input id="agree" v-model="agree" type="checkbox" class="h-4 w-4 rounded border-input" />
          <label for="agree" class="text-sm text-muted-foreground">J’accepte les conditions d’utilisation</label>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Création…' : 'Créer le compte' }}
        </button>

        <p class="text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?
          <RouterLink to="/login" class="text-primary hover:underline">Se connecter</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>