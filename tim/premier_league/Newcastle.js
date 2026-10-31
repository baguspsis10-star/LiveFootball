if (!window.PREMIER_LEAGUE_TEAMS) window.PREMIER_LEAGUE_TEAMS = [];

window.PREMIER_LEAGUE_TEAMS.push({
    id: "NEW",
    name: "Newcastle United",
    short: "NEW",
    primaryColor: "#241F20",
    secondaryColor: "#FFFFFF",
    stadium: "St. James' Park",
    budget: 140,
    badgeUrl: "https://www.footylogos.com/dls/logo/rgba-v1/newcastle-united.png",

    squad: [
        // GOALKEEPERS
        createPlayer("p_new_1", "Lukas Hornicek", "GK", 78, "R", 24, 27, ""), //[span_3](start_span)[span_3](end_span)
        createPlayer("p_new_2", "Ewen Jaouen", "GK", 75, "R", 20, 18, ""), //[span_4](start_span)[span_4](end_span)
        createPlayer("p_new_3", "Nick Pope", "GK", 79, "R", 34, 3, ""), //[span_5](start_span)[span_5](end_span)
        createPlayer("p_new_4", "Mark Gillespie", "GK", 66, "R", 34, 0.1, ""), //[span_6](start_span)[span_6](end_span)

        // DEFENDERS
        createPlayer("p_new_5", "Malick Thiaw", "CB", 83, "R", 25, 50, ""), //[span_7](start_span)[span_7](end_span)
        createPlayer("p_new_6", "Sven Botman", "CB", 82, "L", 26, 35, ""), //[span_8](start_span)[span_8](end_span)
        createPlayer("p_new_7", "Dan Burn", "CB", 77, "L", 34, 4, ""), //[span_9](start_span)[span_9](end_span)
        createPlayer("p_new_8", "Fabian Schär", "CB", 78, "R", 34, 3, ""), //[span_10](start_span)[span_10](end_span)
        createPlayer("p_new_9", "Lewis Hall", "FB", 82, "L", 22, 55, ""), //[span_11](start_span)[span_11](end_span)
        createPlayer("p_new_10", "Tino Livramento", "FB", 82, "R", 23, 45, ""), //[span_12](start_span)[span_12](end_span)
        createPlayer("p_new_11", "Amar Dedic", "FB", 80, "R", 24, 30, ""), //[span_13](start_span)[span_13](end_span)

        // MIDFIELDERS
        createPlayer("p_new_12", "Nico González", "M", 83, "R", 24, 50, ""), //[span_14](start_span)[span_14](end_span)
        createPlayer("p_new_13", "Aladji Bamba", "M", 76, "R", 20, 25, ""), //[span_15](start_span)[span_15](end_span)
        createPlayer("p_new_14", "Jacob Ramsey", "M", 81, "R", 25, 35, ""), //[span_16](start_span)[span_16](end_span)
        createPlayer("p_new_15", "Lewis Miley", "M", 78, "R", 20, 30, ""), //[span_17](start_span)[span_17](end_span)
        createPlayer("p_new_16", "Sean Steur", "M", 72, "R", 18, 22, ""), //[span_18](start_span)[span_18](end_span)
        createPlayer("p_new_17", "Joelinton", "M", 81, "R", 30, 20, ""), //[span_19](start_span)[span_19](end_span)
        createPlayer("p_new_18", "Joe Willock", "M", 78, "R", 27, 18, ""), //[span_20](start_span)[span_20](end_span)

        // FORWARDS
        createPlayer("p_new_19", "Bazoumana Touré", "F", 81, "L", 20, 50, ""), //[span_21](start_span)[span_21](end_span)
        createPlayer("p_new_20", "Harvey Barnes", "F", 80, "R", 28, 35, ""), //[span_22](start_span)[span_22](end_span)
        createPlayer("p_new_21", "Anthony Elanga", "F", 81, "R", 24, 35, ""), //[span_23](start_span)[span_23](end_span)
        createPlayer("p_new_22", "Jacob Murphy", "F", 76, "R", 31, 10, ""), //[span_24](start_span)[span_24](end_span)
        createPlayer("p_new_23", "Matias Fernandez-Pardo", "F", 82, "R", 21, 55, ""), //[span_25](start_span)[span_25](end_span)
        createPlayer("p_new_24", "William Osula", "F", 77, "R", 23, 32, ""), //[span_26](start_span)[span_26](end_span)
        createPlayer("p_new_25", "Yoane Wissa", "F", 79, "R", 30, 25, "") //[span_27](start_span)[span_27](end_span)
    ]
});
