<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const props = defineProps<{ message: any }>();
const authStore = useAuthStore();
const chatStore = useChatStore();
const isMe = computed(() => props.message.authorId === authStore.user?.id);
const showReactions = ref(false);

const handleMouseEnter = () => {
    if (!isMe.value) {
        showReactions.value = true;
    }
};

const reactions = computed(() => {
    if(!props.message.reactions) return [];
    // Group reactions by emoji
    const groups: Record<string, number> = {};
    props.message.reactions.forEach((r: any) => {
        const count = groups[r.emoji] || 0;
        groups[r.emoji] = count + 1;
    });
    return Object.keys(groups).map(emoji => ({ emoji, count: groups[emoji] }));
});

const addReaction = (emoji: string) => {
    chatStore.addReaction(props.message.id, emoji);
    showReactions.value = false;
};
</script>

<template>
  <div class="flex flex-col mb-4 group transition-all duration-300 ease-out relative" 
       :class="[isMe ? 'items-end' : 'items-start', showReactions ? 'z-50' : 'z-auto']">
    <div class="flex items-end gap-2 max-w-[80%] relative">
       <Avatar v-if="!isMe" class="w-8 h-8 shadow-md ring-2 ring-background">
          <AvatarImage :src="`https://api.dicebear.com/7.x/initials/svg?seed=${message.author.username}&backgroundColor=${message.author.color?.substring(1)}`" />
          <AvatarFallback :style="{ backgroundColor: message.author.color }" class="text-white text-xs font-bold">
            {{ message.author.username.substring(0,2).toUpperCase() }}
          </AvatarFallback>
       </Avatar>
       
       <div 
         class="p-3 px-4 rounded-2xl shadow-sm backdrop-blur-md transition-all hover:shadow-md relative border border-white/5"
         :class="isMe 
            ? 'bg-primary text-primary-foreground rounded-br-sm' 
            : 'bg-secondary text-secondary-foreground rounded-bl-sm'"
         @mouseenter="handleMouseEnter"
         @mouseleave="showReactions = false"
       >
         <div v-if="!isMe" class="text-xs font-bold mb-1 opacity-80" :style="{ color: message.author.color }">{{ message.author.username }}</div>
         <div class="leading-relaxed z-5">{{ message.content }}</div>
         
         <!-- Reaction Picker -->
         <div v-if="showReactions" class="absolute -bottom-10 bg-popover/90 backdrop-blur-xl rounded-full px-3 py-1.5 flex gap-2 shadow-xl border border-border animate-fade-in z-10 transition-all scale-100 origin-bottom">
            <button @click="addReaction('👍')" class="hover:scale-125 transition active:scale-95 text-xl">👍</button>
            <button @click="addReaction('❤️')" class="hover:scale-125 transition active:scale-95 text-xl">❤️</button>
            <button @click="addReaction('😂')" class="hover:scale-125 transition active:scale-95 text-xl">😂</button>
            <button @click="addReaction('😮')" class="hover:scale-125 transition active:scale-95 text-xl">😮</button>
         </div>
       </div>
    </div>
    
    <!-- Reactions Display -->
    <div v-if="reactions.length > 0" class="flex gap-1.5 mt-1 px-10 flex-wrap">
        <button 
           v-for="r in reactions" 
           :key="r.emoji" 
           @click="addReaction(r.emoji)"
           class="bg-secondary/50 hover:bg-secondary/80 rounded-full px-2.5 py-0.5 text-xs text-secondary-foreground border border-border/50 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
           :title="`Toggle ${r.emoji}`"
        >
            <span>{{ r.emoji }}</span>
            <span class="font-semibold opacity-70">{{ r.count }}</span>
        </button>
    </div>
  </div>
</template>

<style>
.animate-fade-in {
    animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
