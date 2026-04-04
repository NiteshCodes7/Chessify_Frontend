"use client";

type Message = {
  content: string;
  isMe?: boolean;
  createdAt?: string;
};

type MessageItemProps = {
  message: Message;
  isGameChat: boolean;
};

export default function MessageItem({ message, isGameChat }: MessageItemProps) {
  const isMe = message.isMe ?? false;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          px-3 py-2
          ${isMe ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-200"}
          ${isGameChat ? "text-xs px-2 py-1" : "text-sm"}
          ${isGameChat && isMe ? "shadow-[0_0_8px_rgba(99,102,241,0.6)]" : ""}
        `}
      >
        {message.content}
      </div>

      {message.createdAt && (
        <span className="text-[10px] opacity-70 block mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );
}
