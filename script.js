// ==================== BUSLOOT MAIN SCRIPT (No GPS Version) ====================

// ---------- STICKER DATABASE ----------
const STICKERS_DB = {
  common: [
    { id: "bus_yellow", name: "🚌 Xe buýt vàng", desc: "Phương tiện quen thuộc mỗi ngày", icon: "🚌" },
    { id: "ticket", name: "🎫 Vé lượt", desc: "Tấm vé nhỏ, niềm vui lớn", icon: "🎫" },
    { id: "plastic_chair", name: "🪑 Ghế nhựa", desc: "Ngồi yên và ngắm phố", icon: "🪑" },
    { id: "bell", name: "🔔 Chuông xe", desc: "Keng keng, xuống thôi!", icon: "🔔" },
    { id: "rain_drop", name: "🌧️ Giọt mưa", desc: "Mưa trên mái xe buýt", icon: "🌧️" },
    { id: "window_view", name: "🪟 Cửa sổ xe", desc: "Ngắm phố phường", icon: "🪟" },
    { id: "driver_hat", name: "🧢 Mũ tài xế", desc: "Phong cách lái xe", icon: "🧢" }
  ],
  uncommon: [
    { id: "phone_tap", name: "📱 Quẹt thẻ điện thoại", desc: "Thanh toán không tiếp xúc", icon: "📱" },
    { id: "airpods", name: "🎧 AirPods thất lạc", desc: "Nhạc và lời ru trên xe", icon: "🎧" },
    { id: "banh_mi", name: "🥖 Bánh mì kẹp", desc: "Ăn vội trước giờ học", icon: "🥖" },
    { id: "powerbank", name: "🔋 Sạc dự phòng", desc: "Cứu cánh cho điện thoại", icon: "🔋" },
    { id: "coffee_cup", name: "☕ Cà phê mang đi", desc: "Năng lượng buổi sáng", icon: "☕" }
  ],
  rare: [
    { id: "dragon_32", name: "🐉 Rồng biển số 32", desc: "Huyền thoại tuyến xe đông nhất", icon: "🐉" },
    { id: "street_guitar", name: "🎸 Guitar đường phố", desc: "Nghệ sĩ vỉa hè bất đắc dĩ", icon: "🎸" },
    { id: "brt_vampire", name: "🧛 Ma cà rồng BRT", desc: "Chỉ xuất hiện lúc nửa đêm", icon: "🧛" },
    { id: "night_bus", name: "🌙 Xe đêm huyền thoại", desc: "Chuyến xe cuối cùng", icon: "🌙" }
  ],
  epic: [
    { id: "gold_badge", name: "🏆 Huy hiệu vàng BusLoot", desc: "Thương hiệu của nhà vô địch", icon: "🏆" },
    { id: "future_bus", name: "🚀 Xe buýt tương lai", desc: "Chạy bằng năng lượng mặt trời", icon: "🚀" },
    { id: "festival_mask", name: "🎭 Mặt nạ lễ hội", desc: "Hóa trang mỗi mùa lễ", icon: "🎭" },
    { id: "phoenix", name: "🔥 Phượng hoàng lửa", desc: "Tái sinh từ tro tàn", icon: "🔥" }
  ],
  legendary: [
    { id: "bus_king", name: "👑 Vua của các tuyến xe", desc: "Ngồi đâu cũng thành ghế VIP", icon: "👑" },
    { id: "urban_dragon", name: "🐉 Long mạch đô thị", desc: "Sức mạnh ngàn năm", icon: "🐉" },
    { id: "time_machine", name: "⏰ Cỗ máy thời gian", desc: "Du hành quá khứ", icon: "⏰" }
  ],
  mythic: [
    { id: "bus_star", name: "🌟 Tinh tú BusLoot", desc: "Loot từ cõi mộng", icon: "🌟" },
    { id: "god_wheel", name: "⚡ Bánh xe thần thánh", desc: "Sấm sét và vinh quang", icon: "⚡" }
  ],
  secret: [
    { id: "black_book", name: "📕 Sổ đen tài xế", desc: "Chứa bí mật không thể nói", icon: "📕" }
  ],
  impossible: [
    { id: "skeleton_wheel", name: "💀 Xương rồng lăn bánh", desc: "Người chơi huyền thoại mở được???", icon: "💀" },
    { id: "void_bus", name: "🌀 Xe buýt hư không", desc: "Tồn tại giữa các chiều không gian", icon: "🌀" }
  ]
};

