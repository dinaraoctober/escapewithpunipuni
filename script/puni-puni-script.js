let state = {
	bleeding: false,
	bleedDamage: 0,
	bleedInterval: null,
	muted: false,
	selectedSprite: "A",
	lang: "ENG",
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
		zagustin: 0,
		regenkit: 0,
	},
	// Game flow
	started: false,
	manualPaused: false,
	won: false,
};
const INITIAL_STATE = structuredClone(state);

const SHOP_ITEMS = {
	guns: [
		{
			id: "default_gun",
			name: "AK-74",
			cost: 0,
			icon: '<img src="assets/ak74.svg" alt="AK-74" />',
			speed: 1,
		},
		{
			id: "ak_545",
			name: "AK-545",
			cost: 50,
			icon: '<img src="assets/ak545.svg" alt="AK-545" />',
			speed: 2,
		},
		{
			id: "ak_105",
			name: "AK-105",
			cost: 500,
			icon: '<img src="assets/ak105.svg" alt="AK-105" />',
			speed: 3,
		},
		{
			id: "rpk_16",
			name: "RPK-16",
			cost: 1000,
			icon: '<img src="assets/rpk16.svg" alt="RPK-16" />',
			speed: 4,
		},
		{
			id: "nl545gp",
			name: "NL545GP",
			cost: 2000,
			icon: '<img src="assets/nl545gp.svg" alt="NL545GP" />',
			speed: 5,
		},
	],
	armors: [
		{
			id: "default_armor",
			name: "None",
			cost: 0,
			icon: '<img src="assets/armor-none.svg" alt="None" />',
			defence: 0,
		},
		{
			id: "kirasa_n",
			name: "BNTI Kirasa-N",
			cost: 50,
			icon: '<img src="assets/armor-kirasa.svg" alt="BNTI Kirasa-N" />',
			defence: 1,
		},
		{
			id: "assault_6b13",
			name: "6B13 Assault Armor",
			cost: 500,
			icon: '<img src="assets/armor-6b13.svg" alt="6B13 Assault Armor" />',
			defence: 2,
		},
		{
			id: "iotv_gen4",
			name: "IOTV Gen 4",
			cost: 1000,
			icon: '<img src="assets/armor-iotv.svg" alt="IOTV Gen 4" />',
			defence: 3,
		},
		{
			id: "redut_t5",
			name: "Redut-T5",
			cost: 2000,
			icon: '<img src="assets/armor-redut.svg" alt="Redut-T5" />',
			defence: 4,
		},
	],
	bullets: [
		{
			id: "default_bullet",
			name: "FMJ",
			cost: 0,
			icon: '<img src="assets/bullet-fmj.svg" alt="FMJ" />',
			attack: 1,
		},
		{
			id: "bullet_bt",
			name: "BT",
			cost: 50,
			icon: '<img src="assets/bullet-bt.svg" alt="BT" />',
			attack: 5,
		},
		{
			id: "bullet_bp",
			name: "BP",
			cost: 500,
			icon: '<img src="assets/bullet-bp.svg" alt="BP" />',
			attack: 10,
		},
		{
			id: "bullet_bs",
			name: "BS",
			cost: 1000,
			icon: '<img src="assets/bullet-bs.svg" alt="BS" />',
			attack: 20,
		},
		{
			id: "bullet_igolnik",
			name: "PPBS Igolnik",
			cost: 2000,
			icon: '<img src="assets/bullet-igolnik.svg" alt="PPBS Igolnik" />',
			attack: 50,
		},
	],
	consumables: [
		{
			id: "medkit",
			nameKey: "medLabel",
			cost: 20,
			heal: 15,
			type: "instant",
			descKey: "medDesc",
			icon: `<img src="assets/medkit.svg" alt="Medkit" />`,
		},
		{
			id: "zagustin",
			nameKey: "zagustinLabel",
			cost: 30,
			type: "cure",
			descKey: "zagustinDesc",
			icon: `<img src="assets/zagustin.svg" alt="zagustin" />`,
		},
		{
			id: "regenkit",
			nameKey: "regenLabel",
			cost: 40,
			heal: 30,
			duration: 30,
			type: "regen",
			descKey: "regenDesc",
			icon: `<img src="assets/propital.svg" alt="Regenkit" />`,
		},
	],
};

