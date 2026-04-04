"use client";

import { useState, useEffect } from "react";
import { getPresenceSocket } from "@/lib/presenceSocket";
import FriendItem from "./FriendItem";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "online" | "playing" | "offline";

type Friend = {
  id: string;
  name: string;
  avatar?: string;
  rating?: number;
  status?: Status;
  lastSeen?: number | null;
};

type FriendsSidebarProps = {
  onSelect: (friend: Friend) => void;
};

type GroupedFriends = {
  online: Friend[];
  playing: Friend[];
  offline: Friend[];
};

export default function FriendsSidebar({ onSelect }: FriendsSidebarProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");
  const socket = getPresenceSocket();

  function groupFriends(list: Friend[]): GroupedFriends {
    return {
      online: list.filter((f) => f.status === "online"),
      playing: list.filter((f) => f.status === "playing"),
      offline: list.filter((f) => !f.status || f.status === "offline"),
    };
  }

  /* Search */
  const query = search.trim().toLowerCase();

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(query)
  );

  const grouped = groupFriends(filteredFriends);

  useEffect(() => {
    const pendingUpdates = new Map<string, Status>();

    const handleFriends = (data: Friend[]) => {
      setFriends(
        data.map((f) => ({
          ...f,
          status: pendingUpdates.get(f.id) ?? f.status,
        }))
      );
      pendingUpdates.clear();
    };

    const handlePresence = ({
      userId,
      status,
    }: {
      userId: string;
      status: Status;
    }) => {
      pendingUpdates.set(userId, status);

      setFriends((prev) => {
        if (!prev.length) return prev;
        return prev.map((f) =>
          f.id === userId ? { ...f, status } : f
        );
      });

      if (status === "online") {
        setTimeout(() => socket.emit("get_friends_with_presence"), 300);
      }
    };

    const requestFriends = () => {
      setTimeout(() => socket.emit("get_friends_with_presence"), 1000);
    };

    socket.on("friends_with_presence", handleFriends);
    socket.on("presence_update", handlePresence);
    socket.on("connect", requestFriends);

    if (socket.connected) {
      requestFriends();
    }

    return () => {
      socket.off("friends_with_presence", handleFriends);
      socket.off("presence_update", handlePresence);
      socket.off("connect", requestFriends);
    };
  }, [socket]);

  return (
    <div className="w-72 h-full bg-background border-r flex flex-col">
      
      {/* Header */}
      <div className="p-4 text-lg font-semibold">Friends</div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-9 pr-8 h-9 bg-muted border-none focus-visible:ring-1"
          />

          {search && (
            <Button
            variant={"ghost"}
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {search && filteredFriends.length === 0 && (
        <p className="text-xs text-muted-foreground px-3 py-2">
          No results found
        </p>
      )}

      <Separator />

      {/* Friends List */}
      <ScrollArea className="flex-1 px-3">
        {(["online", "playing", "offline"] as const).map((group) => {
          const list = grouped[group];

          if (search && list.length === 0) return null;

          return (
            <div key={group} className="mt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
                {group}
              </h3>

              <div className="space-y-1">
                {list.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2">
                    No users
                  </p>
                ) : (
                  list.map((friend) => (
                    <FriendItem
                      key={friend.id}
                      friend={friend}
                      onClick={() => onSelect(friend)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}