const RARITY_CONFIG = [
  { name: "common", chance: 55, display: "Common", color: "#6c757d" },
  { name: "uncommon", chance: 25, display: "Uncommon", color: "#28a745" },
  { name: "rare", chance: 12, display: "Rare", color: "#007bff" },
  { name: "epic", chance: 5, display: "Epic", color: "#9b59b6" },
  { name: "legendary", chance: 2, display: "Legendary", color: "#f39c12" },
  { name: "mythic", chance: 0.8, display: "Mythic", color: "#e84393" },
  { name: "secret", chance: 0.19, display: "Secret", color: "#f1c40f" },
  { name: "impossible", chance: 0.01, display: "Impossible", color: "#ff0066" }
];

// ---------- GLOBAL STATE ----------
let currentUser = null;
let users = JSON.parse(localStorage.getItem("busloot_users")) || {};
let inventory = {};
let rideCount = 0;
let streak = 0;
let rideInProgress = false;
let rideTimer = null;
let availableOpens = 0; // Số lượt mở capsule có sẵn

// ---------- HELPER FUNCTIONS ----------
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    if (toast) toast.classList.add("hidden");
  }, duration);
}

function rollRarity() {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const rarity of RARITY_CONFIG) {
    cumulative += rarity.chance;
    if (rand <= cumulative) return rarity.name;
  }
  return "common";
}

function getRandomSticker(rarity) {
  const stickers = STICKERS_DB[rarity];
  if (!stickers || stickers.length === 0) {
    return { id: "unknown", name: "❓ Bí ẩn", desc: "???", icon: "❓" };
  }
  return stickers[Math.floor(Math.random() * stickers.length)];
}

function saveData() {
  if (currentUser && users[currentUser]) {
    users[currentUser].inventory = inventory;
    users[currentUser].rideCount = rideCount;
    users[currentUser].streak = streak;
    users[currentUser].availableOpens = availableOpens;
    localStorage.setItem("busloot_users", JSON.stringify(users));
  }
}

function loadUserData(username) {
  const userData = users[username];
  if (userData) {
    inventory = userData.inventory || {};
    rideCount = userData.rideCount || 0;
    streak = userData.streak || 0;
    availableOpens = userData.availableOpens || 0;
  } else {
    inventory = {};
    rideCount = 0;
    streak = 0;
    availableOpens = 0;
  }
  updateUI();
}

function updateUI() {
  const rideCountElem = document.getElementById("rideCount");
  const streakValueElem = document.getElementById("streakValue");
  const bonusCounterElem = document.getElementById("bonusCounter");
  const userLabelElem = document.getElementById("userLabel");
  const openButton = document.getElementById("openButton");
  const startRideButton = document.getElementById("startRideButton");
  const availableOpensElem = document.getElementById("availableOpens");
  
  if (rideCountElem) rideCountElem.textContent = rideCount;
  if (streakValueElem) streakValueElem.textContent = streak;
  if (bonusCounterElem) {
    const remainingBonus = 3 - (rideCount % 3);
    bonusCounterElem.textContent = remainingBonus > 0 ? remainingBonus : 3;
  }
  
  // Hiển thị số lượt mở có sẵn
  if (availableOpensElem) {
    availableOpensElem.textContent = availableOpens;
  }
  
  if (currentUser && users[currentUser]) {
    if (userLabelElem) {
      userLabelElem.innerHTML = `👤 ${currentUser} • ${users[currentUser].school || "Unknown"}`;
    }
    if (openButton) openButton.disabled = !(availableOpens > 0);
    if (startRideButton) startRideButton.disabled = rideInProgress;
  } else {
    if (userLabelElem) userLabelElem.innerHTML = "Chưa đăng nhập";
    if (openButton) openButton.disabled = true;
    if (startRideButton) startRideButton.disabled = true;
  }
  
  updateInventoryDisplay();
  updateTradeSelect();
  updateLeaderboard();
  updateCollectionSummary();
}

function addStickerToInventory(sticker, rarity) {
  const key = `${rarity}_${sticker.id}`;
  if (!inventory[key]) {
    inventory[key] = { ...sticker, rarity, count: 0 };
  }
  inventory[key].count++;
  saveData();
  updateUI();
}

