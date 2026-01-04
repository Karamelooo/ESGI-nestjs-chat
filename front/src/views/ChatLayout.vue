<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useChatStore } from '../stores/chat';
import { useAuthStore } from '../stores/auth';
import MessageBubble from '../components/MessageBubble.vue';
import { useRouter } from 'vue-router';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Switch from '@/components/ui/Switch.vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useDark, useToggle } from '@vueuse/core';
import { LogOut, Plus, Settings, UserPlus, Send, Moon, Sun, Trash2 } from 'lucide-vue-next';

// ... (existing code)

const confirmDelete = (roomId: string, roomName: string) => {
    console.log('Confirm Delete Triggered:', roomId, roomName);
    if (confirm(`Are you sure you want to delete room "${roomName}"? This cannot be undone.`)) {
        console.log('User confirmed deletion');
        chatStore.deleteRoom(roomId);
    } else {
        console.log('User cancelled deletion');
    }
};

const chatStore = useChatStore();
const authStore = useAuthStore();
const router = useRouter();
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
});
const toggleDark = useToggle(isDark);

const messageInput = ref('');
const typingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const showCreateRoom = ref(false);
const showSettings = ref(false);
const newRoomName = ref('');
const newRoomHistory = ref(true);

const showAddMember = ref(false);
const addMemberUsername = ref('');
const addMemberHistory = ref(true);

const addMember = () => {
    if(!addMemberUsername.value) return;
    chatStore.addMember(addMemberUsername.value, addMemberHistory.value);
    showAddMember.value = false;
    addMemberUsername.value = '';
    addMemberHistory.value = true;
};

const editUsername = ref(authStore.user?.username || '');
const editColor = ref(authStore.user?.color || '#3b82f6');

onMounted(() => {
  chatStore.connect();
  chatStore.joinRoom('general'); // Default room
});

watch(() => chatStore.messages.length, () => {
    // Hacky scroll for now until ScrollArea ref access is cleanly implemented
    setTimeout(() => {
        const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
        if(viewport) viewport.scrollTop = viewport.scrollHeight;
    }, 100);
});

const handleSend = () => {
  if (!messageInput.value.trim()) return;
  chatStore.sendMessage(messageInput.value);
  messageInput.value = '';
  chatStore.sendTyping(false);
};

const handleTyping = () => {
  chatStore.sendTyping(true);
  if (typingTimeout.value) clearTimeout(typingTimeout.value);
  typingTimeout.value = setTimeout(() => {
    chatStore.sendTyping(false);
  }, 2000);
};

const createRoom = () => {
  if(!newRoomName.value) return;
  
  if (chatStore.socket) {
      chatStore.socket.emit('createRoom', { 
          name: newRoomName.value, 
          memberIds: [], 
          historyAccess: newRoomHistory.value 
      });
      chatStore.socket.once('roomCreated', (room: { id: string }) => {
          chatStore.joinRoom(room.id);
          showCreateRoom.value = false;
          newRoomName.value = '';
      });
  }
};

const updateProfile = async () => {
   const success = await authStore.updateProfile(editUsername.value, editColor.value);
   if (success) {
     showSettings.value = false;
     chatStore.notifyProfileUpdate();
   }
};

