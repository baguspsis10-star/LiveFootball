/* ==========================================================================
   MAIN GAME CONTROLLER & UI HANDLERS (With Save/Load System & Touch Fix)
   ========================================================================== */
let gameState = {
    managerName: "Paul Farman",
    selectedLeagueKey: "EPL",
    userTeamId: null,
    currentGW: 1,
    teams: [],
    tactics: {
        captainId: null,
        pressing: "Soft",
        formation: "3-3-4",
        movement: "Pergerakan",
        passing: "Umpan",
        startingSlots: []
    },
    fixtures: [],
    standings: [],
    transferMode: "buy"
};

let selectedSwapPlayerId = null;

let matchSimulation = {
    active: false,
    interval: null,
    minute: 0,
    homeTeam: null,
    awayTeam: null,
    homeScore: 0,
    awayScore: 0,
    homeStats: { shots: 0, target: 0, cards: 0, poss: 50 },
    awayStats: { shots: 0, target: 0, cards: 0, poss: 50 },
    scorers: [],
    speedMs: 300
};

/* SYSTEM SAVE & LOAD LOGIC (LOCALSTORAGE) */
const SAVE_KEY = "superkickoff_fm_savegame_v1";

function autoSaveGame() {
    if (!gameState.userTeamId) return;
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (e) {
        console.error("Gagal menyimpan otomatis:", e);
    }
}

function manualSaveGame() {
    if (!gameState.userTeamId) {
        showToast("Pilih tim terlebih dahulu sebelum menyimpan!", "warning");
        return;
    }
    autoSaveGame();
    showToast("Progres game berhasil disimpan!", "success");
}

function loadSavedGame() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed && parsed.userTeamId && parsed.teams && parsed.teams.length > 0) {
                gameState = parsed;
                return true;
            }
        }
    } catch (e) {
        console.error("Gagal memuat save game:", e);
    }
    return false;
}

function resetGameSave() {
    if (confirm("Apakah Anda yakin ingin mengulang dari awal? Semua progres saat ini akan dihapus.")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

window.onload = function() {
    setupTouchDragGhostListeners();
    
    // Cek apakah ada data save tersimpan
    if (loadSavedGame()) {
        document.getElementById('header').classList.remove('hidden');
        document.getElementById('bottom-nav').classList.remove('hidden');
        document.getElementById('screen-select-club').classList.add('hidden');
        document.getElementById('screen-dashboard').classList.remove('hidden');

        updateHeaderUI();
        renderDashboard();
        showToast(`Selamat datang kembali, Manajer ${gameState.managerName}! Progres dimuat.`, 'success');
    } else {
        renderClubSelectionGrid();
    }
};

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    let bg = 'bg-slate-900 border-slate-700 text-slate-100';
    if (type === 'success') bg = 'bg-emerald-950 border-emerald-500/60 text-emerald-300';
    if (type === 'error') bg = 'bg-rose-950 border-rose-500/60 text-rose-300';
    if (type === 'warning') bg = 'bg-amber-950 border-amber-500/60 text-amber-300';

    toast.className = `p-3 rounded-2xl border shadow-2xl text-xs font-semibold flex items-center justify-between gap-2 pointer-events-auto transition transform translate-y-2 opacity-0 ${bg}`;
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>`;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

function getUserTeam() {
    return gameState.teams.find(t => t.id === gameState.userTeamId);
}

function changeSelectedLeague(leagueKey) {
    gameState.selectedLeagueKey = leagueKey;
    
    const btnEpl = document.getElementById('btn-league-epl');
    const btnLaliga = document.getElementById('btn-league-laliga');
    const heading = document.getElementById('select-club-heading');

    if (leagueKey === 'EPL') {
        btnEpl.className = "py-2 px-2 rounded-xl border border-superteal-500 bg-superteal-500/20 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition";
        btnLaliga.className = "py-2 px-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:text-white transition";
        heading.innerText = "Pilih Klub Premier League";
    } else {
        btnLaliga.className = "py-2 px-2 rounded-xl border border-superteal-500 bg-superteal-500/20 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition";
        btnEpl.className = "py-2 px-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:text-white transition";
        heading.innerText = "Pilih Klub La Liga Spanyol";
    }

    renderClubSelectionGrid();
}

function renderClubSelectionGrid() {
    const grid = document.getElementById('club-grid');
    const targetDataset = getTeamsByLeague(gameState.selectedLeagueKey);

    if (targetDataset.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center text-xs text-slate-400 py-4">Belum ada tim terdaftar.</div>`;
        return;
    }

    grid.innerHTML = targetDataset.map(team => {
        const avgOvr = Math.round(team.squad.reduce((a, b) => a + b.ovr, 0) / (team.squad.length || 1));
        return `
            <div onclick="selectClub('${team.id}')" class="bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-superteal-500/50 rounded-2xl p-2.5 cursor-pointer transition transform hover:-translate-y-0.5 flex items-center space-x-2">
                ${getClubBadgeSVG(team, "w-8 h-8", "text-[8px]")}
                <div class="overflow-hidden">
                    <h3 class="font-bold text-xs text-white truncate">${team.name}</h3>
                    <p class="text-[10px] text-amber-400 font-bold">£${team.budget}M • OVR ${avgOvr}</p>
                </div>
            </div>
        `;
    }).join('');
}