function updateInventoryDisplay() {
  const grid = document.getElementById("inventoryGrid");
  if (!grid) return;
  
  grid.innerHTML = "";
  const stickers = Object.values(inventory);
  
  if (stickers.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; opacity: 0.5;">Chưa có sticker nào. Hãy mở capsule!</div>';
    return;
  }
  
  stickers.forEach(sticker => {
    const tile = document.createElement("div");
    tile.className = "inventory-tile";
    tile.innerHTML = `
      <div class="tile-badge ${sticker.rarity}"></div>
      <div class="tile-art">${sticker.icon}</div>
      <div class="tile-name">${sticker.name}</div>
      <div class="tile-count">x${sticker.count}</div>
    `;
    grid.appendChild(tile);
  });
}

function updateCollectionSummary() {
  const totalStickers = Object.keys(STICKERS_DB).reduce((sum, rarity) => sum + STICKERS_DB[rarity].length, 0);
  const collectedStickers = Object.keys(inventory).length;
  const percentage = totalStickers > 0 ? Math.round((collectedStickers / totalStickers) * 100) : 0;
  const summaryElem = document.getElementById("collectionSummary");
  if (summaryElem) {
    summaryElem.textContent = `${collectedStickers} sticker khác nhau • Completion ${percentage}%`;
  }
}

function updateTradeSelect() {
  const select = document.getElementById("tradeSelect");
  if (!select) return;
  
  select.innerHTML = '<option value="">Chọn sticker để trade</option>';
  Object.entries(inventory).forEach(([key, sticker]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${sticker.icon} ${sticker.name} (x${sticker.count}) - ${sticker.rarity.toUpperCase()}`;
    select.appendChild(option);
  });
}

function updateLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");
  if (!leaderboardList) return;
  
  const sortedUsers = Object.entries(users)
    .map(([username, data]) => ({
      username,
      score: Object.values(data.inventory || {}).reduce((sum, s) => sum + s.count, 0),
      school: data.school || "Unknown"
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  if (sortedUsers.length === 0) {
    leaderboardList.innerHTML = '<div style="text-align: center; opacity: 0.5;">Chưa có người chơi</div>';
    return;
  }
  
  leaderboardList.innerHTML = sortedUsers.map((user, idx) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${idx + 1}</span>
      <span class="leaderboard-name">${user.username} (${user.school})</span>
      <span class="leaderboard-score">${user.score} stickers</span>
    </div>
  `).join("");
}

// ---------- PLAY SOUND EFFECT ----------
function playSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.15;
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
    oscillator.stop(audioCtx.currentTime + 0.5);
    audioCtx.resume();
  } catch(e) {}
}

// ---------- CAPSULE OPENING (WITH FULL ANIMATION) ----------
async function openCapsule() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập trước!");
    return;
  }
  if (availableOpens <= 0) {
    showToast("Bạn chưa có lượt mở! Hãy bắt đầu chuyến đi trước.");
    return;
  }
  
  const openBtn = document.getElementById("openButton");
  const lootSlot = document.getElementById("lootSlot");
  
  if (!openBtn || !lootSlot) return;
  
  openBtn.disabled = true;
  
  // Animation: shake capsule
  const lootPanel = document.querySelector(".loot-panel");
  if (lootPanel) lootPanel.classList.add("capsule-shake");
  
  // Show loading với hiệu ứng đẹp
  lootSlot.innerHTML = `
    <div style="text-align: center;">
      <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #f5af19; border-right-color: #f12711; animation: spin 0.8s linear infinite;"></div>
      <p style="margin-top: 16px; font-size: 14px;">🎁 Đang mở capsule... 🎁</p>
      <p style="font-size: 12px; opacity: 0.7;">Điều bất ngờ đang đến!</p>
    </div>
  `;
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Roll rarity and get sticker
  const rarity = rollRarity();
  const sticker = getRandomSticker(rarity);
  const rarityConfig = RARITY_CONFIG.find(r => r.name === rarity);
  const rarityDisplay = rarityConfig ? rarityConfig.display : rarity;
  const rarityColor = rarityConfig ? rarityConfig.color : "#fff";
  
  // Giảm lượt mở
  availableOpens--;
  
  // Add to inventory
  addStickerToInventory(sticker, rarity);
  
  // Play sound
  playSound();
  
  // Flash effect based on rarity
  const colors = {
    uncommon: "#28a745",
    rare: "#007bff",
    epic: "#9b59b6",
    legendary: "#f39c12",
    mythic: "#e84393",
    secret: "#f1c40f",
    impossible: "#ff0066"
  };
  
  if (colors[rarity]) {
    const originalBg = document.body.style.background;
    document.body.style.transition = "background 0.2s";
    document.body.style.background = colors[rarity];
    setTimeout(() => {
      document.body.style.background = originalBg;
    }, 300);
  }
  
  // Remove shake
  if (lootPanel) lootPanel.classList.remove("capsule-shake");
  
  // Tạo hiệu ứng confetti cho sticker hiếm
  if (rarity === "legendary" || rarity === "mythic" || rarity === "impossible") {
    createConfetti();
  }
  
  // Display result with animation
  lootSlot.innerHTML = `
    <div style="text-align: center; animation: fadeInScale 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
      <div style="font-size: 80px; margin-bottom: 12px; filter: drop-shadow(0 0 10px ${rarityColor});">${sticker.icon}</div>
      <div class="sticker-name" style="font-size: 22px; font-weight: bold; margin-bottom: 8px; color: ${rarityColor};">${sticker.name}</div>
      <div class="sticker-rarity ${rarity}" style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; background: ${rarityColor}; color: white;">${rarityDisplay}</div>
      <div class="sticker-desc" style="font-size: 13px; margin-top: 12px; opacity: 0.9;">✨ ${sticker.desc} ✨</div>
      <div style="margin-top: 20px; font-size: 12px; opacity: 0.6;">🎉 Đã thêm vào bộ sưu tập! 🎉</div>
    </div>
  `;
  
  openBtn.disabled = false;
  showToast(`🎉 Bạn nhận được: ${sticker.name} (${rarityDisplay})! 🎉`);
  saveData();
}