const typingText = computed(() => {
  const users = chatStore.typingUsers.filter((u: any) => u.roomId === chatStore.currentRoom);
  if (users.length === 0) return '';
  if (users.length === 1) return `${users[0]?.username} is typing...`;
  if (users.length === 2 && users[0] && users[1]) return `${users[0].username} and ${users[1].username} are typing...`;
  return 'Several people are typing...';
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
    <!-- Sidebar -->
    <aside class="w-72 border-r bg-card/30 backdrop-blur-xl flex flex-col z-20 shadow-xl">
      <div class="p-6 border-b flex justify-between items-center bg-card/50">
        <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">NestChat</h1>
        <Button variant="ghost" size="icon" @click="showCreateRoom = true" title="Create Room">
           <Plus class="w-5 h-5" />
        </Button>
      </div>
      
      <ScrollArea class="flex-1 p-4">
        <div class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Active Rooms</div>
        <div class="space-y-1">
            <Button
              v-for="room in chatStore.rooms"
              :key="room.id"
              variant="ghost"
              @click="console.log('Room check:', { roomName: room.name, ownerId: room.ownerId, myId: authStore.user?.id }); chatStore.joinRoom(room.id)"
              class="w-full justify-start font-normal group relative"
              :class="{'bg-primary/10 text-primary font-medium': chatStore.currentRoom === room.id}"
            >
              <span class="mr-2 text-muted-foreground">#</span> 
              <span class="truncate">{{ room.name }}</span>
              <span v-if="room.ownerId === authStore.user?.id && room.id !== 'general'" 
                    class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-destructive cursor-pointer relative z-20"
                    @click.stop.prevent="confirmDelete(room.id, room.name)"
                    @mousedown.stop>
                  <Trash2 class="w-4 h-4" />
              </span>
            </Button>
        </div>
      </ScrollArea>

      <div class="p-4 border-t bg-card/50 space-y-4">
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" @click="showSettings = true">
          <Avatar>
             <AvatarImage :src="`https://api.dicebear.com/7.x/initials/svg?seed=${authStore.user?.username}&backgroundColor=${authStore.user?.color?.substring(1)}`" />
             <AvatarFallback>{{ authStore.user?.username?.substring(0,2).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
             <div class="text-sm font-medium truncate">{{ authStore.user?.username }}</div>
             <div class="text-xs text-green-500 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Online
             </div>
          </div>
          <Settings class="w-4 h-4 text-muted-foreground" />
        </div>
        
        <div class="flex items-center justify-between px-2">
            <Button variant="ghost" size="icon" @click="toggleDark()" title="Toggle Theme">
                <Sun v-if="isDark" class="w-4 h-4" />
                <Moon v-else class="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" @click="logout" class="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut class="w-4 h-4" />
            </Button>
        </div>
      </div>
    </aside>

    <!-- Main Chat Area -->
    <main class="flex-1 flex flex-col relative z-10 bg-background/50 backdrop-blur-3xl">
      <div class="h-16 border-b flex items-center px-6 justify-between bg-card/30 backdrop-blur-md shadow-sm z-10">
         <div class="flex items-center gap-4">
            <span class="font-semibold text-lg flex items-center gap-2">
                <span class="text-muted-foreground">#</span>
                {{ chatStore.rooms.find((r: any) => r.id === chatStore.currentRoom)?.name || 'Select a room' }}
            </span>
            <Button 
                v-if="chatStore.currentRoom !== 'general'" 
                variant="ghost" 
                size="icon" 
                @click="showAddMember = true" 
                title="Add Member"
                class="rounded-full hover:bg-primary/20 hover:text-primary transition-all"
            >
               <UserPlus class="w-5 h-5" />
            </Button>
         </div>
         <span v-if="typingText" class="text-sm text-primary animate-pulse font-medium">{{ typingText }}</span>
      </div>

      <ScrollArea class="flex-1 p-4" id="messages-container">
        <div class="space-y-4 pb-4">
             <MessageBubble 
               v-for="msg in chatStore.messages" 
               :key="msg.id" 
               :message="msg" 
             />
        </div>
      </ScrollArea>

      <div class="p-4 pb-6 bg-gradient-to-t from-background via-background/90 to-transparent">
        <div class="max-w-4xl mx-auto flex gap-3 items-end bg-card/50 p-2 rounded-xl border shadow-lg backdrop-blur-md ring-1 ring-white/10 focus-within:ring-primary/50 transition-all">
           <Input 
             v-model="messageInput"
             @keydown.enter="handleSend"
             @input="handleTyping"
             class="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70 min-h-[44px]"
             placeholder="Type a message..."
           />
           <Button @click="handleSend" class="rounded-lg shadow-lg" size="icon">
              <Send class="w-4 h-4 ml-0.5" />
           </Button>
        </div>
      </div>
    </main>

    <!-- Create Room Modal -->
    <Dialog v-model:open="showCreateRoom">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Create a new space for your team to collaborate.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Room Name</label>
            <Input v-model="newRoomName" placeholder="e.g. Project Alpha" />
          </div>
          <div class="flex items-center space-x-2">
            <Switch id="room-history" v-model:checked="newRoomHistory" />
            <label for="room-history" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              New members can see history
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCreateRoom = false">Cancel</Button>
          <Button @click="createRoom">Create Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- Add Member Modal -->
    <Dialog v-model:open="showAddMember">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
             Invite a user to this room.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Username</label>
            <Input v-model="addMemberUsername" placeholder="e.g. john_doe" />
          </div>
          <div class="flex items-center space-x-2">
             <Switch id="member-history" v-model:checked="addMemberHistory" />
             <label for="member-history" class="text-sm font-medium leading-none">
               Can see history
             </label>
          </div>
        </div>
        <DialogFooter>
           <Button variant="outline" @click="showAddMember = false">Cancel</Button>
           <Button @click="addMember">Add Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- Settings Modal -->
    <Dialog v-model:open="showSettings">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile settings.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
             <label class="text-sm font-medium leading-none">Username</label>
             <Input v-model="editUsername" />
          </div>
          <div class="space-y-2">
             <label class="text-sm font-medium leading-none">Color</label>
             <div class="flex gap-2">
                <Input v-model="editColor" type="color" class="w-12 h-10 p-1 cursor-pointer" />
                <Input v-model="editColor" class="flex-1" placeholder="#000000" />
             </div>
          </div>
        </div>
        <DialogFooter>
           <Button variant="outline" @click="showSettings = false">Cancel</Button>
           <Button @click="updateProfile">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100vh;
}
</style>