function selectClub(teamId) {
    const nameInput = document.getElementById('input-manager-name').value.trim();
    gameState.managerName = nameInput || "Paul Farman";
    gameState.userTeamId = teamId;

    const pool = getTeamsByLeague(gameState.selectedLeagueKey);
    gameState.teams = JSON.parse(JSON.stringify(pool));
    
    const userTeam = getUserTeam();
    gameState.tactics.captainId = userTeam.squad[0].id;

    buildStartingSlotsForFormation(gameState.tactics.formation);
    generateRoundRobinFixtures();
    initStandings();

    autoSaveGame(); // Simpan Otomatis

    document.getElementById('header').classList.remove('hidden');
    document.getElementById('bottom-nav').classList.remove('hidden');
    document.getElementById('screen-select-club').classList.add('hidden');
    document.getElementById('screen-dashboard').classList.remove('hidden');

    updateHeaderUI();
    renderDashboard();

    showToast(`Selamat melatih ${userTeam.name}, Manajer ${gameState.managerName}!`, 'success');
}

function buildStartingSlotsForFormation(formation) {
    const userTeam = getUserTeam();
    const squad = [...userTeam.squad].sort((a, b) => b.ovr - a.ovr);
    
    let roles = [];
    if (formation === "3-3-4") roles = ["GK", "CB", "CB", "FB", "M", "M", "M", "F", "F", "F", "F"];
    else if (formation === "4-3-3") roles = ["GK", "CB", "CB", "FB", "FB", "M", "M", "M", "F", "F", "F"];
    else if (formation === "4-2-3-1") roles = ["GK", "CB", "CB", "FB", "FB", "M", "M", "M", "F", "F", "F"];
    else if (formation === "4-4-2") roles = ["GK", "CB", "CB", "FB", "FB", "M", "M", "M", "M", "F", "F"];
    else if (formation === "3-5-2") roles = ["GK", "CB", "CB", "CB", "M", "M", "M", "M", "M", "F", "F"];
    else roles = ["GK", "CB", "CB", "CB", "FB", "FB", "M", "M", "M", "F", "F"];

    const assignedIds = gameState.tactics.startingSlots.map(s => s.playerId).filter(Boolean);
    
    gameState.tactics.startingSlots = roles.map((role, idx) => {
        let existingP = squad.find(p => p.id === assignedIds[idx]);
        if (!existingP) {
            existingP = squad.find(p => !assignedIds.includes(p.id) && p.pos === role) || 
                        squad.find(p => !assignedIds.includes(p.id));
            if (existingP) assignedIds.push(existingP.id);
        }
        return {
            slotRole: role,
            playerId: existingP ? existingP.id : squad[idx % squad.length].id
        };
    });
}

function updateHeaderUI() {
    const team = getUserTeam();
    document.getElementById('header-club-badge-wrap').innerHTML = getClubBadgeSVG(team, "w-8 h-8", "text-[8px]");
    
    document.getElementById('header-club-name').innerText = team.name;
    document.getElementById('header-budget').innerText = `${team.budget}M`;
    document.getElementById('header-league-tag').innerText = gameState.selectedLeagueKey === 'EPL' ? "Premier League" : "La Liga";
    document.getElementById('header-gw').innerText = `Pekan ${gameState.currentGW}/${gameState.fixtures.length || 38}`;
}

function generateRoundRobinFixtures() {
    const teamIds = gameState.teams.map(t => t.id);
    const n = teamIds.length;
    
    if (n < 2) {
        gameState.fixtures = [];
        return;
    }

    const rounds = [];
    let list = [...teamIds];

    for (let round = 0; round < n - 1; round++) {
        const matches = [];
        for (let i = 0; i < n / 2; i++) {
            const home = list[i];
            const away = list[n - 1 - i];
            matches.push({
                home: round % 2 === 0 ? home : away,
                away: round % 2 === 0 ? away : home,
                played: false, homeScore: null, awayScore: null
            });
        }
        rounds.push(matches);
        list.splice(1, 0, list.pop());
    }

    const secondHalf = rounds.map(round => round.map(m => ({
        home: m.away, away: m.home, played: false, homeScore: null, awayScore: null
    })));

    gameState.fixtures = [...rounds, ...secondHalf];
}

