let state = {
	dango: 0,
	totalDango: 0,
	wave: 1,
	loop: 1,
	deaths: 0,
	points: 0,
	// Combat Stats
	atk: 1, // Base damage
	spd: 1, // Attack delay multiplier
	currentHp: 50,
	maxHp: 50,
	regenInterval: 0,
	def: 0, // Now represents damage reduction
	// Inventory
	ownedGuns: [0], // Index of unlocked guns
	currentGun: 0,
	ownedArmor: [0], // Index of unlocked armor (0 = none)
	currentArmor: 0,
	ownedBullet: [0], // Index of unlocked bullets (0 = none)
	currentBullet: 0,
	grenades: 0,
	inventory: {
		medkit: 0,
		bigMedkit: 0,
		regenkit: 0,
	},
	// Shop
	shopOpen: false,
	lang: "ENG",
	costs: {
		atk: 10,
		spd: 10,
		hp: 10,
	},
};

const BASE_PLAYER_ATTACK_SPEED = 2.0;
const ENEMY_ATTACK_INTERVAL = 2.0;
const GRENADE_ICON = `<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 26 26">
					<defs>
						<style>
							.grenade-0 {
								fill: none;
							}

							.grenade-1 {
								fill: #3e5131;
							}

							.grenade-2 {
								fill: #74846d;
							}
						</style>
					</defs>
					<rect class="grenade-0" x="16" y="6" width="2" height="2" />
					<polygon class="grenade-0" points="6 8 6 6 6 4 4 4 2 4 2 6 2 8 4 8 6 8" />
					<rect class="grenade-0" x="18" y="8" width="2" height="2" />
					<polygon class="grenade-0" points="22 10 20 10 20 12 20 14 22 14 22 12 22 10" />
					<polygon points="24 10 24 12 24 14 24 16 26 16 26 14 26 12 26 10 24 10" />
					<polygon class="grenade-1" points="24 10 22 10 22 12 22 14 24 14 24 12 24 10" />
					<rect x="22" y="8" width="2" height="2" />
					<path d="M20,16h-2v-2h2v-4h-2v2h-2v-2h-2v2h-4v-4h-2v-2h2v-2h-4v4H2v2h6v2h-2v2h2v2h-2v-2h-2v6h2v-2h2v2h2v-2h6v6h-4v-4h-2v2h-2v2h2v2h8v-2h2v-4h-2v-2h2v2h2v-6h-2v2ZM14,16h-4v-2h6v2h-2Z" />
					<rect class="grenade-1" x="20" y="8" width="2" height="2" />
					<rect x="20" y="6" width="2" height="2" />
					<rect class="grenade-1" x="18" y="18" width="2" height="2" />
					<rect class="grenade-1" x="18" y="14" width="2" height="2" />
					<rect class="grenade-1" x="18" y="6" width="2" height="2" />
					<rect class="grenade-1" x="16" y="10" width="2" height="2" />
					<rect x="16" y="8" width="2" height="2" />
					<polygon points="16 4 16 6 18 6 20 6 20 4 20 2 18 2 18 4 16 4" />
					<rect class="grenade-1" x="16" y="2" width="2" height="2" />
					<polygon points="18 2 18 0 16 0 14 0 14 2 16 2 18 2" />
					<polygon class="grenade-1" points="14 22 12 22 12 24 14 24 16 24 16 22 16 20 14 20 14 22" />
					<polygon class="grenade-2" points="14 14 12 14 10 14 10 16 12 16 14 16 16 16 16 14 14 14" />
					<rect class="grenade-1" x="14" y="8" width="2" height="2" />
					<rect class="grenade-1" x="14" y="4" width="2" height="2" />
					<rect class="grenade-2" x="14" y="2" width="2" height="2" />
					<polygon class="grenade-2" points="12 22 14 22 14 20 16 20 16 18 14 18 12 18 10 18 10 20 12 20 12 22" />
					<rect class="grenade-1" x="12" y="10" width="2" height="2" />
					<polygon class="grenade-2" points="12 8 10 8 10 10 10 12 12 12 12 10 14 10 14 8 12 8" />
					<polygon points="14 8 16 8 16 6 14 6 12 6 10 6 10 8 12 8 14 8" />
					<polygon points="14 4 14 2 12 2 10 2 10 4 12 4 14 4" />
					<polygon class="grenade-2" points="12 6 14 6 14 4 12 4 10 4 10 6 12 6" />
					<rect class="grenade-2" x="8" y="20" width="2" height="2" />
					<rect class="grenade-2" x="8" y="6" width="2" height="2" />
					<rect x="6" y="20" width="2" height="2" />
					<rect class="grenade-2" x="6" y="18" width="2" height="2" />
					<rect class="grenade-2" x="6" y="14" width="2" height="2" />
					<polygon points="6 4 6 2 4 2 2 2 2 4 4 4 6 4" />
					<polygon points="2 4 0 4 0 6 0 8 2 8 2 6 2 4" />
				</svg>`;

