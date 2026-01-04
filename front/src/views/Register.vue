<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useDark, useToggle } from '@vueuse/core';
import { Moon, Sun } from 'lucide-vue-next';

const username = ref('');
const password = ref('');
const color = ref('#3b82f6');
const authStore = useAuthStore();
const router = useRouter();

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
});
const toggleDark = useToggle(isDark);

const handleRegister = async () => {
  if (!username.value || !password.value) return;

  const success = await authStore.register(username.value, password.value, color.value);
  if (success) {
    router.push('/chat');
  } else {
    alert('Registration failed');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
    <!-- Theme Toggle -->
    <div class="absolute top-4 right-4 z-50">
      <Button variant="ghost" size="icon" @click="toggleDark()">
        <Sun v-if="isDark" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </Button>
    </div>

    <div class="absolute inset-0 z-0">
        <div class="absolute top-1/3 left-1/3 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-700"></div>
    </div>

    <Card class="w-full max-w-md z-10 backdrop-blur-md bg-card/50 border-white/10 shadow-xl">
      <CardHeader class="space-y-1 text-center">
        <CardTitle class="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div class="space-y-2">
           <Label for="username">Username</Label>
           <Input id="username" v-model="username" type="text" placeholder="Choose a username" />
        </div>
        
        <div class="space-y-2">
           <Label for="password">Password</Label>
           <Input id="password" v-model="password" type="password" placeholder="Choose a password" />
        </div>

        <div class="space-y-2">
           <Label for="color">Profile Color</Label>
           <div class="flex items-center gap-4">
              <div class="relative w-full">
                 <Input id="color" v-model="color" type="color" class="h-10 w-full cursor-pointer p-1" />
              </div>
              <div class="text-sm font-mono bg-muted px-2 py-1 rounded">{{ color }}</div>
           </div>
        </div>
      </CardContent>

      <CardFooter class="flex flex-col gap-4">
        <Button class="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0" @click="handleRegister">
          Sign Up
        </Button>
        
        <div class="text-center text-sm text-muted-foreground">
          Already have an account? 
          <router-link to="/login" class="text-primary hover:underline hover:text-primary/80 transition-colors">Log in</router-link>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
