"use client";

import { useState, KeyboardEvent } from "react";
import { getSocket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type ChatInputProps = {
  to?: string;
  gameId?: string;
};

export default function ChatInput({ to, gameId }: ChatInputProps) {
  const [text, setText] = useState("");

  const chatSocket = getSocket();
  const gameSocket = getSocket();

  const sendMessage = () => {
    const trimmed = text.trim();

    if (!trimmed) return;

    if (!to && !gameId) {
      console.warn("No target provided");
      return;
    }

    // DM
    if (to) {
      if (!chatSocket.connected) {
        console.warn("Chat socket not connected");
        return;
      }

      chatSocket.emit("dm", {
        to,
        content: trimmed,
      });
    }

    // GAME CHAT
    else if (gameId) {
      if (!gameSocket.connected) {
        console.warn("Game socket not connected");
        return;
      }

      gameSocket.emit("game_chat", {
        gameId,
        content: trimmed,
      });
    }

    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border-t bg-background p-3">
      <div className="flex items-center gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1"
        />

        <Button
          onClick={sendMessage}
          disabled={!text.trim()}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}