// Define the tiers and costs
const SHOP_ITEMS = {
	guns: [
		{
			name: "AK-74",
			speed: 1,
			cost: 50,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Stock & Grip -->
					<rect x="2" y="14" width="8" height="4" fill="#8B4513"/>
					<rect x="10" y="17" width="3" height="5" fill="#333"/>
					<!-- Receiver & Barrel -->
					<rect x="10" y="13" width="12" height="5" fill="#555"/>
					<rect x="22" y="14" width="8" height="2" fill="#222"/>
					<!-- Magazine -->
					<path d="M14 18 L12 24 L15 24 L17 18 Z" fill="#D2691E"/>
				   </svg>`,
		},
		{
			name: "AK-545",
			speed: 2,
			cost: 50,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Stock & Grip -->
					<rect x="2" y="14" width="8" height="4" fill="#444"/>
					<rect x="10" y="17" width="3" height="5" fill="#222"/>
					<!-- Receiver & Barrel -->
					<rect x="10" y="13" width="12" height="5" fill="#666"/>
					<rect x="22" y="14" width="8" height="2" fill="#333"/>
					<!-- Modern polymer mag -->
					<path d="M14 18 L12 24 L15 24 L17 18 Z" fill="#222"/>
				   </svg>`,
		},
		{
			name: "AK-105",
			speed: 3,
			cost: 500,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Folding stock folded/short stock -->
					<rect x="4" y="14" width="6" height="4" fill="#333"/>
					<rect x="10" y="17" width="3" height="5" fill="#111"/>
					<!-- Compact Receiver & Short barrel -->
					<rect x="10" y="13" width="11" height="5" fill="#444"/>
					<rect x="21" y="14" width="5" height="2" fill="#111"/>
					<rect x="26" y="13" width="2" height="4" fill="#555"/> <!-- Muzzle device -->
					<path d="M14 18 L12 24 L15 24 L17 18 Z" fill="#222"/>
				   </svg>`,
		},
		{
			name: "RPK-16",
			speed: 4,
			cost: 1000,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Heavy tactical stock -->
					<rect x="1" y="13" width="9" height="5" fill="#222"/>
					<rect x="10" y="18" width="3" height="5" fill="#111"/>
					<!-- Receiver, Long heavy barrel & bipod -->
					<rect x="10" y="12" width="12" height="6" fill="#444"/>
					<rect x="22" y="14" width="9" height="2" fill="#111"/>
					<rect x="28" y="16" width="2" height="5" fill="#333"/> <!-- Bipod legs -->
					<!-- Drum Magazine -->
					<circle cx="15" cy="21" r="4.5" fill="#222"/>
				   </svg>`,
		},
		{
			name: "NL545GP",
			speed: 5,
			cost: 2000,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Futuristic / Sci-Fi Gun -->
					<rect x="2" y="11" width="8" height="7" rx="1" fill="#00ffcc" opacity="0.3"/>
					<rect x="4" y="13" width="6" height="4" fill="#111"/>
					<rect x="10" y="17" width="3" height="5" fill="#00ffcc"/>
					<rect x="10" y="12" width="13" height="5" fill="#222"/>
					<rect x="23" y="13" width="7" height="3" fill="#00ffcc"/> <!-- Energy barrel -->
					<path d="M14 17 L13 23 L16 23 L17 17 Z" fill="#111"/>
				   </svg>`,
		},
	],
	armor: [
		{
			name: "None",
			def: 0,
			cost: 0,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Broken Shield / Red X representing no armor -->
					<path d="M6 16 L16 26 L26 16 L22 6 L10 6 Z" fill="none" stroke="#555" stroke-dasharray="3" stroke-width="2"/>
					<path d="M8 8 L24 24 M24 8 L8 24" stroke="firebrick" stroke-width="2"/>
				   </svg>`,
		},
		{
			name: "BNTI Kirasa-N",
			def: 1,
			cost: 50,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Light blue/grey police vest -->
					<path d="M8 6 L24 6 L26 12 L24 26 L8 26 L6 12 Z" fill="#4682B4"/>
					<rect x="10" y="10" width="12" height="4" fill="#2c5270"/>
					<rect x="10" y="16" width="12" height="6" fill="#2c5270"/>
				   </svg>`,
		},
		{
			name: "6B13 Assault Armor",
			def: 2,
			cost: 500,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Flora Russian Green Camo Vest -->
					<path d="M8 5 L24 5 L27 12 L24 27 L8 27 L5 12 Z" fill="#556B2F"/>
					<!-- Camo spots -->
					<path d="M10 8 Q12 12 15 8" fill="none" stroke="#8B4513" stroke-width="3"/>
					<path d="M18 18 Q20 22 22 19" fill="none" stroke="#222" stroke-width="3"/>
					<rect x="9" y="13" width="14" height="3" fill="#222"/> <!-- MOLLE straps -->
				   </svg>`,
		},
		{
			name: "IOTV Gen 4",
			def: 3,
			cost: 1000,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Heavy Tan/UCP vest with shoulder pads -->
					<path d="M8 5 L24 5 L27 12 L24 27 L8 27 L5 12 Z" fill="#D2B48C"/>
					<!-- Shoulder protectors -->
					<rect x="3" y="8" width="4" height="6" fill="#8B7D6B"/>
					<rect x="25" y="8" width="4" height="6" fill="#8B7D6B"/>
					<!-- Neck protector -->
					<rect x="11" y="2" width="10" height="3" fill="#8B7D6B"/>
					<!-- Chest plates -->
					<rect x="9" y="12" width="14" height="10" fill="#5c4e3c" opacity="0.5"/>
				   </svg>`,
		},
		{
			name: "Redut-T5",
			def: 4,
			cost: 2000,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Heavy emerald green armor with groin protector -->
					<path d="M8 4 L24 4 L28 11 L24 26 L8 26 L4 11 Z" fill="#004d40"/>
					<!-- Groin pad -->
					<path d="M12 26 L20 26 L18 31 L14 31 Z" fill="#00332c"/>
					<!-- Collar -->
					<path d="M10 4 L11 1 L21 1 L22 4 Z" fill="#00332c"/>
					<!-- Heavy straps -->
					<rect x="7" y="9" width="18" height="2" fill="#222"/>
					<rect x="7" y="15" width="18" height="2" fill="#222"/>
				   </svg>`,
		},
	],
	bullet: [
		{
			name: "FMJ",
			atk: 1,
			cost: 0,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Copper colored standard bullet -->
					<path d="M13 18 L19 18 L19 28 L13 28 Z" fill="#CD7F32"/>
					<path d="M13 18 Q16 8 19 18 Z" fill="#B87333"/>
					<rect x="12" y="28" width="8" height="2" fill="#8B4513"/>
				   </svg>`,
		},
		{
			name: "BT",
			atk: 5,
			cost: 50,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Green tip tracer bullet -->
					<path d="M13 18 L19 18 L19 28 L13 28 Z" fill="#CD7F32"/>
					<path d="M13 18 Q16 8 19 18 Z" fill="#00FF00"/> <!-- Green Tracer Tip -->
					<rect x="12" y="28" width="8" height="2" fill="#8B4513"/>
				   </svg>`,
		},
		{
			name: "BP",
			atk: 10,
			cost: 500,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Dark black AP tip bullet -->
					<path d="M13 18 L19 18 L19 28 L13 28 Z" fill="#CD7F32"/>
					<path d="M13 18 Q16 8 19 18 Z" fill="#222222"/> <!-- Black AP Tip -->
					<rect x="12" y="28" width="8" height="2" fill="#8B4513"/>
				   </svg>`,
		},
		{
			name: "BS",
			atk: 20,
			cost: 1000,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Silver/Grey tungsten core bullet -->
					<path d="M13 18 L19 18 L19 28 L13 28 Z" fill="#CD7F32"/>
					<path d="M13 18 Q16 8 19 18 Z" fill="#C0C0C0"/> <!-- Silver Tip -->
					<rect x="12" y="28" width="8" height="2" fill="#8B4513"/>
				   </svg>`,
		},
		{
			name: "PPBS Igolnik",
			atk: 50,
			cost: 2000,
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<!-- Glowing Purple sci-fi needle bullet -->
					<path d="M13 18 L19 18 L19 28 L13 28 Z" fill="#444"/>
					<path d="M13 18 Q16 4 19 18 Z" fill="#8A2BE2"/> <!-- Purple needle tip -->
					<rect x="12" y="28" width="8" height="2" fill="#8A2BE2" opacity="0.6"/>
				   </svg>`,
		},
	],
	consumables: [
		{
			id: "medkit",
			nameKey: "medLabel", // Links to i18n key
			cost: 20,
			heal: 15,
			type: "instant",
			desc: "+15 HP",
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<rect x="4" y="8" width="24" height="20" rx="2" fill="white"/>
					<rect x="11" y="2" width="10" height="6" fill="white"/>
					<rect x="14" y="13" width="4" height="10" fill="black"/>
					<rect x="11" y="16" width="10" height="4" fill="black"/>
				   </svg>`,
		},
		{
			id: "bigMedkit",
			nameKey: "bigMedLabel", // Links to i18n key
			cost: 50,
			heal: 40,
			type: "instant",
			desc: "+40 HP",
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<rect x="4" y="8" width="24" height="20" rx="2" fill="FireBrick"/>
					<rect x="11" y="2" width="10" height="6" fill="darkred"/>
					<rect x="14" y="13" width="4" height="10" fill="white"/>
					<rect x="11" y="16" width="10" height="4" fill="white"/>
				   </svg>`,
		},
		{
			id: "regenkit",
			nameKey: "regenLabel", // Links to i18n key
			cost: 30,
			heal: 30,
			duration: 30, // 30 seconds
			type: "regen",
			desc: "+30 HP / 30s",
			icon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
					<rect x="4" y="8" width="24" height="20" rx="2" fill="lightblue"/>
					<rect x="11" y="2" width="10" height="6" fill="lightblue"/>
					<circle cx="16" cy="18" r="6" fill="none" stroke="black" stroke-width="2"/>
					<path d="M16 14v8M13 17h6" stroke="black" stroke-width="2"/>
				   </svg>`,
		},
	],
};
let enemy = {maxHp: 20, currentHp: 20, atk: 1, isBoss: false, isDead: false};
let attackTimer = 0;
let enemyAttackTimer = 0;

const i18n = {
	ENG: {
		consumables: "Consumables",
		creatorLabel: "Escape with PuniPuni was made by",
		wave: "Wave",
		loop: "Loop",
		dango: "Dango",
		grenadeLabel: "Grenades",
		medLabel: "Med Kit",
		bigMedLabel: "Big Med Kit",
		regenLabel: "Regen Kit",
		totalPoints: "Total Points",
		pause: "Pause",
		resume: "Resume",
		paused: "PAUSED",
		win: "YOU WIN!",
		playerStats: "Player Stats",
		upgrades: "Equipment",
		atkLabel: "Attack",
		spdLabel: "Speed",
		defLabel: "Defense",
		points: "Points",
		deaths: "Deaths",
		shpLabel: "Shop",
		gunLabel: "Gun",
		armorLabel: "Armor",
		bulletLabel: "Bullet",
		mdlshpLabel: "Shop",
		mdlgunLabel: "Gun",
		mdlarmorLabel: "Armor",
		mdlbulletLabel: "Bullet",
		mdlcloseLabel: "Close",
		saveScoreLabel: "Save Score",
		leaderboard: "Leaderboard",
		namePlaceholder: "Enter your name",
		highScoresLabel: "Global High Scores",
		noScores: "No global scores yet!",
		failedScores: "Failed to load global scores.",
		qtyLabel: "Owned:",
		tooltip: "Escape from Tarkov is a registered trademark of Battlestate Games. This project is not affiliated with, endorsed by, or sponsored by the developer.",
	},
	JPN: {
		consumables: "消耗品",
		creatorLabel: "ぷにぷにとの脱出は",
		leaderboard: "ランキング ",
		saveScoreLabel: "スコアを保存",
		namePlaceholder: "名前を入力してください",
		highScoresLabel: "世界のハイスコア",
		noScores: "まだ世界のスコアがありません！",
		failedScores: "スコアの読み込みに失敗しました。",
		wave: "ウェーブ",
		loop: "ループ",
		dango: "団子",
		grenadeLabel: "手榴弾",
		bigMedLabel: "大救急キット",
		medLabel: "救急キット",
		regenLabel: "再生キット",
		totalPoints: "合計スコア",
		pause: "一時停止",
		resume: "再開",
		paused: "一時停止中",
		win: "勝利!",
		playerStats: "ステータス",
		upgrades: "装備",
		atkLabel: "攻撃力",
		spdLabel: "速度",
		defLabel: "防衛",
		points: "ポイント",
		deaths: "死亡数",
		shpLabel: "店",
		gunLabel: "銃",
		armorLabel: "鎧",
		bulletLabel: "弾丸",
		medLabel: "救急キット",
		mdlshpLabel: "店",
		mdlgunLabel: "銃",
		mdlarmorLabel: "鎧",
		mdlbulletLabel: "弾丸",
		mdlcloseLabel: "閉じる",
		qtyLabel: "所持数:",
		tooltip: "Escape from TarkovはBattlestate Gamesの登録商標です。本プロジェクトは、開発元とは一切関係がなく、開発元による承認や後援も受けていません。",
	},
};

function setLang(lang) {
	state.lang = lang;
	updateUI();
	renderConsumables();
	if (state.shopOpen) renderShop();
	if (state.leaderboardOpen) fetchLeaderboard();
}

// Start the loop safely
requestAnimationFrame((time) => {
	lastTime = time;
	requestAnimationFrame(update);
});

// Only touches classList if the value actually changed — avoids 60x/sec DOM churn and flicker
function setDisabled(el, isDisabled) {
	if (!el) return;
	const current = el.classList.contains("disabled");
	if (current !== isDisabled) {
		el.classList.toggle("disabled", isDisabled);
	}
}

// 1. Logic to hide the start screen and initiate gameplay loops
function startGame() {
	const startScreen = document.getElementById("start-screen");
	startScreen.style.opacity = "0";

	setTimeout(() => {
		startScreen.style.display = "none";
	}, 500);

	// --- ADD THESE TO BOOT THE GAME ---
	state.isDead = false;
	spawnEnemy(); // Triggers your enemy spawning mechanism
}

