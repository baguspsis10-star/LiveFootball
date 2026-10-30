if (!window.PREMIER_LEAGUE_TEAMS) window.PREMIER_LEAGUE_TEAMS = [];

window.PREMIER_LEAGUE_TEAMS.push({
    id: "MUN",
    name: "Manchester United",
    short: "MUN",
    primaryColor: "#DA291C",
    secondaryColor: "#FBE122",
    stadium: "Old Trafford",
    budget: 150,
    badgeUrl: "https://www.footylogos.com/dls/logo/rgba-v1/manchester-united.png",

    squad: [
        // GOALKEEPERS
        createPlayer("p_mun_1", "Senne Lammens", "GK", 83, "R", 24, 35, ""),
        createPlayer("p_mun_2", "Karl Darlow", "GK", 76, "R", 36, 2, ""),
        createPlayer("p_mun_3", "Tom Heaton", "GK", 70, "R", 40, 0.5, ""),
        createPlayer("p_mun_4", "Dermot Mee", "GK", 68, "R", 23, 0.3, ""),

        // DEFENDERS
        createPlayer("p_mun_5", "Diogo Dalot", "FB", 82, "R", 27, 30, ""),
        createPlayer("p_mun_6", "Noussair Mazraoui", "FB", 82, "R", 28, 18, ""),
        createPlayer("p_mun_7", "Matthijs de Ligt", "CB", 85, "R", 27, 25, ""),
        createPlayer("p_mun_8", "Harry Maguire", "CB", 80, "R", 33, 8, ""),
        createPlayer("p_mun_9", "Lisandro Martínez", "CB", 84, "L", 28, 45, ""),
        createPlayer("p_mun_10", "Patrick Dorgu", "FB", 80, "L", 22, 35, ""),
        createPlayer("p_mun_11", "Leny Yoro", "CB", 83, "R", 20, 45, ""),
        createPlayer("p_mun_12", "Luke Shaw", "FB", 81, "L", 31, 8, ""),
        createPlayer("p_mun_13", "Ayden Heaven", "CB", 73, "L", 20, 30, ""),
        createPlayer("p_mun_14", "Harry Amass", "FB", 70, "L", 19, 5, ""),

        // MIDFIELDERS
        createPlayer("p_mun_15", "Mason Mount", "M", 82, "R", 27, 25, ""),
        createPlayer("p_mun_16", "Bruno Fernandes", "M", 89, "R", 32, 35, ""),
        createPlayer("p_mun_17", "Andrey Santos", "M", 82, "L", 22, 45, ""),
        createPlayer("p_mun_18", "Youri Tielemans", "M", 84, "R", 29, 40, ""),
        createPlayer("p_mun_19", "Carlos Baleba", "M", 84, "R", 22, 65, ""),
        createPlayer("p_mun_20", "Manuel Ugarte", "M", 80, "R", 25, 20, ""),
        createPlayer("p_mun_21", "Kobbie Mainoo", "M", 84, "R", 21, 75, ""),
        createPlayer("p_mun_22", "Jack Fletcher", "M", 69, "R", 19, 2, ""),
        createPlayer("p_mun_23", "Tyler Fletcher", "M", 68, "R", 19, 2, ""),

        // FORWARDS
        createPlayer("p_mun_24", "Marcus Rashford", "F", 85, "R", 29, 35, ""),
        createPlayer("p_mun_25", "Matheus Cunha", "F", 85, "R", 27, 75, ""),
        createPlayer("p_mun_26", "Joshua Zirkzee", "F", 80, "R", 25, 20, ""),
        createPlayer("p_mun_27", "Amad Diallo", "F", 84, "L", 24, 45, ""),
        createPlayer("p_mun_28", "Bryan Mbeumo", "F", 85, "R", 27, 75, ""),
        createPlayer("p_mun_29", "Benjamin Šeško", "F", 85, "R", 23, 75, ""),
        createPlayer("p_mun_30", "Shea Lacey", "F", 70, "L", 19, 12, ""),
        createPlayer("p_mun_31", "Tynan Thompson", "F", 66, "R", 18, 1, "")
    ]
});