function initStandings() {
    gameState.standings = gameState.teams.map(team => ({
        teamId: team.id, name: team.name, short: team.short, primaryColor: team.primaryColor,
        mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
    }));
}

function sortStandings() {
    gameState.standings.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
    });
}

function switchTab(tabName) {
    const screens = ['dashboard', 'squad', 'match', 'week-summary', 'standings', 'fixtures', 'transfers'];
    screens.forEach(s => {
        const el = document.getElementById(`screen-${s}`);
        if (el) el.classList.add('hidden');
        const navBtn = document.getElementById(`nav-${s}`);
        if (navBtn) navBtn.className = "nav-item flex flex-col items-center justify-center py-1 text-slate-400 font-medium hover:text-slate-200 transition";
    });

    document.getElementById(`screen-${tabName}`).classList.remove('hidden');
    const activeNav = document.getElementById(`nav-${tabName}`);
    if (activeNav) activeNav.className = "nav-item flex flex-col items-center justify-center py-1 text-superteal-400 font-bold transition";

    if (tabName === 'dashboard') renderDashboard();
    if (tabName === 'squad') renderSquadAndTacticsScreen();
    if (tabName === 'match') prepareMatchdayView();
    if (tabName === 'standings') renderStandingsPage();
    if (tabName === 'fixtures') renderFixturesPage(gameState.currentGW);
    if (tabName === 'transfers') renderTransferMarket();
}

function renderDashboard() {
    const userTeam = getUserTeam();
    document.getElementById('dash-welcome-title').innerText = userTeam.name;
    document.getElementById('dash-league-name-tag').innerHTML = `
        <i class="fa-solid fa-trophy"></i> ${gameState.selectedLeagueKey === 'EPL' ? 'Premier League 2026/2027' : 'La Liga 2026/2027'}
    `;

    sortStandings();
    const rankIndex = gameState.standings.findIndex(s => s.teamId === userTeam.id);
    const userStanding = gameState.standings[rankIndex] || { pts: 0 };

    document.getElementById('dash-stat-rank').innerText = `${rankIndex + 1} / ${gameState.teams.length}`;
    document.getElementById('dash-stat-budget').innerText = `£${userTeam.budget}M`;
    document.getElementById('dash-stat-pts').innerText = `${userStanding.pts} Pts`;

    const startingIds = gameState.tactics.startingSlots.map(s => s.playerId);
    const startingPlayers = userTeam.squad.filter(p => startingIds.includes(p.id));
    const avgOvr = Math.round(startingPlayers.reduce((sum, p) => sum + p.ovr, 0) / (startingPlayers.length || 1));
    document.getElementById('dash-stat-ovr').innerText = avgOvr;

    if (gameState.currentGW <= gameState.fixtures.length) {
        const gwFixtures = gameState.fixtures[gameState.currentGW - 1];
        const userFixture = gwFixtures.find(m => m.home === userTeam.id || m.away === userTeam.id);

        if (userFixture) {
            const homeTeam = gameState.teams.find(t => t.id === userFixture.home);
            const awayTeam = gameState.teams.find(t => t.id === userFixture.away);

            document.getElementById('dash-next-gw').innerText = `Pekan ${gameState.currentGW}`;
            document.getElementById('dash-next-home-badge').innerHTML = getClubBadgeSVG(homeTeam, "w-8 h-8", "text-[8px]");
            document.getElementById('dash-next-home-name').innerText = homeTeam.name;

            document.getElementById('dash-next-away-badge').innerHTML = getClubBadgeSVG(awayTeam, "w-8 h-8", "text-[8px]");
            document.getElementById('dash-next-away-name').innerText = awayTeam.name;
        }
    }

    const top5 = gameState.standings.slice(0, 5);
    document.getElementById('dash-mini-table').innerHTML = top5.map((s, idx) => {
        const teamObj = gameState.teams.find(t => t.id === s.teamId);
        return `
            <tr class="${s.teamId === userTeam.id ? 'bg-superteal-500/10 font-bold' : ''}">
                <td class="py-1 text-slate-400">${idx + 1}</td>
                <td class="py-1 text-slate-200 flex items-center gap-1.5 truncate">
                    ${getClubBadgeSVG(teamObj, "w-4 h-4", "text-[5px]")}
                    <span class="truncate">${s.name}</span>
                </td>
                <td class="py-1 text-center text-slate-400">${s.mp}</td>
                <td class="py-1 text-right text-superteal-400 font-bold">${s.pts}</td>
            </tr>
        `;
    }).join('');
}

