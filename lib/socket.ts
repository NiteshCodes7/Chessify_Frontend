import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL! || "http://localhost:3001", {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
}
