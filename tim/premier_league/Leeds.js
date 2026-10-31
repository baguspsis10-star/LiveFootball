if (!window.PREMIER_LEAGUE_TEAMS) window.PREMIER_LEAGUE_TEAMS = [];

window.PREMIER_LEAGUE_TEAMS.push({
    id: "LEE",
    name: "Leeds United",
    short: "LEE",
    primaryColor: "#FFCD00",
    secondaryColor: "#1D428A",
    stadium: "Elland Road",
    budget: 85,
    badgeUrl: "https://www.footylogos.com/dls/logo/rgba-v1/leeds-united.png",

    squad: [
        // GOALKEEPERS
        createPlayer("p_lee_1", "James Trafford", "GK", 81, "R", 24, 35, ""), //[span_3](start_span)[span_3](end_span)
        createPlayer("p_lee_2", "Michael Zetterer", "GK", 75, "R", 31, 4, ""), //[span_4](start_span)[span_4](end_span)
        createPlayer("p_lee_3", "Alex Cairns", "GK", 65, "R", 33, 0.05, ""), //[span_5](start_span)[span_5](end_span)

        // DEFENDERS
        createPlayer("p_lee_4", "Tarik Muharemović", "CB", 81, "L", 23, 40, ""), //[span_6](start_span)[span_6](end_span)
        createPlayer("p_lee_5", "Jaka Bijol", "CB", 78, "R", 27, 20, ""), //[span_7](start_span)[span_7](end_span)
        createPlayer("p_lee_6", "Joe Rodon", "CB", 77, "R", 29, 18, ""), //[span_8](start_span)[span_8](end_span)
        createPlayer("p_lee_7", "Nico Elvedi", "CB", 76, "R", 30, 12, ""), //[span_9](start_span)[span_9](end_span)
        createPlayer("p_lee_8", "Gabriel Gudmundsson", "FB", 79, "L", 27, 25, ""), //[span_10](start_span)[span_10](end_span)
        createPlayer("p_lee_9", "Melvin Bard", "FB", 76, "L", 25, 10, ""), //[span_11](start_span)[span_11](end_span)
        createPlayer("p_lee_10", "Jayden Bogle", "FB", 77, "R", 26, 18, ""), //[span_12](start_span)[span_12](end_span)
        createPlayer("p_lee_11", "James Justin", "FB", 77, "R", 28, 16, ""), //[span_13](start_span)[span_13](end_span)

        // MIDFIELDERS
        createPlayer("p_lee_12", "Ethan Ampadu", "M", 80, "R", 26, 35, ""), //[span_14](start_span)[span_14](end_span)
        createPlayer("p_lee_13", "Anton Stach", "M", 80, "R", 27, 32, ""), //[span_15](start_span)[span_15](end_span)
        createPlayer("p_lee_14", "Ilia Gruev", "M", 76, "L", 26, 12, ""), //[span_16](start_span)[span_16](end_span)
        createPlayer("p_lee_15", "Ao Tanaka", "M", 77, "R", 28, 15, ""), //[span_17](start_span)[span_17](end_span)
        createPlayer("p_lee_16", "Sean Longstaff", "M", 76, "R", 29, 12, ""), //[span_18](start_span)[span_18](end_span)
        createPlayer("p_lee_17", "Brenden Aaronson", "M", 78, "R", 26, 22, ""), //[span_19](start_span)[span_19](end_span)

        // FORWARDS
        createPlayer("p_lee_18", "Noah Okafor", "F", 80, "R", 26, 32, ""), //[span_20](start_span)[span_20](end_span)
        createPlayer("p_lee_19", "Jean-Mattéo Bahoya", "F", 77, "R", 21, 25, ""), //[span_21](start_span)[span_21](end_span)
        createPlayer("p_lee_20", "Harry Wilson", "F", 78, "L", 29, 22, ""), //[span_22](start_span)[span_22](end_span)
        createPlayer("p_lee_21", "Daniel James", "F", 76, "R", 28, 10, ""), //[span_23](start_span)[span_23](end_span)
        createPlayer("p_lee_22", "Dominic Calvert-Lewin", "F", 79, "R", 29, 25, ""), //[span_24](start_span)[span_24](end_span)[span_25](start_span)[span_25](end_span)
        createPlayer("p_lee_23", "Lukas Nmecha", "F", 76, "R", 27, 10, ""), //[span_26](start_span)[span_26](end_span)
        createPlayer("p_lee_24", "Mateo Joseph", "F", 73, "R", 23, 3.5, "") //[span_27](start_span)[span_27](end_span)
    ]
});
