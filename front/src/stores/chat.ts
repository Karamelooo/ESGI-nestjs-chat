import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useChatStore = defineStore('chat', {
  state: () => ({
    socket: null as Socket | null,
    messages: [] as any[],
    rooms: [] as { id: string; name: string; ownerId: string }[],
    currentRoom: '',
    typingUsers: [] as { username: string, roomId: string }[],
  }),
  actions: {
    connect() {
      const authStore = useAuthStore();
      if (!authStore.token || this.socket?.connected) return;

      this.socket = io(API_URL, {
        extraHeaders: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });

      this.socket.on('connect', () => {
        console.log('Connected to chat server');
      });
      
      this.socket.on('error', (err: any) => {
          console.error('Socket Error:', err);
          alert(`Error: ${err.message || 'Unknown error'}`);
      });
      
      this.socket.on('userUpdated', ({ userId }: { userId: string }) => {
          console.log(`User profile updated: ${userId}`);
      });
      
      this.socket.on('roomsList', (rooms: { id: string; name: string; ownerId: string }[]) => {
          this.rooms = rooms;
          // Auto-join first room if none selected or if default 'general'
          if (!this.currentRoom && this.rooms.length > 0) {
             const general = this.rooms.find(r => r.name === 'General' || r.id === 'general');
             if(general) this.joinRoom(general.id);
             else {
                 const first = this.rooms[0];
                 if(first) this.joinRoom(first.id);
             }
          } else if (!this.currentRoom) {
             // Try to join general anyway which will trigger creation
              this.joinRoom('general');
          }
      });
      
      this.socket.on('roomCreated', (room: { id: string; name: string; ownerId: string }) => {
          this.rooms.push(room);
      });
      
      this.socket.on('addedToRoom', ({ room, userId }: { room: any, userId: string }) => {
          const authStore = useAuthStore();
          if (authStore.user?.id === userId) {
              this.rooms.push(room);
          }
      });

      this.socket.on('history', ({ roomId, messages }: { roomId: string, messages: any[] }) => {
        if (roomId === this.currentRoom) {
          this.messages = messages;
        }
      });

      this.socket.on('newMessage', (message: any) => {
        if (message.roomId === this.currentRoom) {
          this.messages.push(message);
        }
      });
      
      this.socket.on('reactionRemoved', ({ messageId, reactionId }) => {
          const msg = this.messages.find(m => m.id === messageId);
          if (msg && msg.reactions) {
              msg.reactions = msg.reactions.filter((r: any) => r.id !== reactionId);
          }
      });
      
      this.socket.on('reactionAdded', (reaction: any) => {
          const msg = this.messages.find(m => m.id === reaction.messageId);
          if (msg) {
              if (!msg.reactions) msg.reactions = [];
              msg.reactions.push(reaction);
          }
      });

      this.socket.on('userTyping', ({ username, isTyping, roomId }: { username: string, isTyping: boolean, roomId: string }) => {
         if (roomId !== this.currentRoom) return;
         if (isTyping) {
             if (!this.typingUsers.find((u: any) => u.username === username)) {
                 this.typingUsers.push({ username, roomId });
             }
         } else {
             this.typingUsers = this.typingUsers.filter((u: any) => u.username !== username);
         }
      });
      
      this.socket.on('roomDeleted', ({ roomId }) => {
          this.rooms = this.rooms.filter(r => r.id !== roomId);
          if (this.currentRoom === roomId) {
              this.currentRoom = 'general'; // Fallback
              this.joinRoom('general');
              alert('The room you were in has been deleted.');
          }
      });
    },
    joinRoom(roomId: string) {
       this.currentRoom = roomId;
       this.messages = []; // Clear current messages until history loads
       this.socket?.emit('joinRoom', { roomId });
    },
    sendMessage(content: string) {
      if (this.socket) {
        this.socket.emit('sendMessage', { roomId: this.currentRoom, content });
      }
    },
    sendTyping(isTyping: boolean) {
        if (this.socket) {
            this.socket.emit('typing', { roomId: this.currentRoom, isTyping });
        }
    },
    addReaction(messageId: string, emoji: string) {
        if(this.socket) {
            this.socket.emit('addReaction', { messageId, emoji, roomId: this.currentRoom });
        }
    },
    addMember(username: string, hasHistoryAccess: boolean) {
        if(this.socket) {
            this.socket.emit('addMember', { roomId: this.currentRoom, username, hasHistoryAccess });
        }
    },
    deleteRoom(roomId: string) {
        console.log('Store: deleteRoom called for', roomId);
        if(this.socket) {
            console.log('Store: emitting deleteRoom event');
            this.socket.emit('deleteRoom', { roomId });
        } else {
            console.error('Store: Socket not connected');
        }
    },
    // ... existing actions
    notifyProfileUpdate() {
        if(this.socket) {
           this.socket.emit('profileUpdated'); 
        }
    }
  },
});
