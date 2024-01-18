var whatSection = [
	new AS.Item("Formulation exacte", "ex: \"Etre ou ne pas �tre\"", "\"%@\"", "Entrez votre formulation ici", ""),
	new AS.Item("Termes exclus", "ex: New -york", "-%@", "Entrez le terme ici", ""), 
	new AS.Item("Termes optionnels", "ex: exalead OPT cloudview", "OPT (%@)", "Entrez le terme ici", ""), 
	new AS.Item("Recherche de proximit�", "ex: (finance NEAR march�)", "NEAR %@", "Entrez le terme ici", ""), 
	new AS.Item("Expression logique", "ex:((rapide OR vif) AND NOT v�loce)", "(%@)", "Entrez le terme ici", "")
];

var approxSection = [
	new AS.Item("Termes commen�ant par", "ex: messag*", "%@*", "Entrez le terme ici", ""),
	new AS.Item("Recherche phon�tique", "ex: soundslike:t�l�phone", "soundslike:%@", "Entrez le terme ici", ""),
	new AS.Item("Recherche orthographique approximative", "ex: spellslike:exlaead", "spellslike:%@", "Entrez le terme ici", "")
];

var whereSection = [
	new AS.Item("Type de fichier", "ex: file_extension:pdf", "file_extension:%@", "Entrez l'extension du fichier ici", ""),
	new AS.Item("Recherche post�rieure au", "ex: after:12/31/2008", "after:%@", "MM/DD/YYYY", ""),
	new AS.Item("Recherche ant�rieure au", "ex: before:12/31/2008", "before:%@", "MM/DD/YYYY", ""),
	new AS.Item("Date", "ex: date:12/31/2008", "date:%@", "MM/DD/YYYY", ""),
	new AS.Item("Recherche par titre", "ex: title:exalead", "title:(%@)", "Entrez le terme ici", ""),
	new AS.Item("Recherche de document", "ex: text:\"Etre ou ne pas �tre\"", "text:(%@)", "Entrez le terme ici", ""),
	new AS.Item("Taille de fichier sup�rieure �", "ex: file_size>=1000", "file_size>=%@", "1000", ""),
	new AS.Item("Taille de fichier inf�rieure �", "ex: file_size<=1000", "file_size<=%@", "1000", ""),
	new AS.Item("Recherche dans l'URL", "ex: inurl:musique", "inurl:%@", "Entrez le terme ici", ""),
	new AS.Item("Recherche par site", "ex: site:exalead.com", "site:%@", "Entrez votre site ici", ""),
	new AS.SelectItem("Choisissez une langue", ["Non sp�cifi�e","Afar","Abkhazien","Afrikaans","Amharique","Arabe","Assamais","Aymara","Azerba�djanais","Bashkir","Bi�lorusse","Bulgare","Bihari","Bislama","Bengali","Tib�tain","Breton","Catalan","Corse","Tch�que","Gallois","Danois","Allemand","Bhoutani","Grec","Anglais","Esp�ranto","Espagnol","Estonien","Basque","Persan","Finnois","Fidji","F�ro�en","Fran�ais","Frison","Irlandais","Ga�lique �cossais","Galicien","Guarani","Goujrati","Ga�lique de l'�le de Man","Haoussa","H�breu","Hindi","Croate","Hongrois","Arm�nien","Interlingua","Indon�sien","Interlingue","Inupiak","Islandais","Italien","Inuktitut","Japonais","Javanais","G�orgien","Kazakh","Groenlandais","Cambodgien","Kannada","Cor�en","Kashmiri","Kurde","Cornique","Kirghiz","Latin","Luxembourgeois","Lingala","Laotien","Lituanien","Letton, Lettonien","Malgache","Maori","Mac�donien","Malayalam","Mongol","Moldave","Marathe","Malais","Maltais","Birman","Nauri","N�palais","N�erlandais","Norv�gien","Occitan","(Afan) Oromo","Oriya","Pendjabi","Polonais","Pashto","Portugais","Quichua","Rh�to-Roman","Kiroundi","Roumain","Russe","Kinyarwanda","Sanscrit","Sindhi","S�mi Du Nord","Sango","Serbo-Croate","Singhalais","Slovaque","Slov�ne","Samoan","Shona","Somali","Albanais","Serbe","Siswati","Sesotho","Soundanais","Su�dois","Swahili","Tamil","T�lougou","Tadjik","Tha�","Tigrinya","Turkm�ne","Tagal","Setchwana","Tonga","Turc","Tsonga","Tatar","Tchi","Ou�gour","Ukrainien","Ourdou","Ouzbek","Vietnamien","Volap�k","Ouolof","Xhosa","Yidich","Yorouba","Zhuang","Chinois","Zoulou"], "ex: language:en", "language:%@", ["xx","aa","ab","af","am","ar","as","ay","az","ba","be","bg","bh","bi","bn","bo","br","ca","co","cs","cy","da","de","dz","el","en","eo","es","et","eu","fa","fi","fj","fo","fr","fy","ga","gd","gl","gn","gu","gv","ha","he","hi","hr","hu","hy","ia","id","ie","ik","is","it","iu","ja","jw","ka","kk","kl","km","kn","ko","ks","ku","kw","ky","la","lb","ln","lo","lt","lv","mg","mi","mk","ml","mn","mo","mr","ms","mt","my","na","ne","nl","no","oc","om","or","pa","pl","ps","pt","qu","rm","rn","ro","ru","rw","sa","sd","se","sg","sh","si","sk","sl","sm","sn","so","sq","sr","ss","st","su","sv","sw","ta","te","tg","th","ti","tk","tl","tn","to","tr","ts","tt","tw","ug","uk","ur","uz","vi","vo","wo","xh","yi","yo","za","zh","zu"])
];

whatSection = new AS.Section("Que cherchez vous ?", whatSection);
approxSection = new AS.Section("Avez-vous besoin de la recherche approximative ?", approxSection);
whereSection = new AS.Section("O� voulez-vous chercher ?", whereSection);

context = new AS.Context("Construisez votre requ�te en utilisant la syntaxe avanc�e", [whatSection, approxSection, whereSection]);
