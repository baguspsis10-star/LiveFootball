/* ==========================================================================
   GLOBAL HELPERS & PLACEHOLDERS
   ========================================================================== */

const BLANK_PLAYER_SILHOUETTE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23334155'/><circle cx='50' cy='38' r='20' fill='%2364748b'/><path d='M15 92 C15 65, 85 65, 85 92 Z' fill='%2364748b'/></svg>";

function createPlayer(id, name, pos, ovr, foot, age, val, imgUrl = "") {
    return {
        id: id,
        name: name,
        pos: pos,
        ovr: ovr,
        foot: foot,
        age: age,
        val: val,
        img: (imgUrl && imgUrl.trim() !== "") ? imgUrl.trim() : BLANK_PLAYER_SILHOUETTE
    };
}

function getClubBadgeSVG(team, sizeClass = "w-8 h-8", textClass = "text-[9px]") {
    if (team && team.badgeUrl && team.badgeUrl.trim() !== "") {
        return `
            <div class="${sizeClass} relative flex items-center justify-center flex-shrink-0 drop-shadow-md overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                <img src="${team.badgeUrl.trim()}" alt="${team.short || 'FC'}" class="w-full h-full object-contain">
            </div>
        `;
    }

    const p = (team && team.primaryColor) || "#334155";
    const s = (team && team.secondaryColor) || "#94a3b8";
    const short = (team && team.short) || "FC";

    return `
        <div class="${sizeClass} relative flex items-center justify-center flex-shrink-0 drop-shadow-md">
            <svg viewBox="0 0 32 36" class="w-full h-full">
                <path d="M16 2 L2 7 V18 C2 26 16 34 16 34 C16 34 30 26 30 18 V7 Z" fill="${p}" stroke="#0f172a" stroke-width="1.5" />
                <path d="M16 4 L4 8 V17 C4 24 16 31 16 31 C16 31 28 24 28 17 V8 Z" fill="none" stroke="${s}" stroke-width="1" opacity="0.5" />
                <circle cx="16" cy="17" r="5" fill="${s}" />
            </svg>
            <span class="absolute bottom-1.5 font-black text-slate-200 ${textClass} tracking-tighter">
                ${short}
            </span>
        </div>
    `;
}

function generateGenericSquad(teamCode, nickname) {
    const positions = ["GK", "CB", "CB", "FB", "FB", "M", "M", "M", "F", "F", "F", "F", "M", "CB"];
    return positions.map((pos, i) => {
        const ovr = 74 + Math.floor(Math.random() * 10);
        return createPlayer(
            `p_${teamCode.toLowerCase()}_${i + 1}`,
            `${nickname} Player ${i + 1}`,
            pos,
            ovr,
            Math.random() > 0.3 ? "R" : "L",
            20 + Math.floor(Math.random() * 12),
            Math.floor(ovr * 0.4),
            ""
        );
    });
}
