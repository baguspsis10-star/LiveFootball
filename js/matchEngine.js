/* ==========================================================================
   MATCH SIMULATION & CALCULATIONS ENGINE
   ========================================================================== */

function generateRealisticGoals(teamOvr, opponentOvr, isHome) {
    const diff = teamOvr - opponentOvr;
    let lambda = 1.25 + (diff * 0.04) + (isHome ? 0.2 : 0);
    lambda = Math.max(0.3, Math.min(2.8, lambda));

    const rand = Math.random();
    if (lambda < 0.8) {
        if (rand < 0.48) return 0;
        if (rand < 0.82) return 1;
        if (rand < 0.96) return 2;
        return 3;
    } else if (lambda < 1.4) {
        if (rand < 0.32) return 0;
        if (rand < 0.70) return 1;
        if (rand < 0.91) return 2;
        if (rand < 0.98) return 3;
        return 4;
    } else {
        if (rand < 0.20) return 0;
        if (rand < 0.52) return 1;
        if (rand < 0.82) return 2;
        if (rand < 0.95) return 3;
        return 4;
    }
}

function prepareMatchdayView() {
    const userTeam = getUserTeam();
    if (gameState.currentGW > gameState.fixtures.length) {
        showToast("Musim telah berakhir!", "warning");
        return;
    }

    const currentFixtures = gameState.fixtures[gameState.currentGW - 1];
    const userFixture = currentFixtures.find(m => m.home === userTeam.id || m.away === userTeam.id);

    const homeTeam = gameState.teams.find(t => t.id === userFixture.home);
    const awayTeam = gameState.teams.find(t => t.id === userFixture.away);

    matchSimulation.homeTeam = homeTeam;
    matchSimulation.awayTeam = awayTeam;
    matchSimulation.homeScore = 0;
    matchSimulation.awayScore = 0;
    matchSimulation.minute = 0;
    matchSimulation.active = false;
    matchSimulation.homeStats = { shots: 0, target: 0, cards: 0, poss: 50 };
    matchSimulation.awayStats = { shots: 0, target: 0, cards: 0, poss: 50 };
    matchSimulation.scorers = [];

    const homeOvr = Math.round(homeTeam.squad.reduce((a, b) => a + b.ovr, 0) / homeTeam.squad.length);
    const awayOvr = Math.round(awayTeam.squad.reduce((a, b) => a + b.ovr, 0) / awayTeam.squad.length);

    matchSimulation.targetHomeGoals = generateRealisticGoals(homeOvr, awayOvr, true);
    matchSimulation.targetAwayGoals = generateRealisticGoals(awayOvr, homeOvr, false);

    document.getElementById('match-gw-title').innerText = `Pekan ${gameState.currentGW}`;
    document.getElementById('match-status-label').innerText = userFixture.played ? "Selesai" : "Siap Bertanding";
    document.getElementById('match-finish-action-bar').classList.add('hidden');

    document.getElementById('match-home-badge-wrap').innerHTML = getClubBadgeSVG(homeTeam, "w-8 h-8", "text-[8px]");
    document.getElementById('match-home-name').innerText = homeTeam.name;

    document.getElementById('match-away-badge-wrap').innerHTML = getClubBadgeSVG(awayTeam, "w-8 h-8", "text-[8px]");
    document.getElementById('match-away-name').innerText = awayTeam.name;

    if (userFixture.played) {
        document.getElementById('match-home-score').innerText = userFixture.homeScore;
        document.getElementById('match-away-score').innerText = userFixture.awayScore;
        document.getElementById('match-timer').innerText = "90' FT";
        document.getElementById('btn-start-match').disabled = true;
        document.getElementById('btn-start-match').classList.add('opacity-50');
        document.getElementById('match-finish-action-bar').classList.remove('hidden');
    } else {
        document.getElementById('match-home-score').innerText = "0";
        document.getElementById('match-away-score').innerText = "0";
        document.getElementById('match-timer').innerText = "00'";
        document.getElementById('btn-start-match').disabled = false;
        document.getElementById('btn-start-match').classList.remove('opacity-50');
    }

    document.getElementById('match-commentary-box').innerHTML = `
        <div class="p-2 bg-slate-900/50 rounded-lg text-slate-400 text-center italic">
            Selamat datang di ${homeTeam.stadium}. Klik 'Mulai' untuk pertandingan!
        </div>
    `;

    updateMatchStatsUI();
}