function cycleCaptain() {
    const userTeam = getUserTeam();
    const startingIds = gameState.tactics.startingSlots.map(s => s.playerId);
    const starters = userTeam.squad.filter(p => startingIds.includes(p.id));
    
    let currentIdx = starters.findIndex(p => p.id === gameState.tactics.captainId);
    currentIdx = (currentIdx + 1) % (starters.length || 1);
    gameState.tactics.captainId = starters[currentIdx].id;
    
    autoSaveGame();
    renderSquadAndTacticsScreen();
    showToast(`Kapten tim: ${starters[currentIdx].name}`, 'info');
}

function cyclePressingStyle() {
    const styles = ["Soft", "Medium", "High"];
    let idx = styles.indexOf(gameState.tactics.pressing);
    gameState.tactics.pressing = styles[(idx + 1) % styles.length];
    document.getElementById('tactic-pressing-label').innerText = gameState.tactics.pressing;
    autoSaveGame();
    showToast(`Tekanan: ${gameState.tactics.pressing}`, 'info');
}

function cycleMovementStyle() {
    const opts = ["Pergerakan", "Bebas", "Disiplin"];
    let idx = opts.indexOf(gameState.tactics.movement);
    gameState.tactics.movement = opts[(idx + 1) % opts.length];
    document.getElementById('btn-movement-label').innerText = gameState.tactics.movement;
    autoSaveGame();
    showToast(`Gaya Pergerakan: ${gameState.tactics.movement}`, 'info');
}

function cyclePassingStyle() {
    const opts = ["Umpan", "Pendek", "Jauh"];
    let idx = opts.indexOf(gameState.tactics.passing);
    gameState.tactics.passing = opts[(idx + 1) % opts.length];
    document.getElementById('btn-passing-label').innerText = gameState.tactics.passing;
    autoSaveGame();
    showToast(`Gaya Umpan: ${gameState.tactics.passing}`, 'info');
}

function openFormationModal() {
    document.getElementById('modal-formation').classList.remove('hidden');
}

function closeFormationModal() {
    document.getElementById('modal-formation').classList.add('hidden');
}

function setFormation(form) {
    gameState.tactics.formation = form;
    buildStartingSlotsForFormation(form);
    closeFormationModal();
    autoSaveGame();
    renderSquadAndTacticsScreen();
    showToast(`Formasi diubah ke ${form}`, 'success');
}

function renderSquadAndTacticsScreen() {
    const userTeam = getUserTeam();
    
    const captain = userTeam.squad.find(p => p.id === gameState.tactics.captainId) || userTeam.squad[0];
    document.getElementById('tactic-captain-name').innerText = captain.name;
    document.getElementById('tactic-pressing-label').innerText = gameState.tactics.pressing;
    document.getElementById('tactic-formation-label').innerText = gameState.tactics.formation;

    renderPitchSlots();
    renderBenchHorizontalList();

    if (gameState.currentGW <= gameState.fixtures.length) {
        const gwFixtures = gameState.fixtures[gameState.currentGW - 1];
        const userFixture = gwFixtures.find(m => m.home === userTeam.id || m.away === userTeam.id);
        if (userFixture) {
            const homeTeam = gameState.teams.find(t => t.id === userFixture.home);
            const awayTeam = gameState.teams.find(t => t.id === userFixture.away);

            document.getElementById('tactics-match-gw').innerText = `Pekan ${gameState.currentGW}`;
            
            const homeAvg = Math.round(homeTeam.squad.reduce((a, b) => a + b.ovr, 0) / homeTeam.squad.length);
            const awayAvg = Math.round(awayTeam.squad.reduce((a, b) => a + b.ovr, 0) / awayTeam.squad.length);

            document.getElementById('tactics-home-ovr').innerText = homeAvg;
            document.getElementById('tactics-away-ovr').innerText = awayAvg;

            document.getElementById('tactics-home-badge-wrap').innerHTML = getClubBadgeSVG(homeTeam, "w-6 h-6", "text-[6px]");
            document.getElementById('tactics-away-badge-wrap').innerHTML = getClubBadgeSVG(awayTeam, "w-6 h-6", "text-[6px]");
        }
    }
}

function renderPitchSlots() {
    const container = document.getElementById('tactics-pitch-container');
    const slots = gameState.tactics.startingSlots;

    const gkSlots = slots.filter(s => s.slotRole === 'GK');
    const defSlots = slots.filter(s => s.slotRole === 'CB' || s.slotRole === 'FB');
    const midSlots = slots.filter(s => s.slotRole === 'M');
    const fwdSlots = slots.filter(s => s.slotRole === 'F');

    container.innerHTML = `
        <div class="flex flex-col justify-center items-center h-full space-y-2">
            ${gkSlots.map(s => renderPlayerCardOnPitch(s)).join('')}
        </div>
        <div class="flex flex-col justify-around items-center h-full py-1">
            ${defSlots.map(s => renderPlayerCardOnPitch(s)).join('')}
        </div>
        <div class="flex flex-col justify-around items-center h-full py-1">
            ${midSlots.map(s => renderPlayerCardOnPitch(s)).join('')}
        </div>
        <div class="flex flex-col justify-around items-center h-full py-1">
            ${fwdSlots.map(s => renderPlayerCardOnPitch(s)).join('')}
        </div>
    `;
}

