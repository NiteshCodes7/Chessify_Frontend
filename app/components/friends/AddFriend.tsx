"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useState } from "react";

export default function AddFriend() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function sendRequest() {
    try {
      await api.post("/friends/request", { email });
      setStatus("Request sent!");
      setEmail("");
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to send request";

      setStatus(message);
      console.error(err);
    }
  }

  return (
    <div className="p-4 space-y-3 max-w-md">
      <h2 className="text-xl font-semibold">Add Friend</h2>

      <div className="flex gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <Button onClick={sendRequest}>Send</Button>
      </div>

      {status && (
        <p
          className={`text-sm ${
            status === "Request sent!" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