function toggleMatchSpeed() {
    if (matchSimulation.speedMs === 300) {
        matchSimulation.speedMs = 100;
        document.getElementById('btn-speed-text').innerText = "3x";
    } else if (matchSimulation.speedMs === 100) {
        matchSimulation.speedMs = 30;
        document.getElementById('btn-speed-text').innerText = "Fast";
    } else {
        matchSimulation.speedMs = 300;
        document.getElementById('btn-speed-text').innerText = "1x";
    }

    if (matchSimulation.active) {
        clearInterval(matchSimulation.interval);
        matchSimulation.interval = setInterval(runMatchTick, matchSimulation.speedMs);
    }
}

function startMatchSimulation() {
    if (matchSimulation.active) return;
    const currentFixtures = gameState.fixtures[gameState.currentGW - 1];
    const userFixture = currentFixtures.find(m => m.home === gameState.userTeamId || m.away === gameState.userTeamId);

    if (userFixture.played) {
        showToast("Pertandingan ini sudah selesai!", "info");
        return;
    }

    matchSimulation.active = true;
    document.getElementById('match-status-label').innerText = "Berlangsung...";
    addCommentary(`Kick Off! Pertandingan pekan ${gameState.currentGW} dimulai!`, 'system');

    matchSimulation.interval = setInterval(runMatchTick, matchSimulation.speedMs);
}

function runMatchTick() {
    matchSimulation.minute += 1;
    document.getElementById('match-timer').innerText = `${matchSimulation.minute}'`;

    const home = matchSimulation.homeTeam;
    const away = matchSimulation.awayTeam;

    const homeOvr = Math.round(home.squad.reduce((a, b) => a + b.ovr, 0) / home.squad.length);
    const awayOvr = Math.round(away.squad.reduce((a, b) => a + b.ovr, 0) / away.squad.length);
    const possBase = Math.min(68, Math.max(32, 50 + (homeOvr - awayOvr) * 1.2));
    matchSimulation.homeStats.poss = Math.round(possBase + (Math.floor(Math.random() * 5) - 2));
    matchSimulation.awayStats.poss = 100 - matchSimulation.homeStats.poss;

    const min = matchSimulation.minute;

    if (matchSimulation.homeScore < matchSimulation.targetHomeGoals) {
        const prob = (matchSimulation.targetHomeGoals - matchSimulation.homeScore) / (91 - min);
        if (Math.random() < prob) {
            scoreGoal(home, away, true, min);
        }
    }

    if (matchSimulation.awayScore < matchSimulation.targetAwayGoals) {
        const prob = (matchSimulation.targetAwayGoals - matchSimulation.awayScore) / (91 - min);
        if (Math.random() < prob) {
            scoreGoal(home, away, false, min);
        }
    }

    if (Math.random() < 0.12) {
        const isHome = Math.random() * 100 < matchSimulation.homeStats.poss;
        const attackingTeam = isHome ? home : away;
        const defendingTeam = isHome ? away : home;

        if (isHome) {
            matchSimulation.homeStats.shots += 1;
            if (Math.random() < 0.4) matchSimulation.homeStats.target += 1;
        } else {
            matchSimulation.awayStats.shots += 1;
            if (Math.random() < 0.4) matchSimulation.awayStats.target += 1;
        }

        if (Math.random() < 0.2) {
            addCommentary(`Peluang dari ${attackingTeam.name}! Tembakan ditepis kiper ${defendingTeam.name}. (${min}')`, 'action');
        } else if (Math.random() < 0.1) {
            addCommentary(`🟨 Pelanggaran! Kartu kuning untuk pemain ${defendingTeam.name}. (${min}')`, 'card');
        }
    }

    updateMatchStatsUI();

    if (matchSimulation.minute >= 90) {
        clearInterval(matchSimulation.interval);
        matchSimulation.active = false;
        document.getElementById('match-status-label').innerText = "Selesai";
        document.getElementById('match-timer').innerText = "90' FT";

        addCommentary(`Peluit Panjang! Skor akhir: ${home.name} ${matchSimulation.homeScore} - ${matchSimulation.awayScore} ${away.name}.`, 'system');

        const currentFixtures = gameState.fixtures[gameState.currentGW - 1];
        const userFixture = currentFixtures.find(m => m.home === gameState.userTeamId || m.away === gameState.userTeamId);
        userFixture.played = true;
        userFixture.homeScore = matchSimulation.homeScore;
        userFixture.awayScore = matchSimulation.awayScore;

        autoSimulateOtherMatchesInGW(gameState.currentGW);
        recalculateStandings();

        document.getElementById('match-finish-action-bar').classList.remove('hidden');
        showToast(`Pertandingan selesai! Klik tombol di bawah untuk melihat hasil pekan ini.`, 'success');
    }
}