function renderPlayerCardOnPitch(slot) {
    const userTeam = getUserTeam();
    const player = userTeam.squad.find(p => p.id === slot.playerId);
    if (!player) return '';

    const isSelected = selectedSwapPlayerId === player.id;
    const displayedPositionRole = slot.slotRole;

    return `
        <div draggable="true" 
             data-player-id="${player.id}"
             ondragstart="handleDragStart(event)" 
             ondragover="handleDragOver(event)" 
             ondragleave="handleDragLeave(event)"
             ondrop="handleDrop(event)"
             ontouchstart="handleTouchStart(event)"
             ontouchmove="handleTouchMove(event)"
             ontouchend="handleTouchEnd(event)"
             onclick="handlePlayerClick('${player.id}')"
             class="tactics-card flex flex-col items-center justify-center relative ${isSelected ? 'selected-for-swap' : ''}">
            
            <div class="relative">
                <img src="${player.img}" alt="${player.name}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-slate-400 bg-slate-900 object-cover shadow-lg pointer-events-none">
                
                <div class="absolute -top-1 -right-2 bg-slate-900/90 border border-slate-600 rounded-full px-1 py-0.2 flex items-center space-x-0.5 text-[8px] font-black shadow pointer-events-none">
                    <span class="text-amber-400">${player.ovr}</span>
                    <span class="text-superteal-400 uppercase font-extrabold">${displayedPositionRole}</span>
                    <span class="text-slate-400 text-[7px]">${player.foot}</span>
                </div>
            </div>

            <div class="bg-slate-950/80 border border-slate-700/80 px-1.5 py-0.2 rounded-full mt-0.5 max-w-[65px] truncate shadow pointer-events-none">
                <span class="text-[8px] font-bold text-white truncate block text-center">${player.name.split(' ').pop()}</span>
            </div>
        </div>
    `;
}

function renderBenchHorizontalList() {
    const container = document.getElementById('bench-horizontal-list');
    const userTeam = getUserTeam();
    const startingIds = gameState.tactics.startingSlots.map(s => s.playerId);
    const benchPlayers = userTeam.squad.filter(p => !startingIds.includes(p.id));

    container.innerHTML = benchPlayers.map(p => {
        const isSelected = selectedSwapPlayerId === p.id;
        return `
            <div draggable="true" 
                 data-player-id="${p.id}"
                 ondragstart="handleDragStart(event)" 
                 ondragover="handleDragOver(event)" 
                 ondragleave="handleDragLeave(event)"
                 ondrop="handleDrop(event)"
                 ontouchstart="handleTouchStart(event)"
                 ontouchmove="handleTouchMove(event)"
                 ontouchend="handleTouchEnd(event)"
                 onclick="handlePlayerClick('${p.id}')"
                 class="tactics-card flex flex-col items-center justify-center flex-shrink-0 relative ${isSelected ? 'selected-for-swap' : ''}">
                
                <div class="relative">
                    <img src="${p.img}" alt="${p.name}" class="w-9 h-9 rounded-full border border-slate-500 bg-slate-900 object-cover shadow pointer-events-none">
                    
                    <div class="absolute -top-1 -right-2 bg-slate-900 border border-slate-700 rounded-full px-1 py-0.2 flex items-center space-x-0.5 text-[8px] font-black shadow pointer-events-none">
                        <span class="text-amber-400">${p.ovr}</span>
                        <span class="text-superteal-400 font-extrabold uppercase">${p.pos}</span>
                        <span class="text-slate-400 text-[7px]">${p.foot}</span>
                    </div>
                </div>

                <span class="text-[8px] font-bold text-slate-200 mt-0.5 max-w-[60px] truncate block text-center pointer-events-none">${p.name.split(' ').pop()}</span>
            </div>
        `;
    }).join('');
}

/* DRAG & DROP AND TOUCH HANDLERS WITH SMOOTH ANIMATION */
let draggedPlayerId = null;
let touchStartPlayerId = null;
let touchGhostEl = null;

function setupTouchDragGhostListeners() {
    touchGhostEl = document.getElementById('touch-ghost');
}

