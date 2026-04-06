# 🔁 Play Again (Rematch) Workflow

This document describes the full lifecycle of the rematch system in the chess application.

---

## 🧠 Overview

Rematch is a two-player confirmation system:

- Player A requests a rematch
- Player B accepts or rejects
- If accepted → a new game is created
- If ignored → request auto-expires after 10 seconds

---

## 🎯 Flow Summary


Game Over
↓
Player A clicks Rematch
↓
Server sends offer to Player B
↓
Player B:
→ Accept → New Game
→ Reject → Notify Player A
→ Ignore → Timeout (10s)


---

## 🏁 1. Game Ends

### Trigger
- Checkmate
- Stalemate
- Timeout

### Backend
- Calls `finalizeGame`
- Emits `game_over`
- Stores players for rematch

```ts
rematchRequests.set(gameId, {
  from: whitePlayerId,
  to: blackPlayerId,
});


🖱️ 2. Player A Requests Rematch
Frontend
socket.emit("rematch_request", { gameId });
Backend (rematch_request)

Steps:

Validate user
Fetch rematch request entry
Prevent duplicate click
Start timeout (only once)
Notify opponent
Notify sender
server.to(`user:${opponent}`).emit("rematch_offer", {
  gameId,
  from: userId,
});

server.to(`user:${userId}`).emit("rematch_waiting");


⏳ 3. Timeout Handling (10 seconds)

If opponent does not respond:

setTimeout(() => {
  server.to(`user:${from}`).emit("rematch_timeout");
  server.to(`user:${to}`).emit("rematch_expired");
  rematchRequests.delete(gameId);
}, 10000);


👀 4. Player B Receives Offer
Frontend
socket.on("rematch_offer", ({ gameId, from }) => {
  // Show Accept / Reject modal
});


✅ 5. Player B Responds
Frontend
socket.emit("rematch_response", {
  gameId,
  accept: true // or false
});


🔁 6. Backend Handles Response
Validation-
    Request exists
    Only opponent can respond

    ❌ If Rejected
    server.to(`user:${from}`).emit("rematch_rejected");
    rematchRequests.delete(gameId);

✅ If Accepted
Step 1: Clear timeout
    clearTimeout(request.timeout);

Step 2: Create new game
    const newGame = await createDirectMatch(to, from); // swap colors

Step 3: Cleanup
    rematchRequests.delete(gameId);

Step 4: Notify both players
    server.to(`user:${from}`).emit("match_found", {
    gameId: newGame.gameId,
    color: newGame.players.white === from ? "white" : "black",
    });

    server.to(`user:${to}`).emit("match_found", {
    gameId: newGame.gameId,
    color: newGame.players.white === to ? "white" : "black",
    });


🔄 7. Frontend Handles New Game
On match_found
    resetGame();
    router.push(`/game/${gameId}`);


🧹 8. Cleanup
Frontend-
    waiting = false
    rematchOffer = null
Backend-
    Remove rematch request
    Clear timeout


📦 Data Structure
type RematchRequest = {
  from: string;
  to: string;
  timeout?: NodeJS.Timeout;
};

const rematchRequests = new Map<string, RematchRequest>();