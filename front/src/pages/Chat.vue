<template>
  <div class="bg-background text-foreground">
    <div class="mx-auto max-w-[1600px] px-4 py-4">
      <div class="grid grid-cols-[260px_1fr] md:grid-cols-[300px_1fr] rounded-lg border border-border overflow-hidden h-[calc(100vh-8rem)]">
        <!-- Sidebar -->
        <aside class="bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
          <div class="px-3 py-3 border-b border-sidebar-border flex items-center justify-between">
            <div class="font-semibold tracking-tight">ChatLine</div>
            <button class="h-8 rounded-md bg-sidebar-primary px-2.5 text-xs text-sidebar-primary-foreground hover:opacity-90">+ Nouveau</button>
          </div>

          <div class="px-3 py-3 text-xs uppercase tracking-wide text-muted-foreground">Canaux</div>
          <nav class="px-2 space-y-1">
            <button class="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" :class="{ 'bg-sidebar-accent text-sidebar-accent-foreground': activeChannel === '#général' }" @click="activeChannel = '#général'">
              <span class="opacity-70">#</span>
              <span>général</span>
            </button>
            <button class="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" :class="{ 'bg-sidebar-accent text-sidebar-accent-foreground': activeChannel === '#frontend' }" @click="activeChannel = '#frontend'">
              <span class="opacity-70">#</span>
              <span>frontend</span>
            </button>
            <button class="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" :class="{ 'bg-sidebar-accent text-sidebar-accent-foreground': activeChannel === '#backend' }" @click="activeChannel = '#backend'">
              <span class="opacity-70">#</span>
              <span>backend</span>
            </button>
          </nav>

          <div class="px-3 pt-4 pb-2 text-xs uppercase tracking-wide text-muted-foreground">Messages directs</div>
          <nav class="px-2 space-y-1 pb-4 overflow-y-auto">
            <button v-for="dm in dms" :key="dm" class="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <span class="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              <span>{{ dm }}</span>
            </button>
          </nav>
        </aside>

        <!-- Main area -->
        <section class="grid grid-rows-[auto_1fr_auto] bg-background">
          <!-- Channel header -->
          <div class="flex items-center justify-between border-b border-border px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="font-semibold">{{ activeChannel }}</div>
              <div class="text-xs text-muted-foreground">42 en ligne</div>
            </div>
            <div class="hidden md:flex items-center gap-2">
              <input class="h-9 w-64 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Rechercher dans la conversation" />
              <button class="h-9 rounded-md border border-input bg-transparent px-3 text-sm hover:bg-accent hover:text-accent-foreground">Filtres</button>
            </div>
          </div>

          <!-- Messages -->
          <div class="overflow-y-auto p-4 bg-muted/30">
            <div class="space-y-4">
              <div v-for="(msg, i) in messages" :key="i" class="flex items-start gap-3" :class="msg.me ? 'justify-end' : ''">
                <template v-if="!msg.me">
                  <div class="h-8 w-8 rounded-full bg-secondary"></div>
                  <div>
                    <div class="text-sm font-medium">{{ msg.author }}</div>
                    <div class="text-sm text-muted-foreground" v-if="msg.meta">{{ msg.meta }}</div>
                    <div class="mt-1 inline-block rounded-md bg-card px-3 py-2 text-sm shadow border border-border">{{ msg.text }}</div>
                  </div>
                </template>
                <template v-else>
                  <div>
                    <div class="text-right text-sm font-medium">Moi</div>
                    <div class="mt-1 inline-block rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground shadow">{{ msg.text }}</div>
                  </div>
                  <div class="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px]">ME</div>
                </template>
              </div>
            </div>
          </div>

          <!-- Composer -->
          <div class="border-t border-border p-3">
            <form class="flex items-center gap-2" @submit.prevent="send">
              <button type="button" class="h-10 rounded-md border border-input bg-transparent px-3 text-sm hover:bg-accent hover:text-accent-foreground">+</button>
              <input v-model="draft" class="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Message #général" />
              <button type="submit" class="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground shadow hover:opacity-90">Envoyer</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeChannel = ref('#général')
const dms = ref<string[]>(['Alicia', 'Samir', 'Zoé'])
const messages = ref(
  [
    { author: 'Alicia', text: 'Bienvenue sur #général 👋', meta: '08:41', me: false },
    { author: 'Samir', text: 'Hello la team !', meta: '08:42', me: false },
    { author: 'Moi', text: 'Salut tout le monde ✨', meta: '08:43', me: true },
  ] as Array<{ author: string; text: string; meta?: string; me?: boolean }>
)
const draft = ref('')

const send = () => {
  if (!draft.value.trim()) return
  messages.value.push({ author: 'Moi', text: draft.value, me: true })
  draft.value = ''
}
</script>

