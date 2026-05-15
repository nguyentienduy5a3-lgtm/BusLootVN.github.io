BusLoot local server

This small Node/Express server enforces one-account-per-IP and serves leaderboards.

Quick start:

1. Install Node.js (v16+ recommended).
2. In the `D:\BusLoot` folder run:

```powershell
npm install
npm start
```

3. Open `http://localhost:3000/launch.html` in your browser.

Notes:
- The server stores users in `server_users.json`.
- It's a minimal stub for prototype use only. For production, add authentication, HTTPS, validation, and rate-limiting.
