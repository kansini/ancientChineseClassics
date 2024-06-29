import {defineStore} from 'pinia';
// @ts-ignore
import {io, Socket} from 'socket.io-client';


interface State {
    socket: Socket | null;
}


export const useSocketStore = defineStore('socket', {
    state: (): State => ({
        socket: null,
    }),

    actions: {
        connectSocket(wsUrl: string) {
            const url = import.meta.env.VITE_WEBSOCKET_URL + wsUrl
            console.log('WebSocket URl:', url);
            this.socket = io(url);
            this.socket.on('connect', () => {
                console.log('Socket connected:', this.socket?.id);
            });

            this.socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });
        },

        disconnectSocket() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
            }
        },

        sendMessage(event: string, payload: any) {
            if (this.socket) {
                this.socket.emit(event, payload);
            }
        },
        registerEvent(event: string, callback: (data: any) => void) {
            if (this.socket) {
                this.socket.on(event, callback);
            }
        },

        unregisterEvent(event: string) {
            if (this.socket) {
                this.socket.off(event);
            }
        }
    }
});
