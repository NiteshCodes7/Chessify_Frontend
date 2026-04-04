"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Request = {
  id: string;
  from: {
    id: string;
    name: string;
    email: string;
  };
};

export default function FriendRequests() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    api
      .get("/friends/requests")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  async function accept(id: string) {
    try {
      await api.post(`/friends/accept/${id}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function reject(id: string) {
    try {
      await api.post(`/friends/reject/${id}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Friend Requests</h2>

      {requests.map((req) => (
        <Card key={req.id}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium">{req.from.name}</p>
              <p className="text-sm text-muted-foreground">{req.from.email}</p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => accept(req.id)}>
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => reject(req.id)}
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