function scoreGoal(attackingTeam, defendingTeam, isHome, min) {
    const scorer = attackingTeam.squad[Math.floor(Math.random() * attackingTeam.squad.length)];
    if (isHome) {
        matchSimulation.homeScore += 1;
        matchSimulation.homeStats.shots += 1;
        matchSimulation.homeStats.target += 1;
    } else {
        matchSimulation.awayScore += 1;
        matchSimulation.awayStats.shots += 1;
        matchSimulation.awayStats.target += 1;
    }

    document.getElementById('match-home-score').innerText = matchSimulation.homeScore;
    document.getElementById('match-away-score').innerText = matchSimulation.awayScore;

    matchSimulation.scorers.push({ team: attackingTeam.short, name: scorer.name, min });
    addCommentary(`⚽ GOL! ${scorer.name} mencetak gol ke gawang ${defendingTeam.name}! (${min}')`, 'goal');
}

function addCommentary(text, type = 'action') {
    const box = document.getElementById('match-commentary-box');
    let colorClass = "bg-slate-900 border-slate-800 text-slate-300";

    if (type === 'goal') colorClass = "bg-superteal-950/80 border-superteal-500/50 text-superteal-300 font-bold border-l-4 border-l-superteal-400";
    if (type === 'card') colorClass = "bg-amber-950/60 border-amber-500/30 text-amber-300";
    if (type === 'system') colorClass = "bg-slate-800/80 border-slate-600 text-slate-200 font-semibold";

    const item = document.createElement('div');
    item.className = `p-2 rounded-xl border text-[11px] transition ${colorClass}`;
    item.innerText = text;

    box.prepend(item);
}

function updateMatchStatsUI() {
    document.getElementById('stat-poss-home').innerText = `${matchSimulation.homeStats.poss}%`;
    document.getElementById('stat-poss-away').innerText = `${matchSimulation.awayStats.poss}%`;
    document.getElementById('bar-poss-home').style.width = `${matchSimulation.homeStats.poss}%`;
    document.getElementById('bar-poss-away').style.width = `${matchSimulation.awayStats.poss}%`;

    document.getElementById('stat-shots-home').innerText = matchSimulation.homeStats.shots;
    document.getElementById('stat-shots-away').innerText = matchSimulation.awayStats.shots;

    document.getElementById('stat-target-home').innerText = matchSimulation.homeStats.target;
    document.getElementById('stat-target-away').innerText = matchSimulation.awayStats.target;

    const scorersContainer = document.getElementById('match-scorers-list');
    if (matchSimulation.scorers.length === 0) {
        scorersContainer.innerHTML = "Belum ada gol.";
    } else {
        scorersContainer.innerHTML = matchSimulation.scorers.map(s => `
            <div class="flex items-center justify-between text-slate-200 font-semibold">
                <span>⚽ ${s.name} (${s.team})</span>
                <span class="text-superteal-400 font-mono">${s.min}'</span>
            </div>
        `).join('');
    }
}