// ---------- CONFETTI EFFECT ----------
function createConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f5af19', '#f12711'];
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: 1500 + Math.random() * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => confetti.remove();
  }
}

// ---------- RIDE FUNCTIONS (SIMPLIFIED, NO GPS) ----------
function startRide() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập!");
    return;
  }
  
  if (rideInProgress) {
    showToast("Đã có chuyến đi đang diễn ra!");
    return;
  }
  
  rideInProgress = true;
  
  const startBtn = document.getElementById("startRideButton");
  const openBtn = document.getElementById("openButton");
  const rideStatus = document.getElementById("rideStatus");
  
  if (startBtn) startBtn.disabled = true;
  if (openBtn) openBtn.disabled = true;
  if (rideStatus) rideStatus.innerHTML = "🚌 Đang trên xe... Hãy chờ 10 giây để hoàn thành chuyến đi! 🚌";
  
  showToast("🚀 Chuyến đi bắt đầu! Hãy tận hưởng hành trình...");
  
  // Tạo hiệu ứng đếm ngược
  let countdown = 10;
  const interval = setInterval(() => {
    if (rideStatus && rideInProgress) {
      rideStatus.innerHTML = `⏳ Đang trên xe... Hoàn thành sau ${countdown} giây ⏳`;
    }
    countdown--;
    if (countdown < 0) clearInterval(interval);
  }, 1000);
  
  // Auto complete after 10 seconds
  if (rideTimer) clearTimeout(rideTimer);
  rideTimer = setTimeout(() => {
    completeRide();
    clearInterval(interval);
  }, 10000);
}

function completeRide() {
  if (!rideInProgress) return;
  
  rideInProgress = false;
  rideCount++;
  streak++;
  
  // Thêm lượt mở capsule
  availableOpens++;
  
  if (rideTimer) {
    clearTimeout(rideTimer);
    rideTimer = null;
  }
  
  saveData();
  updateUI();
  
  const startBtn = document.getElementById("startRideButton");
  const openBtn = document.getElementById("openButton");
  const rideStatus = document.getElementById("rideStatus");
  
  if (startBtn) startBtn.disabled = false;
  if (openBtn) openBtn.disabled = false;
  if (rideStatus) rideStatus.innerHTML = "✅ Chuyến đi hoàn thành! Bạn có 1 lượt mở capsule. ✅";
  
  // Hiệu ứng hoàn thành
  const lootPanel = document.querySelector(".loot-panel");
  if (lootPanel) {
    lootPanel.style.animation = 'none';
    lootPanel.offsetHeight;
    lootPanel.style.animation = 'fadeInScale 0.5s ease';
  }
  
  showToast(`🎉 Hoàn thành chuyến đi! +1 lượt mở capsule. Tổng chuyến: ${rideCount} 🎉`);
}

// ---------- AUTHENTICATION ----------
function showAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.remove("hidden");
}

function hideAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.add("hidden");
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername");
  const password = document.getElementById("loginPassword");
  const authMessage = document.getElementById("authMessage");
  
  if (!username || !password) return;
  
  const usernameVal = username.value.trim();
  const passwordVal = password.value;
  
  if (!usernameVal || !passwordVal) {
    if (authMessage) authMessage.textContent = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }
  
  if (!users[usernameVal] || users[usernameVal].password !== passwordVal) {
    if (authMessage) authMessage.textContent = "Sai tên đăng nhập hoặc mật khẩu!";
    return;
  }
  
  currentUser = usernameVal;
  loadUserData(usernameVal);
  hideAuthModal();
  showToast(`Chào mừng ${usernameVal} trở lại!`);
}

function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername");
  const password = document.getElementById("signupPassword");
  const confirm = document.getElementById("signupConfirm");
  const school = document.getElementById("signupSchool");
  const authMessage = document.getElementById("authMessageSignup");
  
  if (!username || !password || !confirm || !school) return;
  
  const usernameVal = username.value.trim();
  const passwordVal = password.value;
  const confirmVal = confirm.value;
  const schoolVal = school.value;
  
  if (!usernameVal || !passwordVal) {
    if (authMessage) authMessage.textContent = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }
  
  if (passwordVal !== confirmVal) {
    if (authMessage) authMessage.textContent = "Mật khẩu không khớp!";
    return;
  }
  
  if (users[usernameVal]) {
    if (authMessage) authMessage.textContent = "Tên người dùng đã tồn tại!";
    return;
  }
  
  users[usernameVal] = {
    password: passwordVal,
    school: schoolVal,
    inventory: {},
    rideCount: 0,
    streak: 0,
    availableOpens: 0
  };
  
  currentUser = usernameVal;
  loadUserData(usernameVal);
  hideAuthModal();
  showToast(`Đăng ký thành công! Chào mừng ${usernameVal}`);
}

function shareGame() {
  if (navigator.share) {
    navigator.share({
      title: "BusLoot",
      text: "Tham gia BusLoot - Biến mỗi chuyến xe buýt thành loot drop cực chất!",
      url: window.location.href
    }).catch(() => {
      copyShareLink();
    });
  } else {
    copyShareLink();
  }
}

function copyShareLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast("Đã copy link! Hãy gửi cho bạn bè.");
  }).catch(() => {
    showToast("Không thể copy link!");
  });
}

// ---------- TRADE FUNCTION ----------
function proposeTrade() {
  const selectedKey = document.getElementById("tradeSelect").value;
  if (!selectedKey) {
    showToast("Vui lòng chọn sticker để trade!");
    return;
  }
  
  const sticker = inventory[selectedKey];
  if (!sticker || sticker.count < 2) {
    showToast("Bạn cần ít nhất 2 sticker này để trade!");
    return;
  }
  
  const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "secret"];
  const currentIdx = rarityOrder.indexOf(sticker.rarity);
  const targetRarity = rarityOrder[Math.min(currentIdx + 1, rarityOrder.length - 1)];
  
  if (targetRarity === sticker.rarity) {
    showToast("Sticker này đã ở cấp cao nhất, không thể trade lên!");
    return;
  }
  
  const tradeOffer = document.getElementById("tradeOffer");
  if (!tradeOffer) return;
  
  tradeOffer.innerHTML = `
    <div style="text-align: center; animation: fadeInScale 0.4s;">
      <div style="font-size: 48px; margin-bottom: 12px;">🔄</div>
      <p><strong>Đề xuất trade:</strong></p>
      <p>${sticker.icon} ${sticker.name} (${sticker.rarity}) x2</p>
      <p>⬇️ Nhận ⬇️</p>
      <p>🎁 1 sticker ${targetRarity.toUpperCase()} ngẫu nhiên</p>
      <button id="acceptTradeBtn" class="primary" style="margin-top: 16px;">Chấp nhận</button>
      <button id="cancelTradeBtn" class="secondary" style="margin-top: 16px; margin-left: 8px;">Hủy</button>
    </div>
  `;
  
  const acceptBtn = document.getElementById("acceptTradeBtn");
  const cancelBtn = document.getElementById("cancelTradeBtn");
  
  if (acceptBtn) {
    acceptBtn.onclick = () => {
      if (inventory[selectedKey] && inventory[selectedKey].count >= 2) {
        inventory[selectedKey].count -= 2;
        if (inventory[selectedKey].count === 0) {
          delete inventory[selectedKey];
        }
        
        const newSticker = getRandomSticker(targetRarity);
        addStickerToInventory(newSticker, targetRarity);
        saveData();
        updateUI();
        showToast(`Trade thành công! Nhận được: ${newSticker.name}`);
        if (tradeOffer) tradeOffer.innerHTML = '<div class="trade-empty">Trade hoàn tất!</div>';
      } else {
        showToast("Không đủ sticker để trade!");
      }
    };
  }
  
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      if (tradeOffer) tradeOffer.innerHTML = '<div class="trade-empty">Đã hủy đề xuất trade.</div>';
    };
  }
}

