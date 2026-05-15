# BusLoot Prototype

A static web prototype for BusLoot, a gamified public transportation collectible system.

## Features

- Scan QR / Open capsule interaction
- Random sticker drop with rarity tiers
- Route-exclusive drops (e.g. tuyến 32, BRT, Metro)
- Inventory collection board
- Trading prototype: đổi sticker với thị trường giả lập
- Opening animation + reveal effect
- Campus leaderboard prototype
- Streak and bonus mechanics

## Mở nhanh

1. Mở `index.html` trong trình duyệt.
2. Hoặc chạy web server đơn giản:

```powershell
cd D:\BusLoot
python -m http.server 8000
```

3. Truy cập `http://localhost:8000`.

## File chính

- `index.html` - giao diện chính
- `styles.css` - kiểu dáng prototype
- `script.js` - logic mở capsule, inventory, leaderboard
