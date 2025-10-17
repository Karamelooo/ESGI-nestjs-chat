<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const onSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      throw (data && (data.message || data.error)) || 'Inscription échouée'
    }
    if (data && (data.token || data.access_token)) {
      localStorage.setItem('token', data.token || data.access_token)
    }

    // Redirection vers la page de chat
    router.push('/app')
  } catch (err: any) {
    error.value = err?.message ?? String(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground grid place-items-center px-4 py-10">
    <div class="w-full max-w-md rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div class="px-6 pt-6">
        <h1 class="text-2xl font-bold tracking-tight">Connexion</h1>
      </div>
      <form class="px-6 pb-6 pt-4 space-y-4" @submit.prevent="onSubmit">
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
            autocomplete="current-password"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Connexion…' : 'Connexion' }}
        </button>

        <p class="text-center text-sm text-muted-foreground">
          Pas de compte ?
          <RouterLink to="/register" class="text-primary hover:underline">Créer un compte</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
