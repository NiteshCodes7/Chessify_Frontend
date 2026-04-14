import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getGameSocket(): Socket {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL!}/game` || "http://localhost:3001/game", {
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return socket;
}