function instantSimulateMatch() {
    if (matchSimulation.minute >= 90) return;
    if (matchSimulation.active) {
        clearInterval(matchSimulation.interval);
        matchSimulation.active = false;
    }

    matchSimulation.homeScore = matchSimulation.targetHomeGoals;
    matchSimulation.awayScore = matchSimulation.targetAwayGoals;
    matchSimulation.homeStats.shots = matchSimulation.targetHomeGoals + Math.floor(Math.random() * 5);
    matchSimulation.awayStats.shots = matchSimulation.targetAwayGoals + Math.floor(Math.random() * 5);
    matchSimulation.homeStats.target = matchSimulation.targetHomeGoals + 1;
    matchSimulation.awayStats.target = matchSimulation.targetAwayGoals + 1;

    matchSimulation.minute = 90;
    document.getElementById('match-home-score').innerText = matchSimulation.homeScore;
    document.getElementById('match-away-score').innerText = matchSimulation.awayScore;
    document.getElementById('match-timer').innerText = "90' FT";
    document.getElementById('match-status-label').innerText = "Selesai";

    const currentFixtures = gameState.fixtures[gameState.currentGW - 1];
    const userFixture = currentFixtures.find(m => m.home === gameState.userTeamId || m.away === gameState.userTeamId);
    userFixture.played = true;
    userFixture.homeScore = matchSimulation.homeScore;
    userFixture.awayScore = matchSimulation.awayScore;

    autoSimulateOtherMatchesInGW(gameState.currentGW);
    recalculateStandings();

    document.getElementById('match-finish-action-bar').classList.remove('hidden');
    showToast('Simulasi cepat pertandingan selesai!', 'success');
}

function autoSimulateOtherMatchesInGW(gw) {
    const gwFixtures = gameState.fixtures[gw - 1];
    gwFixtures.forEach(m => {
        if (!m.played) {
            const home = gameState.teams.find(t => t.id === m.home);
            const away = gameState.teams.find(t => t.id === m.away);

            const homeOvr = Math.round(home.squad.reduce((a, b) => a + b.ovr, 0) / home.squad.length);
            const awayOvr = Math.round(away.squad.reduce((a, b) => a + b.ovr, 0) / away.squad.length);

            m.homeScore = generateRealisticGoals(homeOvr, awayOvr, true);
            m.awayScore = generateRealisticGoals(awayOvr, homeOvr, false);
            m.played = true;
        }
    });
}

function recalculateStandings() {
    initStandings();

    gameState.fixtures.forEach(round => {
        round.forEach(m => {
            if (m.played) {
                const homeRec = gameState.standings.find(s => s.teamId === m.home);
                const awayRec = gameState.standings.find(s => s.teamId === m.away);

                homeRec.mp += 1;
                awayRec.mp += 1;

                homeRec.gf += m.homeScore;
                homeRec.ga += m.awayScore;
                awayRec.gf += m.awayScore;
                awayRec.ga += m.homeScore;

                homeRec.gd = homeRec.gf - homeRec.ga;
                awayRec.gd = awayRec.gf - awayRec.ga;

                if (m.homeScore > m.awayScore) {
                    homeRec.w += 1; homeRec.pts += 3; awayRec.l += 1;
                } else if (m.homeScore < m.awayScore) {
                    awayRec.w += 1; awayRec.pts += 3; homeRec.l += 1;
                } else {
                    homeRec.d += 1; homeRec.pts += 1;
                    awayRec.d += 1; awayRec.pts += 1;
                }
            }
        });
    });

    sortStandings();
}
