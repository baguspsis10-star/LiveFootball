/* ==========================================================================
   LEAGUES DATA & HELPERS
   ========================================================================== */

const LEAGUES_DATA = {
    EPL: {
        id: "EPL",
        name: "Premier League",
        season: "2026/2027",
        logoUrl: "",
        teamsCount: 20
    },
    LALIGA: {
        id: "LALIGA",
        name: "La Liga",
        season: "2026/2027",
        logoUrl: "",
        teamsCount: 20
    }
};

function getLeagueLogoSVG(leagueKey, sizeClass = "w-6 h-6") {
    const league = LEAGUES_DATA[leagueKey];
    if (league && league.logoUrl && league.logoUrl.trim() !== "") {
        return `<img src="${league.logoUrl.trim()}" alt="${league.name}" class="${sizeClass} object-contain inline-block">`;
    }

    return `
        <div class="${sizeClass} inline-flex items-center justify-center rounded bg-slate-800 border border-slate-700 text-slate-400">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.12-.39 3.79-2.03 4.39-4.14A5.01 5.01 0 0021 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
        </div>
    `;
}
