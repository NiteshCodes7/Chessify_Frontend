"use client";

import { useEffect, useState } from "react";
import FriendsSidebar from "../components/friends/FriendsSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import FriendRequests from "../components/friends/FriendRequests";
import AddFriend from "../components/friends/AddFriend";
import { Friend } from "../../types/friends";

import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";

type Tab = "friends" | "requests" | "add";

export default function FriendsPage() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [tab, setTab] = useState<Tab>("friends");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      const media = window.matchMedia("(min-width: 768px)");

      const handleResize = () => {
        if (media.matches) {
          setOpen(false);
        }
      };

      media.addEventListener("change", handleResize);
      return () => media.removeEventListener("change", handleResize);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <FriendsSidebar onSelect={setSelectedFriend} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SheetTitle className="sr-only">Friends Sidebar</SheetTitle>

          <FriendsSidebar
            onSelect={(friend) => {
              setSelectedFriend(friend);
              setOpen(false);
            }}
          />
        </SheetContent>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile menu */}
              <SheetTrigger asChild>
                <button className="md:hidden">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>

              {/* Title */}
              <h1 className="text-base md:text-lg font-semibold truncate">
                {tab === "friends"
                  ? selectedFriend?.name || "Messages"
                  : tab === "requests"
                    ? "Requests"
                    : "Add Friend"}
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {[
                { key: "friends", label: "Chats" },
                { key: "requests", label: "Req" },
                { key: "add", label: "Add" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as Tab)}
                  className={cn(
                    "px-2 md:px-3 py-1 text-xs md:text-sm rounded-md transition",
                    tab === t.key
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 p-2 md:p-4">
            {/* Chat */}
            {tab === "friends" && (
              <div className="h-full rounded-xl md:rounded-2xl border bg-card overflow-hidden">
                <ChatWindow selectedFriend={selectedFriend} />
              </div>
            )}

            {/* Requests */}
            {tab === "requests" && (
              <div className="h-full overflow-auto">
                <div className="max-w-2xl mx-auto">
                  <FriendRequests />
                </div>
              </div>
            )}

            {/* Add */}
            {tab === "add" && (
              <div className="h-full overflow-auto">
                <div className="max-w-md mx-auto">
                  <AddFriend />
                </div>
              </div>
            )}
          </div>
        </div>
      </Sheet>
    </div>
  );
}