// Update the start screen itself whenever setLang() runs
// Add these new target updates directly into your existing updateUI() function
function updateUI() {
	const currentLang = i18n[state.lang];

	// Update main buttons
	document.getElementById("btn-start").innerText = currentLang.start || "Start Game";

	const t = i18n[state.lang];

	const winId = document.getElementById("win-id");
	if (winId) winId.innerText = t.win;

	const winTotalPoints = document.getElementById("win-totalPoints");
	if (winTotalPoints) winTotalPoints.innerText = t.totalPoints;

	const saveBtn = document.getElementById("save-score-btn");
	if (saveBtn) saveBtn.innerText = t.saveScoreLabel;

	const playerNameInput = document.getElementById("player-name");
	if (playerNameInput) playerNameInput.placeholder = t.namePlaceholder;

	const highscoresEl = document.getElementById("highscores");
	if (highscoresEl) highscoresEl.innerText = t.highScoresLabel;

	const closeBtn2 = document.getElementById("closebtn-label2");
	if (closeBtn2) closeBtn2.innerText = t.mdlcloseLabel;
	document.getElementById("creatorLabel").innerText = t.creatorLabel;
	document.getElementById("txt-wave").innerText = t.wave;
	document.getElementById("txt-loop").innerText = t.loop;
	document.getElementById("txt-dango").innerText = t.dango;
	document.getElementById("txt-playerStats").innerText = t.playerStats;
	document.getElementById("txt-upgrades").innerText = t.upgrades;
	document.getElementById("txt-consumables").innerText = t.consumables;
	document.getElementById("btn-leaderboard").innerText = t.leaderboard;
	document.getElementById("txt-atkLabel").innerText = t.atkLabel;
	document.getElementById("txt-defLabel").innerText = t.defLabel;
	document.getElementById("txt-shpLabel").innerText = t.shpLabel;
	document.getElementById("shptxt-shpLabel").innerText = t.mdlshpLabel;
	document.getElementById("closebtn-label").innerText = t.mdlcloseLabel;
	document.getElementById("shptxt-medLabel").innerText = t.medLabel;
	document.getElementById("shptxt-armorLabel").innerText = t.mdlarmorLabel;
	document.getElementById("shptxt-gunLabel").innerText = t.mdlgunLabel;
	document.getElementById("shptxt-bulletsLabel").innerText = t.mdlbulletLabel;
	document.getElementById("txt-spdLabel").innerText = t.spdLabel;
	document.getElementById("tooltip-label").innerText = t.tooltip;
	document.getElementById("txt-points").innerText = t.points;
	document.getElementById("txt-deaths").innerText = t.deaths;
	document.getElementById("btn-pause").innerText = state.paused ? t.resume : t.pause;
	document.getElementById("pause-screen").innerText = state.paused ? t.paused : "";
	document.getElementById("pause-screen").style.opacity = state.paused ? "1" : "0";
	document.getElementById("ui-points").innerText = Math.floor(state.points);
	document.getElementById("ui-deaths").innerText = state.deaths;
	document.getElementById("ui-wave").innerText = state.wave;
	document.getElementById("ui-loop").innerText = state.loop;
	document.getElementById("ui-dango").innerText = Math.floor(state.dango);
	document.getElementById("stat-atk").innerText = state.atk;
	document.getElementById("stat-spd").innerText = state.spd;
	document.getElementById("stat-defence").innerText = state.def;
	document.getElementById("player-hp-text").innerText = Math.max(0, Math.floor(state.currentHp)) + "/" + state.maxHp;
	document.getElementById("enemy-hp-text").innerText = Math.max(0, Math.floor(enemy.currentHp)) + "/" + enemy.maxHp;
	document.getElementById("player-hp-fill").style.width = Math.max(0, (state.currentHp / state.maxHp) * 100) + "%";
	document.getElementById("enemy-hp-fill").style.width = Math.max(0, (enemy.currentHp / enemy.maxHp) * 100) + "%";

	document.getElementById("player-hp-fill").style.width = Math.max(0, (state.currentHp / state.maxHp) * 100) + "%";
	document.getElementById("enemy-hp-fill").style.width = Math.max(0, (enemy.currentHp / enemy.maxHp) * 100) + "%";
	// --- Consumables HUD ---
	document.getElementById("txt-medkitLabel").innerText = t.medLabel;
	document.getElementById("txt-bigmedkitLabel").innerText = t.bigMedLabel;
	document.getElementById("txt-regenkitLabel").innerText = t.regenLabel;
	document.getElementById("txt-grenadeLabel").innerText = t.grenadeLabel;
	document.querySelectorAll(".txt-qtyLabel").forEach((element) => {
		// Keeps the nested quantity number span safe while replacing the prefix text
		const qtySpan = element.querySelector(".text");
		element.textContent = i18n[state.lang].qtyLabel + " ";
		if (qtySpan) element.appendChild(qtySpan);
	});
	document.getElementById("qty-medkit").innerText = state.inventory.medkit || 0;
	document.getElementById("qty-bigmedkit").innerText = state.inventory.bigMedkit || 0;
	document.getElementById("qty-regenkit").innerText = state.inventory.regenkit || 0;
	document.getElementById("qty-grenade").innerText = state.grenades || 0;

	const EPSILON = 0.05; // tolerance so hovering near max HP doesn't flicker the class
	const isFullHealth = state.currentHp >= state.maxHp - EPSILON;

	setDisabled(document.getElementById("icon-medKit"), !state.inventory.medkit || isFullHealth);
	setDisabled(document.getElementById("icon-bigmedKit"), !state.inventory.bigMedkit || isFullHealth);
	setDisabled(document.getElementById("icon-regenkit"), !state.inventory.regenkit || state.isRegening);
	setDisabled(document.getElementById("icon-grenade"), state.grenades <= 0);

	const regenOverlay = document.getElementById("regen-cooldown-overlay");
	if (regenOverlay) {
		const targetDisplay = state.isRegening ? "block" : "none";
		if (regenOverlay.style.display !== targetDisplay) {
			regenOverlay.style.display = targetDisplay;
		}

		if (state.isRegening) {
			const duration = SHOP_ITEMS.consumables[2].duration;
			const ticksLeft = state.regenTicksLeft ?? duration;
			const targetHeight = (ticksLeft / duration) * 100 + "%";
			if (regenOverlay.style.height !== targetHeight) {
				regenOverlay.style.height = targetHeight;
			}
		}
	}
}

function createProjectile(type, color, startX, startY, endX, endY, onHit) {
	const proj = document.createElement("div");
	// Combine the 'projectile' class with the color class (e.g., 'projectile red')
	proj.className = `projectile ${color}`;

	proj.style.left = startX;
	proj.style.top = startY;

	document.getElementById("battlefield").appendChild(proj);

	// Animate movement
	proj.animate(
		[
			{left: startX, top: startY},
			{left: endX, top: endY},
		],
		{duration: 300, fill: "forwards"},
	).onfinish = () => {
		proj.remove();
		if (onHit) onHit();
	};
}
function takeDamage(enemyAtk) {
	let dmgMultiplier = 10 / (10 + state.def);
	let baseDamage = enemy.isBoss ? 1.5 : 1.0;

	// Apply an extra damage boost starting at loop 6
	let loopDamageMultiplier = 1.0;
	if (state.loop <= 5) {
		loopDamageMultiplier = 1 + (state.loop - 1) * 0.1;
	} else {
		loopDamageMultiplier = 1.4 + (state.loop - 5) * 0.5;
	}

	let finalDamage = Math.round(baseDamage * enemyAtk * dmgMultiplier * loopDamageMultiplier * 10) / 10;

	let missChance = state.def * 0.1;

	if (Math.random() < missChance) {
		finalDamage = 0; // The enemy missed!

		// Fix language check to strictly align with state.lang
		const missText = state.lang === "ja" ? "キィィン！" : "P-TING!";
		showFloatingText(missText, "player-sprite");
	} else {
		finalDamage = Math.max(0.5, finalDamage);
	}

	state.currentHp = Math.round((state.currentHp - finalDamage) * 10) / 10;
	updateUI();
}

function showFloatingText(text, targetId) {
	const target = document.getElementById(targetId);
	if (!target) return;

	// Get the exact position of the player on the screen
	const rect = target.getBoundingClientRect();

	const popup = document.createElement("div");
	popup.innerText = text;
	popup.className = "floating-text miss-effect";
	popup.style.position = "absolute";
	popup.style.color = "#ffffff";
	popup.style.fontWeight = "bold";
	popup.style.fontSize = "18px";
	popup.style.fontFamily = "'DotGothic16', sans-serif";

	// Calculate the center position using math
	const textWidthEstimate = text.length * 10;
	popup.style.top = `${window.scrollY + rect.top - 20}px`;
	popup.style.left = `${window.scrollX + rect.left + rect.width / 2 - textWidthEstimate + 60}px`;

	popup.style.letterSpacing = "2px";
	popup.style.zIndex = "9999";

	// Apply the floating diagonal animation (which handles the rotation)
	popup.style.animation = "floatUpDiagonal 0.8s ease-out forwards";

	document.body.appendChild(popup);

	// Clean up after the animation completes
	setTimeout(() => {
		popup.remove();
	}, 800);
}
function performAttack(target) {
	if (target === "enemy") {
		// Player shoots orange towards enemy
		createProjectile("slash", "orange", "220px", "230px", "600px", "230px", () => {
			enemy.currentHp -= state.atk;
			if (enemy.currentHp <= 0 && !enemy.isDead) enemyDefeated();
		});
	} else {
		// Enemy shoots red towards player
		// Inside performAttack, when target === "player"
		createProjectile("bullet", "red", "575px", "220px", "200px", "220px", () => {
			takeDamage(enemy.atk);
		});
	}
}

function getGrenadeDamagePercent() {
	const roll = Math.random() * 100;
	if (roll < 10) return 0; // 10% chance: 0%
	if (roll < 30) return 0.4; // 20% chance: 20%
	if (roll < 70) return 0.4; // 40% chance: 50%
	if (roll < 90) return 0.4; // 20% chance: 80%
	return 1.0; // 10% chance: 100%
}