let enemy = { maxHp: 20, currentHp: 20, atk: 1, isBoss: false, isDead: false };
let attackTimer = 0;
let enemyAttackTimer = 0;
let lastTime = performance.now();
const BASE_PLAYER_ATTACK_SPEED = 1.0; // Seconds per attack
const ENEMY_ATTACK_INTERVAL = 1.5; // Seconds per enemy attack
const GRENADE_ICON = '<img src="assets/grenade.svg" alt="Grenade" />'; // Add your SVG path here

const i18n = {
	ENG: {
		ownedStatus: "Owned",
		downgradeStatus: "Downgrade",
		start: "Start Game",
		spriteA: "Puni Puni A",
		spriteB: "Puni Puni B",
		consumables: "Consumables",
		creatorLabel: "Escape with PuniPuni was made by",
		wave: "Wave",
		loop: "Loop",
		dango: "Dango",
		grenadeLabel: "Grenade",
		medLabel: "Grizzly Medical Kit",
		zagustinLabel: "Zagustin",
		zagustinDesc: "Stops bleeding",
		regenDesc: "+30 HP / 30s",
		medDesc: "+ 15 HP",
		regenLabel: "Propital",
		totalPoints: "Total Points",
		pause: "Pause",
		resume: "Resume",
		paused: "PAUSED",
		win: "YOU WIN!",
		playerStats: "Player Stats",
		upgrades: "Equipment",
		atkLabel: "Attack",
		spdLabel: "Speed",
		defLabel: "Defence",
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
		ownedStatus: "所持済み",
		downgradeStatus: "ダウングレード",
		start: "スタート",
		spriteA: "ぷにぷに A",
		spriteB: "ぷにぷに B",
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
		zagustinLabel: "ザグスティン",
		medDesc: "+15 HP",
		zagustinDesc: "出血を止める",
		regenDesc: "+30 HP / 30秒",
		medLabel: "グリズリー救急キット",
		regenLabel: "プロピタル",
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
	state.lang = (lang || "ENG").toUpperCase();
	updateUI();
	renderConsumables();
	if (state.shopOpen) renderShop();
	if (state.leaderboardOpen) fetchLeaderboard();
}

// Only touches classList if the value actually changed — avoids 60x/sec DOM churn and flicker
function setDisabled(el, isDisabled) {
	if (!el) return;
	const current = el.classList.contains("disabled");
	if (current !== isDisabled) {
		el.classList.toggle("disabled", isDisabled);
	}
}

const bgm = document.getElementById("bgm");
const sfxDodge = document.getElementById("sfx-dodge");
const sfxBleed = document.getElementById("sfx-bleed");
bgm.volume = 0.7;

function toggleVolumePanel(event) {
	event.stopPropagation();
	document.getElementById("mute-btn").classList.toggle("active");
}

function setVolume(value) {
	const vol = value / 100;
	bgm.volume = vol;
	sfxDodge.volume = vol;
	sfxBleed.volume = vol;

	if (vol > 0 && state.muted) {
		state.muted = false;
		syncMuteUI();
	}
	if (vol === 0 && !state.muted) {
		state.muted = true;
		syncMuteUI();
	}
}

function toggleMute() {
	state.muted = !state.muted;
	syncMuteUI();
}

function syncMuteUI() {
	const noteIcon = document.getElementById("mute-icon");
	if (noteIcon) {
		noteIcon.classList.toggle("is-muted", state.muted);
	}

	bgm.muted = state.muted;
	sfxDodge.muted = state.muted;
	sfxBleed.muted = state.muted;

	const muteToggleBtn = document.getElementById("volume-mute-toggle");
	if (muteToggleBtn) {
		muteToggleBtn.textContent = state.muted ? "🔇" : "🔊";
	}
}

function playBgm() {
	bgm.currentTime = 0;
	bgm.muted = state.muted;
	bgm.play().catch((err) => console.warn("BGM playback blocked:", err));
}

function stopBgm() {
	bgm.pause();
	bgm.currentTime = 0;
}

document.addEventListener("click", function (event) {
	const tooltip = document.getElementById("tooltip");
	if (tooltip && !tooltip.contains(event.target)) {
		tooltip.classList.remove("active");
	}

	const muteBtn = document.getElementById("mute-btn");
	if (muteBtn && !muteBtn.contains(event.target)) {
		muteBtn.classList.remove("active");
	}
});

// 1. Logic to hide the start screen and initiate gameplay loops
function startGame() {
	const e = document.getElementById("start-screen");
	if (e) {
		e.style.opacity = "0";
		e.style.pointerEvents = "none";
		setTimeout(() => {
			e.style.display = "none";
		}, 500);
	}

	state.started = true;
	state.manualPaused = false;
	state.paused = false;
	state.isDead = false;
	state.won = false;
	enemy.isDead = false;

	// Reset game loop time tracker to current time
	lastTime = performance.now();
	playBgm();

	renderPlayerSprite();
	spawnEnemy();
	checkPauseState();
	updateUI();
}

const HP_BAR_IDS = {
	player: { bar: "player-hp-bar", fill: "player-hp-fill", trail: "player-hp-trail", text: "player-hp-text" },
	pmc:    { bar: "enemy-hp-bar",  fill: "pmc-fill",        trail: "pmc-trail",       text: "pmc-text" },
	boss:   { bar: "boss-hp-bar",   fill: "boss-fill",        trail: "boss-trail",      text: "boss-text" },
};

const LOW_HP_THRESHOLD = {
	player: 50,
	pmc: 25,
	boss: 25,
};

function updateHealthBar(target, current, max) {
	const ids = HP_BAR_IDS[target];
	if (!ids) return;

	const fill = document.getElementById(ids.fill);
	const trail = document.getElementById(ids.trail);
	const text = document.getElementById(ids.text);
	if (!fill || !trail || !text) return;

	const percentage = Math.max(0, Math.min(100, (current / max) * 100));

	fill.style.width = percentage + "%";

	// Trail lags behind for the "damage ghost" effect
	setTimeout(() => {
		trail.style.width = percentage + "%";
	}, 120);

	text.textContent = `${Math.max(0, Math.floor(current))} / ${max}`;

	fill.classList.toggle("low", percentage <= LOW_HP_THRESHOLD[target]);
}

// Update the start screen itself whenever setLang() runs
// Add these new target updates directly into your existing updateUI() function
function updateUI() {
	const currentLang = state.lang && i18n[state.lang] ? i18n[state.lang] : i18n.ENG;

	// Update main buttons
	document.getElementById("btn-start").innerText = currentLang.start || "Start Game";

	const t = currentLang;

	// Sprite Selector Labels
	const spriteAEl = document.getElementById("txt-spriteA");
	if (spriteAEl) spriteAEl.innerText = t.spriteA;

	const spriteBEl = document.getElementById("txt-spriteB");
	if (spriteBEl) spriteBEl.innerText = t.spriteB;

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
	updateHealthBar("player", state.currentHp, state.maxHp);

if (enemy.isBoss) {
	updateHealthBar("boss", enemy.currentHp, enemy.maxHp);
} else {
	updateHealthBar("pmc", enemy.currentHp, enemy.maxHp);
}

document.getElementById("enemy-hp-bar").style.display = enemy.isBoss ? "none" : "block";
document.getElementById("boss-hp-bar").style.display = enemy.isBoss ? "block" : "none";

	// --- Consumables HUD ---
	document.getElementById("txt-medkitLabel").innerText = t.medLabel;
	document.getElementById("txt-zagustinLabel").innerText = t.zagustinLabel;
	document.getElementById("txt-regenkitLabel").innerText = t.regenLabel;
	document.getElementById("txt-grenadeLabel").innerText = t.grenadeLabel;
	document.querySelectorAll(".txt-qtyLabel").forEach((element) => {
		// Keeps the nested quantity number span safe while replacing the prefix text
		const qtySpan = element.querySelector(".text");
		element.textContent = i18n[state.lang].qtyLabel + " ";
		if (qtySpan) element.appendChild(qtySpan);
	});
	document.getElementById("qty-medkit").innerText = state.inventory.medkit || 0;
	document.getElementById("qty-zagustin").innerText = state.inventory.zagustin || 0;
	document.getElementById("qty-regenkit").innerText = state.inventory.regenkit || 0;
	document.getElementById("qty-grenade").innerText = state.grenades || 0;

	const EPSILON = 0.05; // tolerance so hovering near max HP doesn't flicker the class
	const isFullHealth = state.currentHp >= state.maxHp - EPSILON;

	setDisabled(document.getElementById("icon-medKit"), !state.inventory.medkit || isFullHealth);
	setDisabled(document.getElementById("icon-zagustin"), !state.inventory.zagustin || !state.bleeding);
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

function setPlayerSprite(spriteKey) {
	state.selectedSprite = spriteKey;
	renderPlayerSprite();
}

// 3. Helper function to render the image inside #player-sprite
function renderPlayerSprite() {
	const playerEl = document.getElementById("player-sprite");
	if (!playerEl) return;

	// Adjust filenames to match your asset paths
	const spriteUrl = state.selectedSprite === "A" ? "assets/player-a.svg" : "assets/player-b.svg";

	playerEl.innerHTML = `<img src="${spriteUrl}" alt="Player Sprite" class="player-sprite-img" />`;
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
			{ left: startX, top: startY },
			{ left: endX, top: endY },
		],
		{ duration: 300, fill: "forwards" },
	).onfinish = () => {
		proj.remove();
		if (onHit) onHit();
	};
}

