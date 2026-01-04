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
const authStore = useAuthStore();
const router = useRouter();

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
});
const toggleDark = useToggle(isDark);

const handleLogin = async () => {
  if (!username.value || !password.value) return;
  
  const success = await authStore.login(username.value, password.value);
  if (success) {
    router.push('/chat');
  } else {
    alert('Login failed');
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
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
    </div>

    <Card class="w-full max-w-md z-10 backdrop-blur-md bg-card/50 border-white/10 shadow-xl">
      <CardHeader class="space-y-1 text-center">
        <CardTitle class="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div class="space-y-2">
           <Label for="username">Username</Label>
           <Input id="username" v-model="username" type="text" placeholder="Enter your username" />
        </div>
        
        <div class="space-y-2">
           <Label for="password">Password</Label>
           <Input id="password" v-model="password" type="password" placeholder="Enter your password" />
        </div>
      </CardContent>

      <CardFooter class="flex flex-col gap-4">
        <Button class="w-full" @click="handleLogin">Sign In</Button>
        
        <div class="text-center text-sm text-muted-foreground">
          Don't have an account? 
          <router-link to="/register" class="text-primary hover:underline hover:text-primary/80 transition-colors">Sign up</router-link>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
