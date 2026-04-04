# Friends Sidebar Workflow

Component Mounts
      ↓
Socket Connects
      ↓
Emit: get_friends_with_presence
      ↓
 ┌───────────────────────────────┐
 │                               │
 │   friends_with_presence       │
 │   (full friends list)         │
 │                               │
 └───────────────┬───────────────┘
                 │
                 ↓
        setFriends(full list)
                 │
                 ↓
        Apply buffered updates
                 │
                 ↓
              UI Updates
   (group: online / playing / offline)

----------------------------------------

Meanwhile (real-time):

presence_update (userId, status)
        ↓
Store in buffer (Map)
        ↓
If friends already loaded:
        ↓
Update one friend:
f.id === userId ? update : keep
        ↓
UI Updates instantly