function applyBleed(dmgPerTick) {
	state.bleeding = true;
	state.bleedDamage = dmgPerTick;

	// Refresh rather than stack multiple intervals if bled again
	if (state.bleedInterval) clearInterval(state.bleedInterval);

	state.bleedInterval = setInterval(() => {
		if (state.isDead || state.won || !state.bleeding) {
			clearInterval(state.bleedInterval);
			return;
		}
		if (!state.paused) {
			state.currentHp = Math.round((state.currentHp - state.bleedDamage) * 10) / 10;
			updateUI();

			if (state.currentHp <= 0 && !state.isDead) playerDefeated();
		}
	}, 1000);

		state.bleedDripInterval = setInterval(() => {
		if (state.isDead || state.won || !state.bleeding) {
			clearInterval(state.bleedDripInterval);
			return;
		}
		if (!state.paused) spawnBloodDrip();
	}, 300);
}

function startBleedImmunity(seconds) {
    state.bleedImmune = true;
    state.bleedImmuneTicksLeft = seconds;

    if (state.bleedImmuneInterval) clearInterval(state.bleedImmuneInterval);

    state.bleedImmuneInterval = setInterval(() => {
        if (state.isDead || state.won) {
            clearInterval(state.bleedImmuneInterval);
            state.bleedImmuneInterval = null;
            state.bleedImmune = false;
            return;
        }
        if (state.paused) return;

        state.bleedImmuneTicksLeft--;
        if (state.bleedImmuneTicksLeft <= 0) {
            clearInterval(state.bleedImmuneInterval);
            state.bleedImmuneInterval = null;
            state.bleedImmune = false;
        }
    }, 1000);
}

