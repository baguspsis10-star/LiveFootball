/* ==========================================================================
   DATA AGGREGATOR
   ========================================================================== */

var PREMIER_LEAGUE_TEAMS = window.PREMIER_LEAGUE_TEAMS || [];
var LA_LIGA_TEAMS = window.LA_LIGA_TEAMS || [];

function getTeamsByLeague(leagueKey) {
    if (leagueKey === 'EPL') return PREMIER_LEAGUE_TEAMS;
    if (leagueKey === 'LALIGA') return LA_LIGA_TEAMS;
    return [];
}