function handleDragStart(e) {
    draggedPlayerId = e.currentTarget.getAttribute('data-player-id');
    e.dataTransfer.setData('text/plain', draggedPlayerId);
    e.currentTarget.classList.add('is-dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    document.querySelectorAll('.tactics-card').forEach(c => c.classList.remove('is-dragging'));

    const targetId = e.currentTarget.getAttribute('data-player-id');
    if (draggedPlayerId && targetId && draggedPlayerId !== targetId) {
        executePlayerSwap(draggedPlayerId, targetId);
    }
    draggedPlayerId = null;
}

function handleTouchStart(e) {
    const target = e.currentTarget;
    touchStartPlayerId = target.getAttribute('data-player-id');
    target.classList.add('is-dragging');
    
    const player = getUserTeam().squad.find(p => p.id === touchStartPlayerId);
    if (player && touchGhostEl) {
        document.getElementById('ghost-ovr').innerText = player.ovr;
        document.getElementById('ghost-pos').innerText = player.pos;
    }
}

function handleTouchMove(e) {
    if (!touchStartPlayerId) return;
    const touch = e.touches[0];

    if (touchGhostEl) {
        touchGhostEl.classList.add('active');
        touchGhostEl.style.left = `${touch.clientX}px`;
        touchGhostEl.style.top = `${touch.clientY}px`;
    }

    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardBelow = elemBelow ? elemBelow.closest('.tactics-card') : null;

    document.querySelectorAll('.tactics-card').forEach(c => c.classList.remove('drag-over'));
    if (cardBelow && cardBelow.getAttribute('data-player-id') !== touchStartPlayerId) {
        cardBelow.classList.add('drag-over');
    }
}

function handleTouchEnd(e) {
    if (!touchStartPlayerId) return;
    
    if (touchGhostEl) {
        touchGhostEl.classList.remove('active');
    }

    document.querySelectorAll('.tactics-card').forEach(c => {
        c.classList.remove('is-dragging');
        c.classList.remove('drag-over');
    });

    const changedTouch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
    const cardBelow = elemBelow ? elemBelow.closest('.tactics-card') : null;

    if (cardBelow) {
        const targetId = cardBelow.getAttribute('data-player-id');
        if (targetId && targetId !== touchStartPlayerId) {
            executePlayerSwap(touchStartPlayerId, targetId);
        }
    }

    touchStartPlayerId = null;
}

function handlePlayerClick(playerId) {
    if (!selectedSwapPlayerId) {
        selectedSwapPlayerId = playerId;
        showToast('Pilih pemain kedua untuk ditukar.', 'info');
    } else if (selectedSwapPlayerId === playerId) {
        selectedSwapPlayerId = null;
    } else {
        executePlayerSwap(selectedSwapPlayerId, playerId);
        selectedSwapPlayerId = null;
    }
    renderSquadAndTacticsScreen();
}

function executePlayerSwap(p1Id, p2Id) {
    const slots = gameState.tactics.startingSlots;
    const slot1Index = slots.findIndex(s => s.playerId === p1Id);
    const slot2Index = slots.findIndex(s => s.playerId === p2Id);

    if (slot1Index !== -1 && slot2Index !== -1) {
        slots[slot1Index].playerId = p2Id;
        slots[slot2Index].playerId = p1Id;
    }
    else if (slot1Index !== -1 && slot2Index === -1) {
        slots[slot1Index].playerId = p2Id;
    }
    else if (slot1Index === -1 && slot2Index !== -1) {
        slots[slot2Index].playerId = p1Id;
    }

    autoSaveGame();
    renderSquadAndTacticsScreen();

    // Animasi Swap Pop Mulus
    setTimeout(() => {
        const card1 = document.querySelector(`[data-player-id="${p1Id}"]`);
        const card2 = document.querySelector(`[data-player-id="${p2Id}"]`);
        if (card1) card1.classList.add('card-swapped');
        if (card2) card2.classList.add('card-swapped');
    }, 50);

    showToast('Pemain berhasil ditukar!', 'success');
}

function goToMatchSimulation() {
    switchTab('match');
}

function goToWeekSummaryScreen() {
    switchTab('week-summary');
    document.getElementById('week-summary-gw-title').innerText = `Pekan ${gameState.currentGW}`;

    const gwFixtures = gameState.fixtures[gameState.currentGW - 1] || [];
    const container = document.getElementById('week-summary-matches-container');

    container.innerHTML = gwFixtures.map(m => {
        const home = gameState.teams.find(t => t.id === m.home);
        const away = gameState.teams.find(t => t.id === m.away);
        const isUserMatch = home.id === gameState.userTeamId || away.id === gameState.userTeamId;

        return `
            <div class="bg-slate-950/90 border ${isUserMatch ? 'border-superteal-500/60 bg-superteal-950/20' : 'border-slate-800'} rounded-2xl p-2.5 flex items-center justify-between text-xs shadow">
                <div class="flex items-center space-x-2 w-2/5 truncate">
                    ${getClubBadgeSVG(home, "w-6 h-6", "text-[6px]")}
                    <span class="font-bold text-slate-100 truncate">${home.name}</span>
                </div>

                <div class="text-center px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl min-w-[65px]">
                    <span class="font-mono font-black text-superteal-400 text-sm">${m.homeScore} - ${m.awayScore}</span>
                </div>

                <div class="flex items-center justify-end space-x-2 w-2/5 text-right truncate">
                    <span class="font-bold text-slate-100 truncate">${away.name}</span>
                    ${getClubBadgeSVG(away, "w-6 h-6", "text-[6px]")}
                </div>
            </div>
        `;
    }).join('');
}

function finishWeekAndGoHome() {
    gameState.currentGW += 1;
    autoSaveGame();
    updateHeaderUI();
    switchTab('dashboard');
    showToast(`Pekan ke-${gameState.currentGW - 1} selesai! Selamat datang di Pekan ${gameState.currentGW}.`, 'success');
}

function renderStandingsPage() {
    sortStandings();
    document.getElementById('standings-league-title').innerText = `Klasemen ${gameState.selectedLeagueKey === 'EPL' ? 'Premier League' : 'La Liga'}`;
    
    const body = document.getElementById('standings-table-body');
    const userTeam = getUserTeam();

    body.innerHTML = gameState.standings.map((s, idx) => {
        const pos = idx + 1;
        let highlightClass = "";
        if (pos <= 4) highlightClass = "border-l-2 border-l-blue-500";
        else if (pos <= 6) highlightClass = "border-l-2 border-l-amber-500";
        else if (pos >= gameState.standings.length - 2) highlightClass = "border-l-2 border-l-rose-500";

        const isUser = s.teamId === userTeam.id;
        const teamObj = gameState.teams.find(t => t.id === s.teamId);

        return `
            <tr class="${highlightClass} ${isUser ? 'bg-superteal-500/10 font-bold text-white' : 'hover:bg-slate-900/60 text-slate-300'}">
                <td class="py-2 px-2 text-center font-bold">${pos}</td>
                <td class="py-2 px-2 flex items-center space-x-2 truncate">
                    ${getClubBadgeSVG(teamObj, "w-5 h-5", "text-[5px]")}
                    <span class="truncate">${s.name}</span>
                </td>
                <td class="py-2 px-1 text-center text-slate-400">${s.mp}</td>
                <td class="py-2 px-1 text-center text-slate-400">${s.w}</td>
                <td class="py-2 px-1 text-center text-slate-400">${s.d}</td>
                <td class="py-2 px-1 text-center text-slate-400">${s.l}</td>
                <td class="py-2 px-1 text-center text-slate-400">${s.gd > 0 ? '+' + s.gd : s.gd}</td>
                <td class="py-2 px-2 text-center font-black text-superteal-400">${s.pts}</td>
            </tr>
        `;
    }).join('');
}

function renderFixturesPage(gwSelect) {
    const selectEl = document.getElementById('select-gw-view');
    const totalRounds = gameState.fixtures.length || 1;
    
    selectEl.innerHTML = '';
    for (let i = 1; i <= totalRounds; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.text = `Pekan ${i}`;
        if (i === (gwSelect || gameState.currentGW)) opt.selected = true;
        selectEl.appendChild(opt);
    }

    const targetGW = gwSelect || gameState.currentGW;
    const fixtures = gameState.fixtures[targetGW - 1] || [];
    const container = document.getElementById('fixtures-list-container');

    container.innerHTML = fixtures.map(m => {
        const home = gameState.teams.find(t => t.id === m.home);
        const away = gameState.teams.find(t => t.id === m.away);
        const isUserMatch = home.id === gameState.userTeamId || away.id === gameState.userTeamId;

        return `
            <div class="bg-slate-950/80 border ${isUserMatch ? 'border-superteal-500/50 bg-slate-900/50' : 'border-slate-800'} rounded-2xl p-2.5 flex items-center justify-between text-xs">
                <div class="flex items-center space-x-2 w-2/5 truncate">
                    ${getClubBadgeSVG(home, "w-6 h-6", "text-[6px]")}
                    <span class="font-bold text-slate-200 truncate">${home.name}</span>
                </div>

                <div class="text-center px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md min-w-[50px]">
                    ${m.played ? `
                        <span class="font-mono font-black text-superteal-400">${m.homeScore} - ${m.awayScore}</span>
                    ` : `
                        <span class="text-[10px] font-bold text-slate-400">VS</span>
                    `}
                </div>

                <div class="flex items-center justify-end space-x-2 w-2/5 text-right truncate">
                    <span class="font-bold text-slate-200 truncate">${away.name}</span>
                    ${getClubBadgeSVG(away, "w-6 h-6", "text-[6px]")}
                </div>
            </div>
        `;
    }).join('');
}

function setTransferMode(mode) {
    gameState.transferMode = mode;
    const buyBtn = document.getElementById('transfer-mode-buy-btn');
    const sellBtn = document.getElementById('transfer-mode-sell-btn');

    if (mode === 'buy') {
        buyBtn.className = "px-3 py-1 rounded-lg text-xs font-bold bg-superteal-500 text-slate-950";
        sellBtn.className = "px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800";
    } else {
        sellBtn.className = "px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950";
        buyBtn.className = "px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800";
    }

    renderTransferMarket();
}

function renderTransferMarket() {
    const userTeam = getUserTeam();
    document.getElementById('transfer-budget-display').innerText = `£${userTeam.budget}M`;

    const searchVal = document.getElementById('transfer-search').value.toLowerCase();
    const posVal = document.getElementById('transfer-pos-filter').value;

    let pool = [];

    if (gameState.transferMode === 'buy') {
        gameState.teams.forEach(t => {
            if (t.id !== userTeam.id) {
                t.squad.forEach(p => pool.push({ ...p, clubName: t.name, clubId: t.id }));
            }
        });
    } else {
        userTeam.squad.forEach(p => pool.push({ ...p, clubName: userTeam.name, clubId: userTeam.id }));
    }

    if (posVal !== 'ALL') pool = pool.filter(p => p.pos === posVal);
    if (searchVal) pool = pool.filter(p => p.name.toLowerCase().includes(searchVal));

    pool.sort((a, b) => b.ovr - a.ovr);

    const grid = document.getElementById('transfer-cards-grid');

    if (pool.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-6 text-center text-xs text-slate-400">Pemain tidak ditemukan.</div>`;
        return;
    }

    grid.innerHTML = pool.map(p => {
        const isBuy = gameState.transferMode === 'buy';
        const canAfford = userTeam.budget >= p.val;

        return `
            <div class="bg-slate-950 border border-slate-800/90 rounded-2xl p-2.5 flex flex-col justify-between space-y-2 shadow">
                <div class="space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-superteal-500/20 text-superteal-400 border border-superteal-500/30">${p.pos}</span>
                        <span class="text-xs font-black text-amber-400">${p.ovr} OVR</span>
                    </div>
                    <div class="flex items-center space-x-2 pt-1">
                        <img src="${p.img}" alt="${p.name}" class="w-8 h-8 rounded-full border border-slate-600 bg-slate-900 object-cover flex-shrink-0">
                        <div class="truncate">
                            <h4 class="font-bold text-xs text-white truncate">${p.name}</h4>
                            <p class="text-[10px] text-slate-400 truncate">${p.clubName} • Umur ${p.age}</p>
                        </div>
                    </div>
                </div>

                <div class="pt-1.5 border-t border-slate-800 flex items-center justify-between">
                    <span class="text-xs font-bold text-superteal-400">£${p.val}M</span>

                    ${isBuy ? `
                        <button onclick="buyPlayer('${p.clubId}', '${p.id}')" ${!canAfford ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg text-xs font-bold ${canAfford ? 'bg-superteal-500 hover:bg-superteal-400 text-slate-950' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} transition">
                            Beli
                        </button>
                    ` : `
                        <button onclick="sellPlayer('${p.id}')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition">
                            Jual
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function buyPlayer(sellerClubId, playerId) {
    const userTeam = getUserTeam();
    const sellerClub = gameState.teams.find(t => t.id === sellerClubId);
    const playerIndex = sellerClub.squad.findIndex(p => p.id === playerId);
    const player = sellerClub.squad[playerIndex];

    if (userTeam.budget < player.val) {
        showToast('Budget tidak mencukupi!', 'error');
        return;
    }

    userTeam.budget -= player.val;
    sellerClub.budget += player.val;

    sellerClub.squad.splice(playerIndex, 1);
    userTeam.squad.push(player);

    autoSaveGame();
    updateHeaderUI();
    renderTransferMarket();
    showToast(`Berhasil merekrut ${player.name} (£${player.val}M)!`, 'success');
}

function sellPlayer(playerId) {
    const userTeam = getUserTeam();
    if (userTeam.squad.length <= 11) {
        showToast('Skuad minimal harus 11 pemain!', 'warning');
        return;
    }

    const playerIndex = userTeam.squad.findIndex(p => p.id === playerId);
    const player = userTeam.squad[playerIndex];

    userTeam.budget += player.val;
    userTeam.squad.splice(playerIndex, 1);

    const slotIndex = gameState.tactics.startingSlots.findIndex(s => s.playerId === playerId);
    if (slotIndex !== -1) {
        const availableP = userTeam.squad.find(p => !gameState.tactics.startingSlots.map(s => s.playerId).includes(p.id));
        gameState.tactics.startingSlots[slotIndex].playerId = availableP ? availableP.id : userTeam.squad[0].id;
    }

    autoSaveGame();
    updateHeaderUI();
    renderTransferMarket();
    showToast(`Berhasil menjual ${player.name} (£${player.val}M)!`, 'info');
}
