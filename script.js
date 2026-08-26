const weaponsList = [
    { name: "Камень", img: "stone.png", power: 1, cost: 25 },
    { name: "Каменная кирка", img: "https://iconify.design", power: 3, cost: 50 },
    { name: "Металлическая кирка", img: "https://iconify.design", power: 10, cost: 200 },
    { name: "Револьвер", img: "https://iconify.design", power: 50, cost: 1000 },
    { name: "Автомат AK-47", img: "https://iconify.design", power: 250, cost: 0 }
];

// Базовые боты для таблицы лидеров
let bots = [
    { name: "Zloi_Clan_Leader", score: 450, isPlayer: false },
    { name: "Bezymniy_Max", score: 180, isPlayer: false },
    { name: "Pudge_Rust", score: 60, isPlayer: false },
    { name: "Noob_Na_Plyaje", score: 12, isPlayer: false }
];

let score = parseInt(localStorage.getItem('r_score_v4')) || 0;
let totalScraps = parseInt(localStorage.getItem('r_total_v4')) || 0;
let weaponIdx = parseInt(localStorage.getItem('r_wep_v4')) || 0;
let autoPower = parseInt(localStorage.getItem('r_ap_v4')) || 0;
let autoPrice = parseInt(localStorage.getItem('r_aprice_v4')) || 50;
let savedNick = localStorage.getItem('r_nick_v4') || "Выживший";

const scoreEl = document.getElementById('score');
const totalScrapsEl = document.getElementById('total-scraps');
const rankEl = document.getElementById('rank');
const profileWeaponEl = document.getElementById('profile-weapon');
const nicknameInput = document.getElementById('nickname');
const tapTarget = document.getElementById('tap-target');
const weaponImgEl = document.getElementById('weapon-img');
const buyWeaponBtn = document.getElementById('buy-weapon-up');
const buyAutoBtn = document.getElementById('buy-auto');
const leaderboardList = document.getElementById('leaderboard-list');

// Кнопки и табы
const gameTabBtn = document.getElementById('tab-game-btn');
const profileTabBtn = document.getElementById('tab-profile-btn');
const leaderTabBtn = document.getElementById('tab-leader-btn');
const gameTab = document.getElementById('tab-game');
const profileTab = document.getElementById('tab-profile');
const leaderTab = document.getElementById('tab-leader');

// Переключение табов
function switchTab(activeBtn, activeTab) {
    [gameTabBtn, profileTabBtn, leaderTabBtn].forEach(btn => btn.classList.remove('active'));
    [gameTab, profileTab, leaderTab].forEach(tab => tab.classList.remove('active'));
    activeBtn.classList.add('active');
    activeTab.classList.add('active');
    if (activeTab === leaderTab) updateLeaderboard();
}

gameTabBtn.addEventListener('click', () => switchTab(gameTabBtn, gameTab));
profileTabBtn.addEventListener('click', () => switchTab(profileTabBtn, profileTab));
leaderTabBtn.addEventListener('click', () => switchTab(leaderTabBtn, leaderTab));

nicknameInput.value = savedNick;
nicknameInput.addEventListener('input', () => {
    localStorage.setItem('r_nick_v4', nicknameInput.value);
    updateLeaderboard();
});

function getRank(total) {
    if (total < 100) return "Кепка на пляже 🪨";
    if (total < 500) return "Лутер 🎒";
    if (total < 2000) return "Житель Сарая 🏚️";
    if (total < 10000) return "Рейдер 🔫";
    return "Хозяин Рокетной 🏯";
}

