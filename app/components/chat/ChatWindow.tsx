"use client";

import { useEffect, useState, useRef } from "react";
import MessageItem from "./MessageItem";
import ChatInput from "./ChatInput";
import { getUserId } from "@/lib/getUser";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Friend = {
  id: string;
  name: string;
};

type Message = {
  id?: string;
  from: string;
  to?: string;
  content: string;
  createdAt?: string;
  isMe?: boolean;
};

type ApiMessage = {
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

type ChatWindowProps = {
  selectedFriend?: Friend | null;
  gameId?: string;
};

export default function ChatWindow({
  selectedFriend,
  gameId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isGameChat = !!gameId;
  const socket = getSocket();

  /* ---------------- DM CHAT ---------------- */

  useEffect(() => {
    if (!selectedFriend || gameId) return;

    const currentUserId = getUserId();

    // fetch history
    (async () => {
      try {
        const res = await api.get(`/chat/${selectedFriend.id}`);

        setMessages(
          res.data.map((msg: ApiMessage) => ({
            from: msg.senderId,
            to: msg.receiverId,
            content: msg.content,
            createdAt: msg.createdAt,
            isMe: msg.senderId === currentUserId,
          })),
        );
      } catch (err) {
        console.error(err);
      }
    })();

    // receive messages
    const handleDM = (msg: Message) => {
      const isThisChat =
        (msg.from === currentUserId && msg.to === selectedFriend.id) ||
        (msg.from === selectedFriend.id && msg.to === currentUserId);

      if (!isThisChat) return;

      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          isMe: msg.from === currentUserId,
        },
      ]);
    };

    socket.on("dm", handleDM);

    return () => {
      socket.off("dm", handleDM);
    };
  }, [selectedFriend, gameId, socket]);

  /* ---------------- GAME CHAT ---------------- */

  useEffect(() => {
    if (!gameId) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleGameChat = (msg: { from: string; content: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          from: msg.from,
          content: msg.content,
          isMe: msg.from === getUserId(),
        },
      ]);
    };

    socket.on("game_chat", handleGameChat);

    return () => {
      socket.off("game_chat", handleGameChat);
    };
  }, [gameId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedFriend && !gameId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a friend to start chatting
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full max-h-full overflow-hidden ${
        isGameChat
          ? "bg-gray-900 text-gray-200 border border-gray-700"
          : "bg-background"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0 border-b border-gray-700">
        <Avatar className="h-8 w-8 bg-indigo-600">
          <AvatarFallback>GC</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            {isGameChat ? "Game Chat" : selectedFriend?.name}
          </span>
          {isGameChat && (
            <span className="text-xs text-gray-400">Live match messages</span>
          )}
        </div>
      </div>
      {/* Messages */}
      <div
        className={`flex-1 overflow-y-auto px-3 py-2 space-y-2 ${
          isGameChat ? "text-sm" : "space-y-3"
        } chat-scroll`}
      >
        {messages.map((msg, i) => (
          <MessageItem
            key={msg.id ?? i}
            message={msg}
            isGameChat={isGameChat}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t">
        <ChatInput gameId={gameId} to={selectedFriend?.id} />
      </div>
    </div>
  );
}
