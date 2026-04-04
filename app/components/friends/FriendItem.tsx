"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatLastSeen } from "@/lib/lastSeen";

type Friend = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  rating?: number;
  status?: "online" | "playing" | "offline";
  lastSeen?: number | null;
};

type FriendItemProps = {
  friend: Friend;
  onClick?: () => void;
};

export default function FriendItem({ friend, onClick }: FriendItemProps) {
  const statusVariant =
    friend.status === "online"
      ? "default"
      : friend.status === "playing"
        ? "secondary"
        : "outline";

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition cursor-pointer"
    >
      {/* Avatar */}
      <Avatar className="h-9 w-9">
        <AvatarImage src={friend.avatar || "/avatar.png"} />
        <AvatarFallback>{friend.name?.charAt(0)}</AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{friend.name}</p>

        <p className="text-xs text-muted-foreground truncate">{friend.email}</p>

        {friend.rating !== undefined && (
          <p className="text-xs text-muted-foreground">⭐ {friend.rating}</p>
        )}

        {friend.status === "offline" && (
          <p className="text-xs text-muted-foreground">
            {formatLastSeen(friend.lastSeen)}
          </p>
        )}
      </div>

      {/* Status */}
      <Badge variant={statusVariant} className="text-xs capitalize">
        {friend.status || "offline"}
      </Badge>
    </div>
  );
}