// Функция сортировки и отрисовки таблицы лидеров
function updateLeaderboard() {
    leaderboardList.innerHTML = "";
    
    // Создаем единый список из игрока и ботов
    let allPlayers = [...bots, { name: nicknameInput.value || "Выживший", score: totalScraps, isPlayer: true }];
    
    // Сортируем по убыванию скрапа
    allPlayers.sort((a, b) => b.score - a.score);
    
    // Выводим на экран
    allPlayers.forEach((player, index) => {
        let place = index + 1;
        let row = document.createElement('div');
        row.className = `leader-item`;
        
        // Разные стили для топ-мест и игрока
        if (player.isPlayer) row.classList.add('player-row');
        if (place === 1) row.classList.add('top-1');
        if (place === 2) row.classList.add('top-2');
        if (place === 3) row.classList.add('top-3');
        
        let medal = place === 1 ? "🥇 " : place === 2 ? "🥈 " : place === 3 ? "🥉 " : "";
        
        row.innerHTML = `
            <div class="leader-left">
                <span class="leader-place">${place}</span>
                <span class="leader-name">${medal}${player.name} ${player.isPlayer ? '(Ты)' : ''}</span>
            </div>
            <span class="leader-score">${player.score}</span>
        `;
        leaderboardList.appendChild(row);
    });
}

function updateUI() {
    let currentWep = weaponsList[weaponIdx];
    let nextWep = weaponsList[weaponIdx + 1];

    scoreEl.textContent = score;
    totalScrapsEl.textContent = totalScraps;
    rankEl.textContent = getRank(totalScraps);
    profileWeaponEl.textContent = currentWep.name;

    if (weaponIdx === 0) {
        weaponImgEl.src = "stone.png";
    } else {
        weaponImgEl.src = currentWep.img;
    }

    if (nextWep) {
        buyWeaponBtn.innerHTML = `🔥 Скрафтить: ${nextWep.name} (+${nextWep.power} за тап) <br> Цена: ${currentWep.cost} скрапа`;
    } else {
        buyWeaponBtn.innerHTML = "🎉 Топовый АК-47 скрафчен!";
    }

    buyAutoBtn.innerHTML = `Купить Малую Печь (+${autoPower + 1}/сек) <br> Цена: ${autoPrice} скрапа`;
}

function saveGame() {
    localStorage.setItem('r_score_v4', score);
    localStorage.setItem('r_total_v4', totalScraps);
    localStorage.setItem('r_wep_v4', weaponIdx);
    localStorage.setItem('r_ap_v4', autoPower);
    localStorage.setItem('r_aprice_v4', autoPrice);
}

// Тап
tapTarget.addEventListener('click', () => {
    score += weaponsList[weaponIdx].power;
    totalScraps += weaponsList[weaponIdx].power;
    updateUI(); saveGame();
});

// Крафт пушек
buyWeaponBtn.addEventListener('click', () => {
    let currentWep = weaponsList[weaponIdx];
    if (weaponIdx < weaponsList.length - 1 && score >= currentWep.cost) {
        score -= currentWep.cost;
        weaponIdx += 1;
        updateUI(); saveGame();
    } else if (weaponIdx < weaponsList.length - 1) {
        alert('Не хватает скрапа!');
    }
});

// Печка
buyAutoBtn.addEventListener('click', () => {
    if (score >= autoPrice) {
        score -= autoPrice; autoPower += 1; autoPrice = Math.floor(autoPrice * 1.7);
        updateUI(); saveGame();
    } else {
        alert('Не хватает скрапа!');
    }
});

// Пассивный доход + симуляция кликов ботов
setInterval(() => {
    if (autoPower > 0) {
        score += autoPower; totalScraps += autoPower;
    }
    
    // Боты тоже понемногу кликают, чтобы создать конкуренцию!
    bots[0].score += Math.floor(Math.random() * 2); // Глава клана фармит быстро
    bots[1].score += Math.floor(Math.random() * 2) > 0 ? 1 : 0;
    bots[2].score += Math.floor(Math.random() * 3) > 1 ? 1 : 0;
    
    updateUI(); 
    saveGame();
    
    // Если открыта вкладка топа — обновляем её на лету
    if (leaderTab.classList.contains('active')) updateLeaderboard();
}, 1000);

updateUI();
