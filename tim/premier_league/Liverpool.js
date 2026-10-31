if (!window.PREMIER_LEAGUE_TEAMS) window.PREMIER_LEAGUE_TEAMS = [];

window.PREMIER_LEAGUE_TEAMS.push({
    id: "LIV",
    name: "Liverpool FC",
    short: "LIV",
    primaryColor: "#C8102E",
    secondaryColor: "#00B2A9",
    stadium: "Anfield",
    budget: 180,
    badgeUrl: "https://www.footylogos.com/dls/logo/rgba-v1/liverpool.png",

    squad: [
        // GOALKEEPERS
        createPlayer("p_liv_1", "Giorgi Mamardashvili", "GK", 85, "L", 26, 30, ""), //[span_3](start_span)[span_3](end_span)
        createPlayer("p_liv_2", "Alisson", "GK", 88, "R", 34, 16, ""), //[span_4](start_span)[span_4](end_span)
        createPlayer("p_liv_3", "Vítězslav Jaroš", "GK", 74, "R", 25, 5, ""), //[span_5](start_span)[span_5](end_span)
        createPlayer("p_liv_4", "Freddie Woodman", "GK", 73, "R", 29, 3, ""), //[span_6](start_span)[span_6](end_span)
        createPlayer("p_liv_5", "Harvey Davies", "GK", 66, "R", 23, 0.5, ""), //[span_7](start_span)[span_7](end_span)

        // DEFENDERS
        createPlayer("p_liv_6", "Jérémy Jacquet", "CB", 81, "R", 21, 65, ""), //[span_8](start_span)[span_8](end_span)
        createPlayer("p_liv_7", "Giovanni Leoni", "CB", 75, "R", 19, 25, ""), //[span_9](start_span)[span_9](end_span)
        createPlayer("p_liv_8", "Ronald Araújo", "CB", 85, "R", 27, 25, ""), //[span_10](start_span)[span_10](end_span)
        createPlayer("p_liv_9", "Virgil van Dijk", "CB", 88, "R", 35, 16, ""), //[span_11](start_span)[span_11](end_span)
        createPlayer("p_liv_10", "Joe Gomez", "CB", 80, "R", 29, 12, ""), //[span_12](start_span)[span_12](end_span)
        createPlayer("p_liv_11", "Milos Kerkez", "FB", 81, "L", 22, 35, ""), //[span_13](start_span)[span_13](end_span)
        createPlayer("p_liv_12", "Konstantinos Tsimikas", "FB", 77, "L", 30, 5, ""), //[span_14](start_span)[span_14](end_span)
        createPlayer("p_liv_13", "Luke Chambers", "FB", 71, "L", 22, 1, ""), //[span_15](start_span)[span_15](end_span)
        createPlayer("p_liv_14", "Jeremie Frimpong", "FB", 84, "R", 25, 30, ""), //[span_16](start_span)[span_16](end_span)
        createPlayer("p_liv_15", "Conor Bradley", "FB", 81, "R", 23, 20, ""), //[span_17](start_span)[span_17](end_span)

        // MIDFIELDERS
        createPlayer("p_liv_16", "Ryan Gravenberch", "M", 86, "R", 24, 75, ""), //[span_18](start_span)[span_18](end_span)
        createPlayer("p_liv_17", "Wataru Endo", "M", 76, "R", 33, 3, ""), //[span_19](start_span)[span_19](end_span)
        createPlayer("p_liv_18", "Alexis Mac Allister", "M", 87, "R", 27, 70, ""), //[span_20](start_span)[span_20](end_span)
        createPlayer("p_liv_19", "Trey Nyoni", "M", 74, "R", 19, 18, ""), //[span_21](start_span)[span_21](end_span)
        createPlayer("p_liv_20", "James McConnell", "M", 71, "R", 22, 1.5, ""), //[span_22](start_span)[span_22](end_span)
        createPlayer("p_liv_21", "Dominik Szoboszlai", "M", 87, "R", 26, 100, ""), //[span_23](start_span)[span_23](end_span)
        createPlayer("p_liv_22", "Florian Wirtz", "M", 89, "R", 23, 85, ""), //[span_24](start_span)[span_24](end_span)

        // FORWARDS
        createPlayer("p_liv_23", "Bradley Barcola", "F", 86, "R", 24, 100, ""), //[span_25](start_span)[span_25](end_span)
        createPlayer("p_liv_24", "Cody Gakpo", "F", 84, "R", 27, 75, ""), //[span_26](start_span)[span_26](end_span)
        createPlayer("p_liv_25", "Rio Ngumoha", "F", 73, "R", 18, 50, ""), //[span_27](start_span)[span_27](end_span)
        createPlayer("p_liv_26", "Víctor Muñoz", "F", 75, "R", 23, 40, ""), //[span_28](start_span)[span_28](end_span)
        createPlayer("p_liv_27", "Federico Chiesa", "F", 79, "R", 29, 10, ""), //[span_29](start_span)[span_29](end_span)
        createPlayer("p_liv_28", "Alexander Isak", "F", 88, "R", 27, 90, ""), //[span_30](start_span)[span_30](end_span)
        createPlayer("p_liv_29", "Hugo Ekitiké", "F", 84, "R", 24, 80, ""), //[span_31](start_span)[span_31](end_span)
        createPlayer("p_liv_30", "Lewis Koumas", "F", 72, "R", 21, 8, ""), //[span_32](start_span)[span_32](end_span)
        createPlayer("p_liv_31", "Jayden Danns", "F", 70, "R", 20, 1, "") //[span_33](start_span)[span_33](end_span)
    ]
});