function throwGrenade() {
	if (state.grenades > 0) {
		state.grenades--;

		const dmgPercent = getGrenadeDamagePercent();
		const dmgAmount = Math.round(enemy.maxHp * dmgPercent);
		enemy.currentHp -= dmgAmount;

		state.points = (state.points || 0) + 50;

		// Floating text feedback based on roll outcome
		if (dmgPercent === 0) {
			const missText = state.lang === "JPN" ? "キィィン！" : "MISS!";
			showFloatingText(missText, "enemy-sprite");
		} else if (dmgPercent === 1) {
			const hitText = state.lang === "JPN" ? "会心の一撃！" : "DIRECT HIT!";
			showFloatingText(hitText, "enemy-sprite");
		} else {
			showFloatingText(`-${dmgAmount}`, "enemy-sprite");
		}

		document.getElementById("enemy-hp-bar").classList.add("shake");
		setTimeout(() => document.getElementById("enemy-hp-bar").classList.remove("shake"), 200);

		if (enemy.currentHp <= 0 && !enemy.isDead) enemyDefeated();
	}
}

function enemyDefeated() {
	enemy.isDead = true;
	document.getElementById("enemy-sprite").style.opacity = "0";
	if (enemy.isBoss) {
		state.grenades++;
		state.hasDefeatedBoss = true;
	}
	let reward = (enemy.isBoss ? 200 : 5) * state.loop;
	state.dango += reward;
	state.totalDango += reward;
	state.points = (state.points || 0) + reward;
	state.wave++;
	if (state.wave > 6) {
		state.wave = 1;
		state.loop++;
		if (state.loop > 10) {
			triggerWin();
			return;
		}
	}
	updateUI();
	setTimeout(() => {
		spawnEnemy();
		document.getElementById("enemy-sprite").style.opacity = "1";
		enemy.isDead = false;
	}, 1000);
}

function triggerWin() {
	state.won = true;
	document.getElementById("win-screen").style.opacity = "1";
	const finalPointsElement = document.getElementById("final-points");
	if (finalPointsElement) {
		finalPointsElement.innerText = Math.floor(state.points);
	}
	const saveBtn = document.getElementById("save-score-btn");
	if (saveBtn) saveBtn.dataset.score = Math.floor(state.points);
}

