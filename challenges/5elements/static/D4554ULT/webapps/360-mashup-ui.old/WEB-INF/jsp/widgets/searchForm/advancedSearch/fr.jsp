var whatSection = [
	new AS.Item("Formulation exacte", "ex: \"Etre ou ne pas être\"", "\"%@\"", "Entrez votre formulation ici", ""),
	new AS.Item("Termes exclus", "ex: New -york", "-%@", "Entrez le terme ici", ""), 
	new AS.Item("Termes optionnels", "ex: exalead OPT cloudview", "OPT (%@)", "Entrez le terme ici", ""), 
	new AS.Item("Recherche de proximité", "ex: (finance NEAR marché)", "NEAR %@", "Entrez le terme ici", ""), 
	new AS.Item("Expression logique", "ex:((rapide OR vif) AND NOT véloce)", "(%@)", "Entrez le terme ici", "")
];

var approxSection = [
	new AS.Item("Termes commençant par", "ex: messag*", "%@*", "Entrez le terme ici", ""),
	new AS.Item("Recherche phonétique", "ex: soundslike:téléphone", "soundslike:%@", "Entrez le terme ici", ""),
	new AS.Item("Recherche orthographique approximative", "ex: spellslike:exlaead", "spellslike:%@", "Entrez le terme ici", "")
];

var whereSection = [
	new AS.Item("Type de fichier", "ex: file_extension:pdf", "file_extension:%@", "Entrez l'extension du fichier ici", ""),
	new AS.Item("Recherche postérieure au", "ex: after:12/31/2008", "after:%@", "MM/DD/YYYY", ""),
	new AS.Item("Recherche antérieure au", "ex: before:12/31/2008", "before:%@", "MM/DD/YYYY", ""),
	new AS.Item("Date", "ex: date:12/31/2008", "date:%@", "MM/DD/YYYY", ""),
	new AS.Item("Recherche par titre", "ex: title:exalead", "title:(%@)", "Entrez le terme ici", ""),
	new AS.Item("Recherche de document", "ex: text:\"Etre ou ne pas être\"", "text:(%@)", "Entrez le terme ici", ""),
	new AS.Item("Taille de fichier supérieure à", "ex: file_size>=1000", "file_size>=%@", "1000", ""),
	new AS.Item("Taille de fichier inférieure à", "ex: file_size<=1000", "file_size<=%@", "1000", ""),
	new AS.Item("Recherche dans l'URL", "ex: inurl:musique", "inurl:%@", "Entrez le terme ici", ""),
	new AS.Item("Recherche par site", "ex: site:exalead.com", "site:%@", "Entrez votre site ici", ""),
	new AS.SelectItem("Choisissez une langue", ["Non spécifiée","Afar","Abkhazien","Afrikaans","Amharique","Arabe","Assamais","Aymara","Azerbaïdjanais","Bashkir","Biélorusse","Bulgare","Bihari","Bislama","Bengali","Tibétain","Breton","Catalan","Corse","Tchèque","Gallois","Danois","Allemand","Bhoutani","Grec","Anglais","Espéranto","Espagnol","Estonien","Basque","Persan","Finnois","Fidji","Féroïen","Français","Frison","Irlandais","Gaélique Écossais","Galicien","Guarani","Goujrati","Gaélique de l'île de Man","Haoussa","Hébreu","Hindi","Croate","Hongrois","Arménien","Interlingua","Indonésien","Interlingue","Inupiak","Islandais","Italien","Inuktitut","Japonais","Javanais","Géorgien","Kazakh","Groenlandais","Cambodgien","Kannada","Coréen","Kashmiri","Kurde","Cornique","Kirghiz","Latin","Luxembourgeois","Lingala","Laotien","Lituanien","Letton, Lettonien","Malgache","Maori","Macédonien","Malayalam","Mongol","Moldave","Marathe","Malais","Maltais","Birman","Nauri","Népalais","Néerlandais","Norvégien","Occitan","(Afan) Oromo","Oriya","Pendjabi","Polonais","Pashto","Portugais","Quichua","Rhéto-Roman","Kiroundi","Roumain","Russe","Kinyarwanda","Sanscrit","Sindhi","Sámi Du Nord","Sango","Serbo-Croate","Singhalais","Slovaque","Slovène","Samoan","Shona","Somali","Albanais","Serbe","Siswati","Sesotho","Soundanais","Suédois","Swahili","Tamil","Télougou","Tadjik","Thaï","Tigrinya","Turkmène","Tagal","Setchwana","Tonga","Turc","Tsonga","Tatar","Tchi","Ouïgour","Ukrainien","Ourdou","Ouzbek","Vietnamien","Volapük","Ouolof","Xhosa","Yidich","Yorouba","Zhuang","Chinois","Zoulou"], "ex: language:en", "language:%@", ["xx","aa","ab","af","am","ar","as","ay","az","ba","be","bg","bh","bi","bn","bo","br","ca","co","cs","cy","da","de","dz","el","en","eo","es","et","eu","fa","fi","fj","fo","fr","fy","ga","gd","gl","gn","gu","gv","ha","he","hi","hr","hu","hy","ia","id","ie","ik","is","it","iu","ja","jw","ka","kk","kl","km","kn","ko","ks","ku","kw","ky","la","lb","ln","lo","lt","lv","mg","mi","mk","ml","mn","mo","mr","ms","mt","my","na","ne","nl","no","oc","om","or","pa","pl","ps","pt","qu","rm","rn","ro","ru","rw","sa","sd","se","sg","sh","si","sk","sl","sm","sn","so","sq","sr","ss","st","su","sv","sw","ta","te","tg","th","ti","tk","tl","tn","to","tr","ts","tt","tw","ug","uk","ur","uz","vi","vo","wo","xh","yi","yo","za","zh","zu"])
];

whatSection = new AS.Section("Que cherchez vous ?", whatSection);
approxSection = new AS.Section("Avez-vous besoin de la recherche approximative ?", approxSection);
whereSection = new AS.Section("Où voulez-vous chercher ?", whereSection);

context = new AS.Context("Construisez votre requête en utilisant la syntaxe avancée", [whatSection, approxSection, whereSection]);
