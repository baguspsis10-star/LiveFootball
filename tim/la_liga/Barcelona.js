if (!window.LA_LIGA_TEAMS) window.LA_LIGA_TEAMS = [];

window.LA_LIGA_TEAMS.push({
    id: "BAR",
    name: "FC Barcelona",
    short: "BAR",
    primaryColor: "#1e3a8a",
    secondaryColor: "#b91c1c",
    stadium: "Camp Nou",
    budget: 110,
    badgeUrl: "https://www.footylogos.com/dls/logo/rgba-v1/fc-barcelona.png",
    squad: [
        createPlayer("p_bar_1", "Marc-André ter Stegen", "GK", 88, "R", 34, 30, ""),
        createPlayer("p_bar_2", "Ronald Araújo", "CB", 86, "R", 27, 70, ""),
        createPlayer("p_bar_3", "Pau Cubarsí", "CB", 83, "R", 19, 55, ""),
        createPlayer("p_bar_4", "Jules Koundé", "FB", 86, "R", 27, 60, ""),
        createPlayer("p_bar_5", "Alejandro Balde", "FB", 83, "L", 22, 45, ""),
        createPlayer("p_bar_6", "Pedri", "M", 88, "R", 23, 90, ""),
        createPlayer("p_bar_7", "Gavi", "M", 86, "R", 22, 80, ""),
        createPlayer("p_bar_8", "Frenkie de Jong", "M", 87, "R", 29, 70, ""),
        createPlayer("p_bar_9", "Lamine Yamal", "F", 89, "L", 19, 150, ""),
        createPlayer("p_bar_10", "Robert Lewandowski", "F", 88, "R", 38, 20, ""),
        createPlayer("p_bar_11", "Raphinha", "F", 87, "L", 29, 65, ""),
        createPlayer("p_bar_12", "Dani Olmo", "M", 86, "R", 28, 60, ""),
        createPlayer("p_bar_13", "Fermín López", "M", 82, "R", 23, 35, ""),
        createPlayer("p_bar_14", "Ferran Torres", "F", 82, "R", 26, 30, "")
    ]
});