function stopBleed() {
	state.bleeding = false;
	if (state.bleedInterval) {
		clearInterval(state.bleedInterval);
		state.bleedInterval = null;
	}
	if (state.bleedDripInterval) {
		clearInterval(state.bleedDripInterval);
		state.bleedDripInterval = null;
	}
	updateUI();
}

function takeDamage(enemyAtk) {
	let dmgMultiplier = 10 / (10 + state.def);
	let baseDamage = enemy.isBoss ? 1.5 : 1.0;

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

		const missText = state.lang === "JPN" ? "キィィン！" : "P-TING!";
		showFloatingText(missText, "player-sprite");

		sfxDodge.currentTime = 0;
		sfxDodge.play().catch((err) => console.warn("SFX playback blocked:", err));
	} else {
		finalDamage = Math.max(0.5, finalDamage);

		// Bleed roll — only possible on a landed hit
		if (!state.bleeding && !state.bleedImmune) {
			const bleedChance = enemy.isBoss ? 0.3 : 0.01; // 3% for bosses, 1% for regular enemies	
			if (Math.random() < bleedChance) {
				applyBleed(enemyAtk);
				const bleedText = state.lang === "JPN" ? "出血！" : "BLEEDING!";
				showFloatingText(bleedText, "player-sprite");

				sfxBleed.currentTime = 0;
				sfxBleed.play().catch((err) => console.warn("SFX playback blocked:", err));
	
			}
		}
	}

	state.currentHp = Math.round((state.currentHp - finalDamage) * 10) / 10;
	updateUI();
} 