function spawnEnemy() {
	enemy.isBoss = state.wave === 6;
	let baseHp = (enemy.isBoss ? 100 : 20) * state.loop;

	let difficultyMultiplier = 1;
	if (state.loop >= 6) {
		difficultyMultiplier = Math.pow(1.5, state.loop - 5);
	}

	enemy.maxHp = Math.round(baseHp * difficultyMultiplier);
	enemy.currentHp = enemy.maxHp;
	document.getElementById("enemy-sprite").innerHTML = enemy.isBoss
		? `
<svg id="Layer_1" version="1.1" viewBox="0 0 48 82">
  <defs>
    <style>
      .killa-1 { fill: #cecdcd; }
      .killa-2 { fill: #393939; }
      .killa-3 { fill: #40414b; }
      .killa-4 { fill: #1e1e1e; }
      .killa-5 { fill: #978b65; }
      .killa-6 { fill: #f1c8b9; }
      .killa-7 { fill: #31363d; }
      .killa-8 { fill: #564c34; }
      .killa-9 { fill: #2c303c; }
      .killa-10 { fill: #313133; }
      .killa-11 { fill: #141c2d; }
      .killa-12 { fill: #2d3042; }
      .killa-13 { fill: #464a51; }
    </style>
  </defs>
  <polygon points="46 38 46 36 46 34 46 32 46 30 46 28 44 28 44 30 44 32 44 34 44 36 44 38 44 40 46 40 46 42 46 44 44 44 44 46 46 46 48 46 48 44 48 42 48 40 48 38 46 38"/>
  <polygon class="killa-13" points="42 44 42 42 40 42 38 42 36 42 34 42 34 44 34 46 36 46 38 46 40 46 42 46 44 46 44 44 42 44"/>
  <rect class="killa-7" x="42" y="42" width="2" height="2"/>
  <rect class="killa-5" x="42" y="28" width="2" height="2"/>
  <polygon points="40 74 40 76 40 78 38 78 38 80 36 80 34 80 34 78 32 78 32 80 32 82 34 82 36 82 38 82 40 82 42 82 42 80 42 78 42 76 42 74 42 72 42 70 40 70 40 72 40 74"/>
  <polygon points="40 46 38 46 36 46 34 46 34 44 34 42 36 42 38 42 40 42 42 42 42 40 40 40 40 38 40 36 40 34 38 34 38 32 38 30 40 30 42 30 42 28 40 28 38 28 36 28 36 30 36 32 36 34 36 36 38 36 38 38 38 40 36 40 34 40 32 40 30 40 30 42 32 42 32 44 32 46 32 48 34 48 36 48 38 48 38 50 36 50 34 50 32 50 32 52 34 52 36 52 38 52 38 54 38 56 38 58 38 60 38 62 38 64 38 66 38 68 38 70 40 70 40 68 40 66 40 64 40 62 40 60 40 58 40 56 40 54 40 52 40 50 40 48 42 48 44 48 44 46 42 46 40 46"/>
  <polygon class="killa-7" points="42 36 40 36 40 38 40 40 42 40 42 38 42 36"/>
  <polygon class="killa-13" points="42 32 40 32 38 32 38 34 40 34 40 36 42 36 42 38 42 40 42 42 44 42 44 44 46 44 46 42 46 40 44 40 44 38 44 36 44 34 42 34 42 32"/>
  <polygon class="killa-7" points="40 30 38 30 38 32 40 32 42 32 42 34 44 34 44 32 44 30 42 30 40 30"/>
  <polygon class="killa-5" points="40 26 38 26 36 26 36 28 38 28 40 28 42 28 42 26 40 26"/>
  <polygon points="42 26 42 28 44 28 44 26 44 24 42 24 40 24 40 26 42 26"/>
  <polygon class="killa-11" points="38 72 38 74 38 76 38 78 40 78 40 76 40 74 40 72 40 70 38 70 38 72"/>
  <rect class="killa-8" x="38" y="24" width="2" height="2"/>
  <rect x="38" y="22" width="2" height="2"/>
  <polygon class="killa-4" points="40 18 40 16 40 14 40 12 38 12 38 14 36 14 36 16 36 18 36 20 36 22 36 24 38 24 38 22 40 22 40 20 40 18"/>
  <polygon points="38 78 38 76 36 76 34 76 34 78 36 78 38 78"/>
  <polygon class="killa-9" points="38 76 38 74 38 72 38 70 38 68 38 66 38 64 38 62 38 60 38 58 38 56 38 54 36 54 34 54 34 56 32 56 32 58 30 58 28 58 26 58 24 58 22 58 20 58 18 58 18 60 16 60 16 62 16 64 16 66 16 68 16 70 16 72 16 74 16 76 18 76 18 74 20 74 20 72 20 70 20 68 20 66 22 66 22 64 22 62 24 62 24 60 26 60 28 60 30 60 30 62 30 64 32 64 32 66 32 68 32 70 34 70 34 72 34 74 34 76 36 76 38 76"/>
  <polygon class="killa-10" points="36 80 38 80 38 78 36 78 34 78 34 80 36 80"/>
  <polygon class="killa-3" points="34 38 32 38 30 38 28 38 26 38 26 40 24 40 22 40 20 40 18 40 18 42 20 42 22 42 24 42 26 42 28 42 30 42 30 40 32 40 34 40 36 40 38 40 38 38 38 36 36 36 36 38 34 38"/>
  <polygon class="killa-5" points="34 32 34 34 34 36 36 36 36 34 36 32 36 30 34 30 34 32"/>
  <rect class="killa-8" x="34" y="28" width="2" height="2"/>
  <rect x="34" y="2" width="2" height="2"/>
  <polygon points="34 72 34 70 32 70 32 72 32 74 32 76 34 76 34 74 34 72"/>
  <polygon class="killa-11" points="32 56 34 56 34 54 36 54 38 54 38 52 36 52 34 52 32 52 32 54 32 56"/>
  <polygon class="killa-8" points="34 50 36 50 38 50 38 48 36 48 34 48 32 48 32 50 34 50"/>
  <polygon class="killa-2" points="32 4 30 4 28 4 28 6 26 6 26 8 26 10 26 12 28 12 30 12 32 12 34 12 36 12 36 10 38 10 38 8 38 6 36 6 36 4 34 4 32 4"/>
  <polygon points="32 66 32 64 30 64 30 66 30 68 30 70 32 70 32 68 32 66"/>
  <rect class="killa-11" x="30" y="56" width="2" height="2"/>
  <rect class="killa-8" x="30" y="50" width="2" height="2"/>
  <rect class="killa-8" x="30" y="30" width="2" height="2"/>
  <polygon class="killa-1" points="30 2 28 2 28 4 30 4 32 4 34 4 34 2 32 2 30 2"/>
  <polygon points="30 60 28 60 26 60 24 60 24 62 26 62 28 62 28 64 30 64 30 62 30 60"/>
  <polygon points="28 56 26 56 24 56 22 56 20 56 20 58 22 58 24 58 26 58 28 58 30 58 30 56 28 56"/>
  <polygon points="28 52 26 52 24 52 22 52 22 50 20 50 20 52 20 54 22 54 24 54 26 54 28 54 30 54 30 56 32 56 32 54 32 52 30 52 28 52"/>
  <polygon class="killa-6" points="28 44 26 44 26 46 26 48 28 48 30 48 32 48 32 46 32 44 32 42 30 42 30 44 28 44"/>
  <rect class="killa-8" x="28" y="32" width="2" height="2"/>
  <rect x="28" y="30" width="2" height="2"/>
  <rect class="killa-8" x="28" y="28" width="2" height="2"/>
  <polygon class="killa-2" points="30 26 32 26 34 26 34 24 34 22 34 20 34 18 34 16 34 14 32 14 30 14 30 16 30 18 28 18 26 18 26 20 26 22 26 24 26 26 26 28 28 28 28 26 30 26"/>
  <polygon points="26 42 24 42 24 44 22 44 22 46 22 48 22 50 24 50 26 50 28 50 30 50 32 50 32 48 30 48 28 48 26 48 26 46 26 44 28 44 30 44 30 42 28 42 26 42"/>
  <polygon class="killa-5" points="28 36 30 36 32 36 32 34 32 32 30 32 30 34 28 34 26 34 24 34 22 34 20 34 20 32 18 32 18 34 18 36 18 38 20 38 22 38 24 38 26 38 26 36 28 36"/>
  <polygon class="killa-4" points="28 16 30 16 30 14 28 14 26 14 26 16 28 16"/>
  <rect class="killa-1" x="26" y="4" width="2" height="2"/>
  <polygon class="killa-5" points="26 52 28 52 30 52 30 50 28 50 26 50 24 50 24 52 26 52"/>
  <polygon class="killa-1" points="26 24 26 22 26 20 26 18 24 18 24 20 24 22 24 24 24 26 24 28 26 28 26 26 26 24"/>
  <rect class="killa-1" x="24" y="14" width="2" height="2"/>
  <polygon class="killa-1" points="26 8 26 6 24 6 24 8 24 10 24 12 26 12 26 10 26 8"/>
  <polygon points="26 2 28 2 30 2 32 2 34 2 34 0 32 0 30 0 28 0 26 0 24 0 22 0 22 2 24 2 26 2"/>
  <polygon points="22 64 22 66 22 68 22 70 22 72 22 74 24 74 24 72 24 70 24 68 24 66 24 64 24 62 22 62 22 64"/>
  <polygon class="killa-5" points="24 56 26 56 28 56 30 56 30 54 28 54 26 54 24 54 22 54 22 56 24 56"/>
  <rect class="killa-8" x="22" y="50" width="2" height="2"/>
  <polygon class="killa-8" points="24 32 26 32 28 32 28 30 26 30 24 30 22 30 20 30 20 32 22 32 24 32"/>
  <polygon class="killa-2" points="24 24 24 22 24 20 24 18 22 18 20 18 20 20 20 22 20 24 20 26 20 28 22 28 24 28 24 26 24 24"/>
  <polygon class="killa-2" points="24 8 24 6 26 6 26 4 28 4 28 2 26 2 24 2 24 4 22 4 22 6 20 6 20 8 20 10 20 12 22 12 24 12 24 10 24 8"/>
  <rect class="killa-1" x="22" y="2" width="2" height="2"/>
  <polygon points="20 76 18 76 16 76 16 74 16 72 16 70 16 68 16 66 16 64 16 62 16 60 14 60 14 62 14 64 14 66 14 68 14 70 14 72 14 74 14 76 12 76 12 78 14 78 16 78 18 78 20 78 20 80 18 80 16 80 14 80 12 80 12 78 10 78 10 80 10 82 12 82 14 82 16 82 18 82 20 82 22 82 22 80 22 78 22 76 22 74 20 74 20 76"/>
  <polygon class="killa-11" points="22 70 22 68 22 66 20 66 20 68 20 70 20 72 20 74 22 74 22 72 22 70"/>
  <rect class="killa-8" x="20" y="54" width="2" height="2"/>
  <polygon points="22 34 24 34 26 34 28 34 28 32 26 32 24 32 22 32 20 32 20 34 22 34"/>
  <polygon points="22 18 24 18 26 18 28 18 30 18 30 16 28 16 26 16 24 16 22 16 20 16 18 16 16 16 16 18 18 18 20 18 22 18"/>
  <polygon class="killa-4" points="22 16 24 16 24 14 22 14 20 14 20 16 22 16"/>
  <rect class="killa-1" x="20" y="4" width="2" height="2"/>
  <polygon points="22 4 22 2 20 2 18 2 18 4 20 4 22 4"/>
  <rect class="killa-11" x="18" y="74" width="2" height="2"/>
  <rect class="killa-11" x="18" y="56" width="2" height="2"/>
  <polygon class="killa-3" points="20 50 22 50 22 48 22 46 20 46 18 46 18 48 18 50 18 52 18 54 20 54 20 52 20 50"/>
  <rect x="18" y="44" width="2" height="2"/>
  <polygon class="killa-1" points="20 24 20 22 20 20 20 18 18 18 18 20 18 22 18 24 18 26 18 28 20 28 20 26 20 24"/>
  <rect class="killa-1" x="18" y="14" width="2" height="2"/>
  <polygon class="killa-1" points="20 8 20 6 18 6 18 8 18 10 18 12 20 12 20 10 20 8"/>
  <rect class="killa-2" x="18" y="4" width="2" height="2"/>
  <polygon points="18 58 18 56 20 56 20 54 18 54 18 52 18 50 18 48 18 46 16 46 14 46 14 48 16 48 16 50 14 50 12 50 12 48 10 48 10 50 10 52 12 52 14 52 16 52 16 54 16 56 16 58 16 60 18 60 18 58"/>
  <polygon class="killa-3" points="16 44 14 44 14 46 16 46 18 46 18 44 16 44"/>
  <polygon class="killa-2" points="18 26 18 24 18 22 18 20 18 18 16 18 16 16 16 14 14 14 14 16 14 18 14 20 14 22 14 24 14 26 16 26 18 26"/>
  <rect class="killa-4" x="16" y="14" width="2" height="2"/>
  <rect x="16" y="4" width="2" height="2"/>
  <polygon class="killa-12" points="16 44 18 44 20 44 20 46 22 46 22 44 24 44 24 42 22 42 20 42 18 42 16 42 14 42 12 42 12 44 14 44 16 44"/>
  <rect class="killa-7" x="14" y="38" width="2" height="2"/>
  <polygon class="killa-13" points="14 36 14 38 16 38 16 36 16 34 16 32 14 32 14 34 14 36"/>
  <polygon class="killa-2" points="16 12 18 12 18 10 18 8 18 6 16 6 16 8 16 10 14 10 14 12 16 12"/>
  <polygon points="16 8 16 6 14 6 14 8 14 10 16 10 16 8"/>
  <polygon class="killa-10" points="14 80 16 80 18 80 20 80 20 78 18 78 16 78 14 78 12 78 12 80 14 80"/>
  <polygon class="killa-6" points="12 50 14 50 16 50 16 48 14 48 14 46 12 46 10 46 10 48 12 48 12 50"/>
  <polygon points="12 44 10 44 10 46 12 46 14 46 14 44 12 44"/>
  <polygon points="14 42 16 42 18 42 18 40 20 40 22 40 24 40 26 40 26 38 24 38 22 38 20 38 18 38 18 36 18 34 18 32 20 32 20 30 22 30 24 30 26 30 28 30 28 28 26 28 24 28 22 28 20 28 18 28 18 26 16 26 14 26 14 28 16 28 16 30 14 30 14 32 16 32 16 34 16 36 16 38 16 40 14 40 12 40 12 38 10 38 10 40 10 42 12 42 14 42"/>
  <rect class="killa-13" x="12" y="38" width="2" height="2"/>
  <polygon points="14 36 14 34 14 32 12 32 12 34 12 36 12 38 14 38 14 36"/>
  <polygon points="14 22 14 20 14 18 14 16 14 14 16 14 18 14 20 14 22 14 24 14 26 14 28 14 30 14 32 14 34 14 34 16 34 18 34 20 34 22 34 24 34 26 32 26 30 26 28 26 28 28 30 28 30 30 32 30 32 32 32 34 32 36 30 36 28 36 26 36 26 38 28 38 30 38 32 38 34 38 36 38 36 36 34 36 34 34 34 32 34 30 34 28 36 28 36 26 38 26 38 24 36 24 36 22 36 20 36 18 36 16 36 14 38 14 38 12 40 12 40 14 40 16 40 18 40 20 40 22 42 22 42 20 42 18 42 16 42 14 42 12 42 10 42 8 40 8 40 6 40 4 38 4 36 4 36 6 38 6 38 8 38 10 36 10 36 12 34 12 32 12 30 12 28 12 26 12 24 12 22 12 20 12 18 12 16 12 14 12 14 10 12 10 12 12 12 14 12 16 12 18 12 20 12 22 12 24 12 26 14 26 14 24 14 22"/>
  <rect class="killa-3" x="10" y="42" width="2" height="2"/>
  <rect x="8" y="46" width="2" height="2"/>
  <rect class="killa-3" x="8" y="44" width="2" height="2"/>
  <rect x="8" y="42" width="2" height="2"/>
  <polygon class="killa-3" points="6 46 6 44 4 44 4 46 2 46 2 48 4 48 6 48 8 48 8 46 6 46"/>
  <rect x="6" y="44" width="2" height="2"/>
  <polygon points="4 48 2 48 2 46 0 46 0 48 0 50 2 50 4 50 6 50 8 50 8 48 6 48 4 48"/>
  <rect x="4" y="42" width="2" height="2"/>
  <rect x="2" y="44" width="2" height="2"/>
</svg>
`
		: `<svg id="Layer_1" version="1.1" viewBox="0 0 52 82">
  <defs>
    <style>
      .PMC1 { fill: none; }
      .PMC2 { fill: #212936; }
      .PMC3 { fill: #3f4144; }
      .PMC4 { fill: #4a4d59; }
      .PMC5 { fill: #b2ae94; }
      .PMC6 { fill: #1a3347; }
      .PMC7 { fill: #281911; }
      .PMC8 { fill: #c0725d; }
      .PMC9 { fill: #0c2435; }
      .PMC10 { fill: #564c34; }
      .PMC11 { fill: #39404a; }
      .PMC12 { fill: #1f2732; }
      .PMC13 { fill: #e5b5ac; }
      .PMC14 { fill: #686f7a; }
      .PMC15 { fill: #776f59; }
    </style>
  </defs>
  <rect class="PMC1" x="40" y="44" width="2" height="2"/>
  <rect class="PMC1" x="18" y="50" width="2" height="2"/>
  <polygon points="50 42 50 44 48 44 48 46 50 46 52 46 52 44 52 42 52 40 52 38 50 38 50 40 50 42"/>
  <polygon points="50 24 50 26 50 28 52 28 52 26 52 24 50 24"/>
  <polygon class="PMC12" points="48 40 48 42 48 44 50 44 50 42 50 40 50 38 48 38 48 40"/>
  <polygon points="48 38 50 38 50 36 50 34 48 34 48 36 48 38"/>
  <rect x="48" y="28" width="2" height="2"/>
  <polygon class="PMC15" points="50 24 48 24 48 26 48 28 50 28 50 26 50 24"/>
  <polygon class="PMC12" points="46 44 44 44 42 44 42 46 44 46 46 46 48 46 48 44 46 44"/>
  <polygon class="PMC12" points="46 36 46 38 48 38 48 36 48 34 46 34 46 36"/>
  <polygon class="PMC15" points="46 28 46 26 44 26 44 28 42 28 42 30 44 30 46 30 48 30 48 28 46 28"/>
  <polygon class="PMC5" points="46 22 44 22 44 24 42 24 40 24 40 26 38 26 36 26 36 28 34 28 34 30 32 30 30 30 30 32 32 32 34 32 36 32 36 30 38 30 38 28 40 28 40 30 42 30 42 28 44 28 44 26 46 26 46 28 48 28 48 26 48 24 48 22 46 22"/>
  <path d="M44,46h-4v-2h2v-2h-6v-2h2v-2h-4v4h-6v2h-6v2h6v2h-2v2h2v4h-2v-4h-2v6h18v-2h2v-6h4v-2h-4ZM42,52h-2v2h-10v-6h2v-4h6v4h-6v2h10v2Z"/>
  <polygon points="46 42 46 40 44 40 44 38 44 36 42 36 40 36 38 36 38 38 40 38 42 38 42 40 42 42 44 42 46 42"/>
  <polygon points="44 30 42 30 42 32 44 32 46 32 46 34 48 34 48 32 48 30 46 30 44 30"/>
  <polygon points="44 14 44 16 44 18 44 20 44 22 46 22 48 22 48 24 50 24 50 22 50 20 48 20 46 20 46 18 46 16 46 14 46 12 46 10 44 10 44 12 44 14"/>
  <polygon points="42 80 40 80 40 78 38 78 38 80 38 82 40 82 42 82 44 82 46 82 46 80 46 78 44 78 44 80 42 80"/>
  <polygon points="42 60 42 62 42 64 42 66 42 68 42 70 42 72 42 74 42 76 40 76 40 78 42 78 44 78 44 76 44 74 44 72 44 70 44 68 44 66 44 64 44 62 44 60 44 58 44 56 42 56 42 58 42 60"/>
  <polygon class="PMC11" points="42 34 40 34 38 34 36 34 34 34 34 36 34 38 36 38 38 38 38 36 40 36 42 36 44 36 44 38 44 40 46 40 46 42 44 42 42 42 42 44 44 44 46 44 48 44 48 42 48 40 48 38 46 38 46 36 46 34 44 34 42 34"/>
  <polygon class="PMC12" points="44 34 46 34 46 32 44 32 42 32 42 34 44 34"/>
  <polygon points="42 8 42 10 44 10 44 8 44 6 44 4 42 4 42 6 42 8"/>
  <polygon class="PMC7" points="40 78 40 80 42 80 44 80 44 78 42 78 40 78"/>
  <polygon class="PMC9" points="40 66 40 68 40 70 40 72 40 74 40 76 42 76 42 74 42 72 42 70 42 68 42 66 42 64 40 64 40 66"/>
  <polygon class="PMC4" points="42 38 40 38 38 38 38 40 36 40 36 42 38 42 40 42 42 42 42 40 42 38"/>
  <polygon points="42 24 44 24 44 22 42 22 40 22 40 24 42 24"/>
  <polygon class="PMC6" points="40 76 40 74 40 72 40 70 40 68 40 66 40 64 42 64 42 62 42 60 42 58 40 58 38 58 36 58 34 58 32 58 30 58 28 58 26 58 24 58 24 60 22 60 20 60 20 62 20 64 20 66 20 68 20 70 20 72 20 74 20 76 22 76 24 76 24 74 24 72 24 70 24 68 24 66 24 64 26 64 26 62 28 62 28 60 30 60 32 60 32 62 34 62 34 64 36 64 36 66 36 68 36 70 38 70 38 72 38 74 38 76 38 78 40 78 40 76"/>
  <polygon class="PMC9" points="38 56 36 56 34 56 32 56 30 56 28 56 26 56 24 56 24 58 26 58 28 58 30 58 32 58 34 58 36 58 38 58 40 58 42 58 42 56 40 56 38 56"/>
  <polygon class="PMC2" points="38 50 36 50 34 50 32 50 32 48 30 48 30 50 30 52 30 54 32 54 34 54 36 54 38 54 40 54 40 52 42 52 42 50 40 50 38 50"/>
  <polygon points="38 32 36 32 34 32 34 34 36 34 38 34 40 34 42 34 42 32 40 32 38 32"/>
  <polygon class="PMC15" points="40 28 38 28 38 30 36 30 36 32 38 32 40 32 42 32 42 30 40 30 40 28"/>
  <rect class="PMC11" x="38" y="22" width="2" height="2"/>
  <polygon points="38 20 36 20 34 20 32 20 30 20 30 22 32 22 34 22 36 22 36 24 36 26 38 26 40 26 40 24 38 24 38 22 40 22 40 20 40 18 40 16 38 16 38 18 38 20"/>
  <polygon points="40 4 42 4 42 2 40 2 38 2 38 4 40 4"/>
  <polygon points="38 74 38 72 38 70 36 70 36 72 36 74 36 76 36 78 38 78 38 76 38 74"/>
  <polygon points="36 14 36 16 38 16 38 14 38 12 38 10 36 10 36 12 36 14"/>
  <polygon points="36 66 36 64 34 64 34 66 34 68 34 70 36 70 36 68 36 66"/>
  <polygon class="PMC13" points="36 48 38 48 38 46 38 44 36 44 34 44 32 44 32 46 32 48 34 48 36 48"/>
  <rect x="34" y="26" width="2" height="2"/>
  <polygon class="PMC14" points="36 22 34 22 32 22 30 22 30 20 28 20 26 20 24 20 24 22 24 24 24 26 26 26 26 28 28 28 30 28 32 28 34 28 34 26 36 26 36 24 36 22"/>
  <polygon class="PMC12" points="34 14 32 14 32 16 34 16 36 16 36 14 34 14"/>
  <polygon class="PMC12" points="34 2 32 2 30 2 30 4 32 4 34 4 36 4 36 6 38 6 40 6 40 8 40 10 40 12 42 12 42 14 42 16 42 18 42 20 40 20 40 22 42 22 44 22 44 20 44 18 44 16 44 14 44 12 44 10 42 10 42 8 42 6 42 4 40 4 38 4 38 2 36 2 34 2"/>
  <rect x="32" y="62" width="2" height="2"/>
  <polygon points="34 34 32 34 30 34 30 36 28 36 28 38 30 38 32 38 34 38 34 36 34 34"/>
  <rect class="PMC10" x="32" y="16" width="2" height="2"/>
  <polygon points="30 60 28 60 28 62 30 62 32 62 32 60 30 60"/>
  <polygon class="PMC4" points="30 38 28 38 28 40 26 40 24 40 22 40 22 42 24 42 26 42 28 42 30 42 32 42 34 42 34 40 34 38 32 38 30 38"/>
  <polygon class="PMC15" points="32 34 34 34 34 32 32 32 30 32 30 34 32 34"/>
  <polygon points="30 28 28 28 26 28 26 30 28 30 28 32 28 34 30 34 30 32 30 30 32 30 34 30 34 28 32 28 30 28"/>
  <polygon class="PMC8" points="30 8 28 8 26 8 26 10 28 10 30 10 32 10 32 8 30 8"/>
  <rect class="PMC12" x="28" y="34" width="2" height="2"/>
  <polygon points="30 2 32 2 34 2 36 2 38 2 38 0 36 0 34 0 32 0 30 0 28 0 26 0 26 2 28 2 30 2"/>
  <polygon points="26 64 26 66 26 68 26 70 26 72 26 74 26 76 24 76 22 76 20 76 20 74 20 72 20 70 20 68 20 66 20 64 20 62 20 60 18 60 18 62 18 64 18 66 18 68 18 70 18 72 18 74 18 76 18 78 20 78 22 78 24 78 26 78 26 80 24 80 22 80 20 80 18 80 18 78 16 78 16 80 16 82 18 82 20 82 22 82 24 82 26 82 28 82 28 80 28 78 28 76 28 74 28 72 28 70 28 68 28 66 28 64 28 62 26 62 26 64"/>
  <polygon class="PMC2" points="26 54 28 54 28 52 28 50 26 50 26 52 26 54"/>
  <rect class="PMC12" x="26" y="46" width="2" height="2"/>
  <polygon points="26 34 24 34 24 36 26 36 28 36 28 34 26 34"/>
  <polygon class="PMC15" points="28 34 28 32 26 32 24 32 24 34 26 34 28 34"/>
  <rect class="PMC10" x="26" y="16" width="2" height="2"/>
  <polygon class="PMC12" points="28 16 28 14 26 14 24 14 24 16 26 16 28 16"/>
  <polygon class="PMC9" points="26 74 26 72 26 70 26 68 26 66 26 64 24 64 24 66 24 68 24 70 24 72 24 74 24 76 26 76 26 74"/>
  <rect x="24" y="26" width="2" height="2"/>
  <rect class="PMC13" x="24" y="16" width="2" height="2"/>
  <polygon class="PMC13" points="24 14 26 14 28 14 28 16 28 18 30 18 30 20 32 20 34 20 36 20 38 20 38 18 38 16 36 16 34 16 34 18 32 18 32 16 32 14 34 14 36 14 36 12 36 10 34 10 32 10 30 10 28 10 26 10 24 10 24 12 24 14"/>
  <polygon points="26 8 28 8 30 8 32 8 32 10 34 10 36 10 36 8 34 8 34 6 32 6 30 6 28 6 26 6 24 6 24 8 24 10 26 10 26 8"/>
  <polygon points="26 4 26 2 24 2 22 2 22 4 24 4 26 4"/>
  <rect class="PMC9" x="22" y="58" width="2" height="2"/>
  <polygon class="PMC4" points="22 56 24 56 24 54 24 52 24 50 22 50 22 52 20 52 20 54 22 54 22 56"/>
  <polygon class="PMC4" points="24 48 24 50 26 50 26 48 26 46 24 46 22 46 22 48 24 48"/>
  <polygon points="22 32 20 32 20 34 22 34 24 34 24 32 22 32"/>
  <polygon class="PMC5" points="22 32 24 32 26 32 28 32 28 30 26 30 26 28 24 28 24 26 22 26 22 28 20 28 20 30 22 30 22 32"/>
  <polygon points="24 24 24 22 24 20 26 20 28 20 30 20 30 18 28 18 26 18 24 18 24 16 24 14 24 12 24 10 22 10 22 12 22 14 22 16 22 18 22 20 22 22 20 22 20 24 22 24 22 26 24 26 24 24"/>
  <polygon class="PMC11" points="22 8 22 10 24 10 24 8 24 6 26 6 28 6 30 6 32 6 34 6 34 8 36 8 36 10 38 10 38 12 38 14 38 16 40 16 40 18 40 20 42 20 42 18 42 16 42 14 42 12 40 12 40 10 40 8 40 6 38 6 36 6 36 4 34 4 32 4 30 4 30 2 28 2 26 2 26 4 24 4 22 4 22 6 22 8"/>
  <polygon points="22 58 24 58 24 56 22 56 22 54 20 54 20 56 20 58 20 60 22 60 22 58"/>
  <rect class="PMC4" x="20" y="44" width="2" height="2"/>
  <rect class="PMC15" x="20" y="30" width="2" height="2"/>
  <rect class="PMC15" x="20" y="26" width="2" height="2"/>
  <polygon class="PMC11" points="20 14 20 16 20 18 20 20 20 22 22 22 22 20 22 18 22 16 22 14 22 12 22 10 20 10 20 12 20 14"/>
  <polygon points="22 8 22 6 22 4 20 4 20 6 20 8 20 10 22 10 22 8"/>
  <polygon class="PMC7" points="20 80 22 80 24 80 26 80 26 78 24 78 22 78 20 78 18 78 18 80 20 80"/>
  <rect x="18" y="52" width="2" height="2"/>
  <polygon points="20 44 18 44 16 44 14 44 14 46 16 46 18 46 18 48 18 50 20 50 20 52 22 52 22 50 24 50 24 48 22 48 22 46 20 46 20 44"/>
  <rect x="18" y="30" width="2" height="2"/>
  <rect class="PMC15" x="18" y="28" width="2" height="2"/>
  <polygon points="16 50 14 50 14 52 16 52 18 52 18 50 16 50"/>
  <polygon class="PMC13" points="18 50 18 48 18 46 16 46 14 46 14 48 14 50 16 50 18 50"/>
  <polygon class="PMC11" points="18 40 20 40 20 38 20 36 22 36 22 38 24 38 26 38 28 38 28 36 26 36 24 36 24 34 22 34 20 34 20 32 18 32 18 34 18 36 18 38 16 38 16 40 18 40"/>
  <polygon points="18 36 18 34 18 32 16 32 16 34 16 36 16 38 18 38 18 36"/>
  <rect x="16" y="28" width="2" height="2"/>
  <rect class="PMC15" x="16" y="26" width="2" height="2"/>
  <polygon class="PMC5" points="18 26 18 28 20 28 20 26 22 26 22 24 20 24 20 22 18 22 18 24 16 24 16 26 18 26"/>
  <polygon points="18 22 20 22 20 20 20 18 20 16 20 14 20 12 20 10 18 10 18 12 18 14 18 16 18 18 18 20 16 20 16 22 16 24 18 24 18 22"/>
  <polygon points="16 42 18 42 20 42 22 42 22 40 24 40 26 40 28 40 28 38 26 38 24 38 22 38 22 36 20 36 20 38 20 40 18 40 16 40 16 38 14 38 14 40 12 40 12 42 14 42 16 42"/>
  <polygon points="16 24 14 24 14 26 14 28 16 28 16 26 16 24"/>
  <polygon points="14 46 12 46 10 46 10 48 12 48 12 50 14 50 14 48 14 46"/>
  <polygon class="PMC4" points="12 44 10 44 10 46 12 46 14 46 14 44 12 44"/>
  <polygon class="PMC3" points="14 44 16 44 18 44 20 44 22 44 24 44 26 44 28 44 28 42 26 42 24 42 22 42 20 42 18 42 16 42 14 42 12 42 12 44 14 44"/>
  <polygon class="PMC4" points="8 46 6 46 4 46 2 46 2 48 2 50 4 50 4 48 6 48 8 48 10 48 10 46 8 46"/>
  <polygon points="6 48 6 50 8 50 10 50 10 48 8 48 6 48"/>
  <rect class="PMC3" x="4" y="48" width="2" height="2"/>
  <polygon points="2 50 2 52 4 52 6 52 6 50 4 50 2 50"/>
  <polygon points="2 46 4 46 6 46 8 46 10 46 10 44 12 44 12 42 10 42 8 42 8 44 6 44 4 44 4 42 2 42 0 42 0 44 0 46 0 48 0 50 2 50 2 48 2 46"/>
</svg>
`;
}

