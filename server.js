const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const DATA_FILE = path.join(__dirname, 'server_users.json');
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '{}');
  } catch (e) {
    return {};
  }
}
function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

const app = express();
app.use(bodyParser.json());
// trust proxy so req.ip reflects client IP behind proxies
app.set('trust proxy', true);

// Serve static site from this folder (BusLoot files)
app.use(express.static(__dirname));

app.post('/api/register', (req, res) => {
  const { username, passwordHash, school } = req.body || {};
  if (!username || !passwordHash) return res.status(400).json({ error: 'Missing username or passwordHash' });
  const ip = (req.ip || '').toString();
  const users = loadUsers();
  if (users[username]) return res.status(409).json({ error: 'Username exists' });
  users[username] = {
    username,
    passwordHash,
    school: school || 'FTU',
    ipAddress: ip,
    inventory: {},
    rideCount: 0,
    streak: 0,
    bonusCounter: 5,
    lastRideDate: null,
    completion: 0,
    rideSinceLegendary: 0,
    rideSinceMythic: 0,
    dailyPulls: 3,
    lastLoginDate: new Date().toISOString().slice(0,10)
  };
  saveUsers(users);
  return res.status(201).json({ ok: true, user: users[username] });
});

app.post('/api/login', (req, res) => {
  const { username, passwordHash } = req.body || {};
  if (!username || !passwordHash) return res.status(400).json({ error: 'Missing fields' });
  const users = loadUsers();
  const u = users[username];
  if (!u) return res.status(404).json({ error: 'User not found' });
  if (u.passwordHash !== passwordHash) return res.status(403).json({ error: 'Bad password' });
  // grant daily pulls if not yet claimed today
  const today = new Date().toISOString().slice(0,10);
  if (u.lastLoginDate !== today) {
    u.dailyPulls = (u.dailyPulls || 0) + 3;
    u.lastLoginDate = today;
    saveUsers(users);
  }
  return res.json({ ok: true, user: u });
});

app.get('/api/leaderboard', (req, res) => {
  const users = loadUsers();
  const list = Object.values(users).map(u => {
    const rareCount = Object.entries(u.inventory || {}).reduce((acc, [id, qty]) => {
      // approximate: treat any non-common as rare for server simplicity
      return acc + (qty || 0);
    }, 0);
    const points = (u.rideCount || 0) * 10 + rareCount * 5;
    return { username: u.username, school: u.school || 'FTU', rideCount: u.rideCount || 0, points };
  });
  list.sort((a,b) => b.points - a.points);
  res.json({ leaders: list.slice(0,100) });
});

app.get('/api/users', (req, res) => {
  const users = loadUsers();
  res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('BusLoot server running on port', PORT));