function spawnBloodDrip() {
	const playerEl = document.getElementById("player-sprite");
	if (!playerEl) return;

	const drip = document.createElement("div");
	drip.className = "blood-drip";

	// Random horizontal spot roughly within the sprite's width
	const offsetX = 10 + Math.random() * 60;
	const offsetY = 30 + Math.random() * 20;

	drip.style.left = `${offsetX}px`;
	drip.style.top = `${offsetY}px`;

	playerEl.appendChild(drip);

	setTimeout(() => drip.remove(), 900);
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
		createProjectile("slash", "orange", "120px", "180px", "680px", "180px", () => {
			enemy.currentHp -= state.atk;
			if (enemy.currentHp <= 0 && !enemy.isDead) enemyDefeated();
		});
	} else {
		// Enemy shoots red towards player
		// Inside performAttack, when target === "player"
		createProjectile("bullet", "red", "640px", "170px", "100px", "170px", () => {
			takeDamage(enemy.atk);
		});
	}
}

function getGrenadeDamagePercent() {
	const roll = Math.random() * 100;
	if (roll < 10) return 0; // 10% chance: 0%
	if (roll < 30) return 0.4;
	if (roll < 70) return 0.4;
	if (roll < 90) return 0.4;
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
		const shakeTarget = document.getElementById(enemy.isBoss ? "boss-hp-bar" : "enemy-hp-bar");
			shakeTarget.classList.add("shake");
			setTimeout(() => shakeTarget.classList.remove("shake"), 200);

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
	stopBgm();
	stopBleed();
	document.getElementById("win-screen").style.opacity = "1";
	const finalPointsElement = document.getElementById("final-points");
	if (finalPointsElement) {
		finalPointsElement.innerText = Math.floor(state.points);
	}
	const saveBtn = document.getElementById("save-score-btn");
	if (saveBtn) saveBtn.dataset.score = Math.floor(state.points);
}

function getEnemySpriteUrl(loop, isBoss) {
	if (isBoss) {
		return `assets/sprite-${loop}-boss.svg`;
	}
	return `assets/sprite-${loop}.svg`;
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
	document.getElementById("enemy-sprite").innerHTML = `<img src="${getEnemySpriteUrl(state.loop, enemy.isBoss)}" alt="enemy" class="enemy-sprite-img" />`;
}

let currentLastTime = performance.now();

function playerDefeated() {
	state.isDead = true;
	state.deaths++;
	document.getElementById("player-sprite").style.opacity = "0";

	let pointsPenalty = Math.floor((state.points || 0) * 0.3);
	state.points = Math.max(0, (state.points || 0) - pointsPenalty);

	document.getElementById("ui-points").innerText = state.totalDango;
	document.getElementById("death-screen").style.opacity = "1";

	setTimeout(() => {
		document.getElementById("death-screen").style.opacity = "0";
		state.currentHp = state.maxHp;
		state.wave = 1; // Resets the wave
		stopBleed();
		if (state.bleedImmuneInterval) clearInterval(state.bleedImmuneInterval);
		state.bleedImmune = false;
		document.getElementById("player-sprite").style.opacity = "1";
		state.isDead = false;
		spawnEnemy();
	}, 2000);
}