// ---------- EVENT LISTENERS ----------
document.addEventListener("DOMContentLoaded", () => {
  // Thêm element hiển thị số lượt mở vào HTML nếu chưa có
  const statsRow = document.querySelector(".stats-row");
  if (statsRow && !document.getElementById("availableOpens")) {
    const newStatCard = document.createElement("div");
    newStatCard.className = "stat-card";
    newStatCard.innerHTML = `
      <span class="stat-label">🎁 Lượt mở</span>
      <strong id="availableOpens">0</strong>
    `;
    statsRow.appendChild(newStatCard);
  }
  
  // Auth
  const toggleAuthBtn = document.getElementById("toggleAuthButton");
  const closeAuthBtn = document.getElementById("closeAuthButton");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const authLoginTab = document.getElementById("authLoginTab");
  const authSignupTab = document.getElementById("authSignupTab");
  
  if (toggleAuthBtn) toggleAuthBtn.addEventListener("click", showAuthModal);
  if (closeAuthBtn) closeAuthBtn.addEventListener("click", hideAuthModal);
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (signupForm) signupForm.addEventListener("submit", handleSignup);
  
  if (authLoginTab) {
    authLoginTab.addEventListener("click", () => {
      authLoginTab.classList.add("active");
      if (authSignupTab) authSignupTab.classList.remove("active");
      if (loginForm) loginForm.classList.remove("hidden");
      if (signupForm) signupForm.classList.add("hidden");
    });
  }
  
  if (authSignupTab) {
    authSignupTab.addEventListener("click", () => {
      authSignupTab.classList.add("active");
      if (authLoginTab) authLoginTab.classList.remove("active");
      if (signupForm) signupForm.classList.remove("hidden");
      if (loginForm) loginForm.classList.add("hidden");
    });
  }
  
  // Game actions
  const openBtn = document.getElementById("openButton");
  const startRideBtn = document.getElementById("startRideButton");
  const inventoryBtn = document.getElementById("inventoryButton");
  const shareBtn = document.getElementById("shareButton");
  const tradeBtn = document.getElementById("tradeButton");
  
  // Ẩn/hiệu các button không cần thiết
  const checkLocationBtn = document.getElementById("checkLocationButton");
  const scanBtn = document.getElementById("scanButton");
  if (checkLocationBtn) checkLocationBtn.style.display = "none";
  if (scanBtn) scanBtn.style.display = "none";
  
  // Cập nhật text cho location status
  const locationStatus = document.getElementById("locationStatus");
  if (locationStatus) {
    locationStatus.innerHTML = "🎮 Chế độ demo: Không cần định vị!";
  }
  
  const rideStatus = document.getElementById("rideStatus");
  if (rideStatus) {
    rideStatus.innerHTML = "✨ Nhấn 'Bắt đầu chuyến đi', chờ 10 giây để nhận 1 lượt mở capsule! ✨";
  }
  
  if (openBtn) openBtn.addEventListener("click", openCapsule);
  if (startRideBtn) startRideBtn.addEventListener("click", startRide);
  if (inventoryBtn) {
    inventoryBtn.addEventListener("click", () => {
      const inventoryPanel = document.getElementById("inventoryPanel");
      if (inventoryPanel) inventoryPanel.scrollIntoView({ behavior: "smooth" });
    });
  }
  if (shareBtn) shareBtn.addEventListener("click", shareGame);
  if (tradeBtn) tradeBtn.addEventListener("click", proposeTrade);
  
  // Initial UI update
  updateUI();
  
  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.5) rotate(-10deg);
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }
    @keyframes capsuleShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px) rotate(-5deg); }
      75% { transform: translateX(10px) rotate(5deg); }
    }
    .capsule-shake {
      animation: capsuleShake 0.5s ease;
    }
  `;
  document.head.appendChild(style);
});