let currentLastTime = performance.now();

function playerDefeated() {
	state.isDead = true;
	state.deaths++;
	document.getElementById("player-sprite").style.opacity = "0";

	// Calculate the penalty ONLY from the totalDango points
	let penalty = Math.floor(state.totalDango / 4);
	state.totalDango = Math.max(0, state.totalDango - penalty);

	document.getElementById("ui-points").innerText = state.totalDango;
	document.getElementById("death-screen").style.opacity = "1";

	setTimeout(() => {
		document.getElementById("death-screen").style.opacity = "0";
		state.currentHp = state.maxHp;
		state.wave = 1; // Resets the wave
		document.getElementById("player-sprite").style.opacity = "1";
		state.isDead = false;
		spawnEnemy();
	}, 2000);
}

// Passive Point Generation Timer
setInterval(() => {
	if (!state.isDead && !state.paused && !state.won && !state.shopOpen) {
		state.dango += 1;
		state.totalDango += 1;
		state.points += 1;
		updateUI(); // Added to ensure visual numbers tick up smoothly
	}
}, 1000);

function capitalize(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderShop() {
	// Get the dictionary for the active language
	const t = i18n[state.lang];

	const categories = [
		{id: "shop-guns", type: "guns", key: "speed", currentKey: "currentGun"},
		{id: "shop-armor", type: "armor", key: "def", currentKey: "currentArmor"},
		{
			id: "shop-bullets",
			type: "bullet",
			key: "atk",
			currentKey: "currentBullet",
		},
	];

	categories.forEach((cat) => {
		const container = document.getElementById(cat.id);
		if (!container) return;

		container.innerHTML = "";

		SHOP_ITEMS[cat.type].forEach((item, index) => {
			if (index === 0) return;

			const stateKey = `owned${cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}`;
			const ownedList = state[stateKey] || [];

			const currentIndex = state[cat.currentKey] || 0;
			const isOwned = ownedList.includes(index);

			const maxOwnedIndex = ownedList.length > 0 ? Math.max(...ownedList) : 0;
			const highestReference = Math.max(currentIndex, maxOwnedIndex);

			const isDowngrade = !isOwned && index < highestReference;
			const canAfford = state.dango >= item.cost;
			const isDisabled = isOwned || isDowngrade || !canAfford;

			let statusText;
			if (isOwned) {
				statusText = "Owned"; // Or map to a translation key if you want to translate "Owned" as well!
			} else if (isDowngrade) {
				statusText = "Downgrade";
			} else {
				// Change this line to use the translation dictionary:
				statusText = item.cost + " " + t.dango;
			}

			const div = document.createElement("div");
			div.className = "gear " + cat.type;

			div.innerHTML = `
                <button ${isDisabled ? "disabled" : ""} onclick="buyItem('${cat.type}', ${index})">
                    <div class="gear-info">
                        <span class="title">${item.name}</span>
                        <div class="information">
                            ${item.icon}
                            (${item[cat.key]} ${cat.key.toUpperCase()})<br />
                            ${statusText}
                        </div>
                    </div>
                </button>
            `;
			container.appendChild(div);
		});
	});
	renderConsumables();
}

// A helper function to check if the game should be frozen
function checkPauseState() {
	// The game is paused if manual pause is active, OR shop is open, OR leaderboard is open
	state.paused = state.manualPaused || state.shopOpen || state.leaderboardOpen;
	updateUI();
}

// 1. Your manual pause button function
function togglePause() {
	state.manualPaused = !state.manualPaused;
	checkPauseState();
}

// 2. Your shop toggle
function toggleShop() {
	state.shopOpen = !state.shopOpen;
	if (state.shopOpen) renderShop();

	document.getElementById("shop-screen").style.display = state.shopOpen ? "block" : "none";

	checkPauseState(); // Automatically recalculates if the game should freeze/unfreeze
}

// 3. Your leaderboard toggle
function toggleLeaderboard() {
	state.leaderboardOpen = !state.leaderboardOpen;
	if (state.leaderboardOpen) fetchLeaderboard();

	document.getElementById("leaderboard-box").style.display = state.leaderboardOpen ? "block" : "none";

	checkPauseState(); // Automatically recalculates
}

function renderEquipment() {
	const arm = SHOP_ITEMS.armor[state.currentArmor];
	document.getElementById("icon-armorLabel").innerHTML = arm.icon; // Uses the equipped armor's SVG
	document.getElementById("txt-armorLabel").innerText = `${arm.name}`;

	const gun = SHOP_ITEMS.guns[state.currentGun];
	document.getElementById("icon-gunLabel").innerHTML = gun.icon; // Uses the equipped gun's SVG
	document.getElementById("txt-gunLabel").innerText = `${gun.name}`;

	const bul = SHOP_ITEMS.bullet[state.currentBullet];
	document.getElementById("icon-bulletLabel").innerHTML = bul.icon; // Uses the equipped bullet's SVG
	document.getElementById("txt-bulletLabel").innerText = `${bul.name}`;
}

// Function to handle buying consumables dynamically
function buyConsumable(index) {
	const item = SHOP_ITEMS.consumables[index];
	if (!item || state.dango < item.cost) return;

	state.dango -= item.cost;
	state.inventory[item.id] = (state.inventory[item.id] || 0) + 1;

	updateUI();
	renderConsumables();
}

// Dynamically builds the consumables HTML on the page
function renderConsumables() {
	const container = document.getElementById("consumables-container");
	if (!container) return;

	const t = i18n[state.lang];
	container.innerHTML = "";

	SHOP_ITEMS.consumables.forEach((item, index) => {
		const cannotAfford = state.dango < item.cost;

		const gearDiv = document.createElement("div");
		gearDiv.className = `gear ${item.id}`;

		gearDiv.innerHTML = `
			<button class="${item.id}" onclick="buyConsumable(${index})" ${cannotAfford ? "disabled" : ""}>
				<div class="gear-info">
					<span class="title">${t[item.nameKey]}</span>
					<div class="information">
						${item.icon}
						(${item.desc})
						<br />
						${item.cost} ${t.dango}
						<br />
						<span class="txt-qtyLabel">Owned</span>${state.inventory[item.id] || 0}
					</div>
				</div>
			</button>
		`;
		container.appendChild(gearDiv);
	});
}

function useConsumable(id) {
	const item = SHOP_ITEMS.consumables.find((i) => i.id === id);
	if (!item) return;
	if (!state.inventory[id] || state.inventory[id] <= 0) return;

	if (item.type === "instant") {
		if (state.currentHp >= state.maxHp) return;
		state.inventory[id]--;
		state.currentHp = Math.min(state.maxHp, state.currentHp + item.heal);
	} else if (item.type === "regen") {
		if (state.isRegening) return;
		state.inventory[id]--;
		state.isRegening = true;
		state.regenTicksLeft = item.duration;

		if (state.regenInterval) clearInterval(state.regenInterval);
		let ticks = item.duration;
		const hpPerTick = item.heal / item.duration;

		state.regenInterval = setInterval(() => {
			if (state.isDead || state.won) {
				clearInterval(state.regenInterval);
				state.isRegening = false;
				return;
			}
			if (!state.paused) {
				state.currentHp = Math.min(state.maxHp, state.currentHp + hpPerTick);
				ticks--;
				state.regenTicksLeft = ticks;
			}
			if (ticks <= 0) {
				clearInterval(state.regenInterval);
				state.isRegening = false; // NEW: single source of truth for ending the cooldown
			}
		}, 1000);
	}

	updateUI();
}

function initHudIcons() {
	const medIcon = document.getElementById("icon-medKit");
	if (medIcon) {
		medIcon.innerHTML = SHOP_ITEMS.consumables[0].icon;
		medIcon.onclick = () => useConsumable("medkit");
	}

	const bigMedIcon = document.getElementById("icon-bigmedKit");
	if (bigMedIcon) {
		bigMedIcon.innerHTML = SHOP_ITEMS.consumables[1].icon;
		bigMedIcon.onclick = () => useConsumable("bigMedkit");
	}

	const regenIcon = document.getElementById("icon-regenkit");
	if (regenIcon) {
		regenIcon.innerHTML = `
			<span id="icon-regenkit-svg">${SHOP_ITEMS.consumables[2].icon}</span>
			<div class="cooldown-overlay" id="regen-cooldown-overlay" style="height:0%; display:none;"></div>
		`;
		regenIcon.onclick = () => useConsumable("regenkit");
	}

	const grenadeIcon = document.getElementById("icon-grenade");
	if (grenadeIcon) {
		grenadeIcon.innerHTML = GRENADE_ICON;
		grenadeIcon.onclick = () => throwGrenade();
	}
}

function update(timestamp) {
	let dt = (timestamp - lastTime) / 1000;
	lastTime = timestamp;

	if (dt > 0.1) dt = 0.1;

	if (!state.paused && !state.isDead && !enemy.isDead && !state.won) {
		attackTimer += dt * state.spd;
		if (attackTimer >= BASE_PLAYER_ATTACK_SPEED) {
			performAttack("enemy", "550px", "100px");
			attackTimer -= BASE_PLAYER_ATTACK_SPEED;
		}

		enemyAttackTimer += dt;
		if (enemyAttackTimer >= ENEMY_ATTACK_INTERVAL) {
			performAttack("player", "150px", "100px");
			enemyAttackTimer -= ENEMY_ATTACK_INTERVAL;
		}
	}

	updateUI();
	if (state.currentHp <= 0 && !state.isDead) playerDefeated();

	requestAnimationFrame(update);
}

function buyItem(type, index) {
	const item = SHOP_ITEMS[type][index];
	if (state.dango >= item.cost) {
		state.dango -= item.cost;

		if (type === "guns") {
			state.ownedGuns.push(index);
			state.currentGun = index;
			state.spd = item.speed;
		} else if (type === "armor") {
			state.ownedArmor.push(index);
			state.currentArmor = index;
			state.def = item.def;
		} else if (type === "bullet") {
			state.ownedBullet.push(index);
			state.currentBullet = index;
			state.atk = item.atk;
		}
	}
	renderShop();
	renderEquipment();
	renderConsumables();
	updateUI();
}

// Close tooltips on backdrop clicks safely
document.addEventListener("click", function (event) {
	const tooltip = document.getElementById("tooltip");
	if (tooltip && !tooltip.contains(event.target)) {
		tooltip.classList.remove("active");
	}
});

spawnEnemy();
renderEquipment();
renderConsumables();
initHudIcons();

// Start the loop safely (ensures "lastTime" is synced to start runtime)
requestAnimationFrame((time) => {
	lastTime = time;
	requestAnimationFrame(update);
});

const firebaseConfig = {
	apiKey: "AIzaSyBmwQL5whHaoOlIc2ZkvilSoavdJk0c4UQ",
	authDomain: "escape-from-puni-puni.firebaseapp.com",
	projectId: "escape-from-puni-puni",
	storageBucket: "escape-from-puni-puni.firebasestorage.app",
	messagingSenderId: "215843980236",
	appId: "1:215843980236:web:80341e27422a5839e11369",
	measurementId: "G-WN4YGXLNTL",
};

// 3. Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 3b. Activate App Check (before grabbing db) do this once it is on the website
//const appCheck = firebase.appCheck();
//appCheck.activate('your-recaptcha-site-key', true);

const db = firebase.database();

// 4. Game & Leaderboard Logic
function handleWin(finalScore) {
	document.getElementById("win-screen").style.display = "block";
	document.getElementById("final-score-display").textContent = finalScore;
	document.getElementById("save-score-btn").dataset.score = finalScore;
}

// Triggered on clicking "Save Score"
async function handleSaveScore() {
	const nameInput = document.getElementById("player-name");
	const name = nameInput.value.trim() || "Anonymous";

	const scoreButton = document.getElementById("save-score-btn");
	const score = parseInt(scoreButton.dataset.score, 10) || 0;

	// Hide the input screen immediately
	document.getElementById("win-screen").style.display = "none";
	nameInput.value = "";

	try {
		// Save the score to the Firestore database
		await db.ref("leaderboard").push({
			name: name,
			score: score,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
		});

		// Refresh the leaderboard list
		fetchLeaderboard();
	} catch (error) {
		console.error("Error saving score to Firebase: ", error);
		alert("Could not save score. Check console.");
	}
}

// Fetch the top 10 scores from the cloud
async function fetchLeaderboard() {
	const list = document.getElementById("leaderboard-list");
	if (!list) return;
	const t = i18n[state.lang];
	try {
		const snapshot = await db.ref("leaderboard").orderByChild("score").limitToLast(10).once("value");
		list.innerHTML = "";
		if (!snapshot.exists()) {
			list.innerHTML = `<li>${t.noScores}</li>`;
			return;
		}

		const entries = [];
		snapshot.forEach((doc) => {
			entries.push(doc.val());
		});

		// snapshot comes back lowest→highest, so reverse for best-to-worst
		entries.reverse().forEach((entry) => {
			const li = document.createElement("li");
			li.innerHTML = `
                <span class="player-name">${entry.name}</span>: <span class="player-score">${entry.score} pts</span>
            `;
			list.appendChild(li);
		});
	} catch (error) {
		console.error("Error fetching leaderboard: ", error);
		list.innerHTML = `<li>${t.failedScores}</li>`;
	}
}

// Fetch the global leaderboard as soon as the page loads
document.addEventListener("DOMContentLoaded", () => {
	fetchLeaderboard();
});