// Passive Point Generation Timer
setInterval(() => {
	if (state.started && !state.isDead && !state.paused && !state.won && !state.shopOpen) {
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
	const t = i18n[state.lang];

	// map shop stat keys to existing translation keys
	const statLabelKey = {
		speed: "spdLabel",
		defence: "defLabel",
		attack: "atkLabel",
	};

	const categories = [
		{ id: "shop-guns", type: "guns", key: "speed", currentKey: "currentGun" },
		{ id: "shop-armor", type: "armor", shopType: "armors", key: "defence", currentKey: "currentArmor" },
		{ id: "shop-bullets", type: "bullet", shopType: "bullets", key: "attack", currentKey: "currentBullet" },
	];

	categories.forEach((cat) => {
		const container = document.getElementById(cat.id);
		if (!container) return;
		container.innerHTML = "";

		SHOP_ITEMS[cat.shopType || cat.type].forEach((item, index) => {
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
				statusText = t.ownedStatus;
			} else if (isDowngrade) {
				statusText = t.downgradeStatus;
			} else {
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
                            (${item[cat.key]} ${t[statLabelKey[cat.key]]})<br />
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
	const arm = (SHOP_ITEMS.armors && SHOP_ITEMS.armors[state.currentArmor]) || (SHOP_ITEMS.armor && SHOP_ITEMS.armor[state.currentArmor]) || (SHOP_ITEMS.armors && SHOP_ITEMS.armors[0]);
	if (arm) {
		document.getElementById("icon-armorLabel").innerHTML = arm.icon; // Uses the equipped armor's SVG
		document.getElementById("txt-armorLabel").innerText = `${arm.name}`;
	}

	const gun = SHOP_ITEMS.guns && SHOP_ITEMS.guns[state.currentGun];
	if (gun) {
		document.getElementById("icon-gunLabel").innerHTML = gun.icon; // Uses the equipped gun's SVG
		document.getElementById("txt-gunLabel").innerText = `${gun.name}`;
	}

	const bul = (SHOP_ITEMS.bullets && SHOP_ITEMS.bullets[state.currentBullet]) || (SHOP_ITEMS.bullet && SHOP_ITEMS.bullet[state.currentBullet]);
	if (bul) {
		document.getElementById("icon-bulletLabel").innerHTML = bul.icon; // Uses the equipped bullet's SVG
		document.getElementById("txt-bulletLabel").innerText = `${bul.name}`;
	}
}

// Function to handle buying consumables dynamically
function buyConsumable(index) {
	const item = SHOP_ITEMS.consumables[index];
	if (!item || state.dango < item.cost) return;

	state.dango -= item.cost;
	state.inventory[item.id] = (state.inventory[item.id] || 0) + 1;

	updateUI();
	renderShop();
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
						(${t[item.descKey]})
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
	} else if (item.type === "cure") {
		if (!state.bleeding) return;
		state.inventory[id]--;
		stopBleed();
		startBleedImmunity(15);
	} else if (item.type === "regen") {
		if (state.isRegening) return; // don't stack regens
		state.inventory[id]--;
		startRegen(item);
	}

	updateUI();
}

function startRegen(item) {
	state.isRegening = true;
	state.regenTicksLeft = item.duration;

	if (state.regenInterval) clearInterval(state.regenInterval);

	const healPerTick = item.heal / item.duration;

	state.regenInterval = setInterval(() => {
		if (state.isDead || state.won) {
			clearInterval(state.regenInterval);
			state.regenInterval = null;
			state.isRegening = false;
			updateUI();
			return;
		}
		if (state.paused) return;

		state.regenTicksLeft--;
		state.currentHp = Math.min(state.maxHp, Math.round((state.currentHp + healPerTick) * 10) / 10);

		if (state.regenTicksLeft <= 0) {
			clearInterval(state.regenInterval);
			state.regenInterval = null;
			state.isRegening = false;
		}
		updateUI();
	}, 1000);
}

function initHudIcons() {
	const medIcon = document.getElementById("icon-medKit");
	if (medIcon) {
		medIcon.innerHTML = SHOP_ITEMS.consumables[0].icon;
		medIcon.onclick = () => useConsumable("medkit");
	}

	const zagustinIcon = document.getElementById("icon-zagustin");
	if (zagustinIcon) {
		zagustinIcon.innerHTML = SHOP_ITEMS.consumables[1].icon;
		zagustinIcon.onclick = () => useConsumable("zagustin");
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

	if (state.started && !state.paused && !state.isDead && !enemy.isDead && !state.won) {
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
	if (state.started && state.currentHp <= 0 && !state.isDead) playerDefeated();

	requestAnimationFrame(update);
}

function buyItem(type, index) {
	const itemType = type === "bullet" ? "bullets" : type === "armor" ? "armors" : type;
	const item = SHOP_ITEMS[itemType][index];
	if (!item || state.dango < item.cost) return;

	state.dango -= item.cost;

	if (type === "guns") {
		state.ownedGuns.push(index);
		state.currentGun = index;
		state.spd = item.speed;
	} else if (type === "armor") {
		state.ownedArmor.push(index);
		state.currentArmor = index;
		state.def = item.defence;
	} else if (type === "bullet") {
		state.ownedBullet.push(index);
		state.currentBullet = index;
		state.atk = item.attack;
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

// In your DOMContentLoaded listener:
document.addEventListener("DOMContentLoaded", () => {
	renderPlayerSprite();
	renderEquipment();
	renderConsumables();
	initHudIcons();

	const startButton = document.getElementById("btn-start");
	if (startButton) startButton.addEventListener("click", startGame);

	requestAnimationFrame((time) => {
		lastTime = time;
		requestAnimationFrame(update);
	});
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
	document.getElementById("final-points").textContent = finalScore;
	document.getElementById("save-score-btn").dataset.score = finalScore;
}

// Triggered on clicking "Save Score"
async function handleSaveScore() {
	const nameInput = document.getElementById("player-name");
	const name = nameInput.value.trim() || "Anonymous";

	const scoreButton = document.getElementById("save-score-btn");
	const score = parseInt(scoreButton.dataset.score, 10) || 0;

	document.getElementById("win-screen").style.display = "none";
	nameInput.value = "";

	try {
		await db.ref("leaderboard").push({
			name: name,
			score: score,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
		});

		await fetchLeaderboard();
	} catch (error) {
		console.error("Error saving score to Firebase: ", error);
		alert("Could not save score. Check console.");
	}

	returnToStartScreen();
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

function returnToStartScreen() {
	const preservedLang = state.lang;
	const preservedMuted = state.muted;

	// Clear any running intervals tied to the old state before replacing it
	if (state.bleedInterval) clearInterval(state.bleedInterval);
	if (state.bleedDripInterval) clearInterval(state.bleedDripInterval);
	if (state.bleedImmuneInterval) clearInterval(state.bleedImmuneInterval);
	if (state.regenInterval) clearInterval(state.regenInterval);

	state = structuredClone(INITIAL_STATE);
	state.lang = preservedLang;
	state.muted = preservedMuted;

	enemy = { maxHp: 20, currentHp: 20, atk: 1, isBoss: false, isDead: false };
	attackTimer = 0;
	enemyAttackTimer = 0;

	stopBgm();

	document.getElementById("win-screen").style.opacity = "0";
	document.getElementById("player-sprite").style.opacity = "1";
	document.getElementById("enemy-sprite").style.opacity = "1";

	const startScreen = document.getElementById("start-screen");
	if (startScreen) {
		startScreen.style.display = "flex";
		void startScreen.offsetWidth; // force reflow so opacity transition replays
		startScreen.style.opacity = "1";
		startScreen.style.pointerEvents = "all";
	}

	// Re-render everything that depends on equipment/inventory, since those were just wiped
	renderPlayerSprite();
	renderEquipment();
	renderConsumables();
	syncMuteUI();
	updateUI();
}



// Fetch the global leaderboard as soon as the page loads
document.addEventListener("DOMContentLoaded", () => {
	fetchLeaderboard();
});