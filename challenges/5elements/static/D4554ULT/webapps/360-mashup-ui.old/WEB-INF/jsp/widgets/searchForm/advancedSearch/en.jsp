var whatSection = [
	new AS.Item("Exact Wording", "eg: \"To be or not to be\"", "\"%@\"", "Enter your wording here", ""),
	new AS.Item("Excluded Words", "eg: New -york", "-%@", "Enter your word here", ""), 
	new AS.Item("Optional Words", "eg: exalead OPT cloudview", "OPT (%@)", "Enter your word here", ""), 
	new AS.Item("Proximity Search", "ex: (financial NEAR market)", "NEAR %@", "Enter your word here", ""), 
	new AS.Item("Logical Expression", "eg:((fast OR quick) AND NOT lightning)", "(%@)", "Enter your word here", "")
];

var approxSection = [
	new AS.Item("Words starting with", "eg: messag*", "%@*", "Enter your word here", ""),
	new AS.Item("Phonetic Search", "eg: soundslike:telefone", "soundslike:%@", "Enter your word here", ""),
	new AS.Item("Approximate spelling Search", "eg: spellslike:exlaead", "spellslike:%@", "Enter your word here", "")
];

var whereSection = [
	new AS.Item("File type", "eg: file_extension:pdf", "file_extension:%@", "Enter your file extension here", ""),
	new AS.Item("Search after a Date", "eg: after:12/31/2008", "after:%@", "MM/DD/YYYY", ""),
	new AS.Item("Search before a Date", "eg: before:12/31/2008", "before:%@", "MM/DD/YYYY", ""),
	new AS.Item("Date", "eg: date:12/31/2008", "date:%@", "MM/DD/YYYY", ""),
	new AS.Item("Title Search", "eg: title:exalead", "title:(%@)", "Enter your word here", ""),
	new AS.Item("Document Search", "eg: text:\"To be or not to be\"", "text:(%@)", "Enter your word here", ""),
	new AS.Item("File size larger than", "eg: file_size>=1000", "file_size>=%@", "1000", ""),
	new AS.Item("File size smaller than", "eg: file_size<=1000", "file_size<=%@", "1000", ""),
	new AS.Item("URL Search", "eg: inurl:musique", "inurl:%@", "Enter your word here", ""),
	new AS.Item("Site Search", "eg: site:exalead.com", "site:%@", "Enter your site here", ""),
	new AS.SelectItem("Choose a language", ["Not defined","Afar","Abkhazian","Afrikaans","Amharic","Arabic","Assamese","Aymara","Azerbaijani","Bashkir","Byelorussian","Bulgarian","Bihari","Bislama","Bengali; Bangla","Tibetan","Breton","Catalan","Corsican","Czech","Welsh","Danish","German","Bhutani","Greek","English","Esperanto","Spanish","Estonian","Basque","Persian","Finnish","Fiji","Faroese","French","Frisian","Irish","Scots Gaelic","Galician","Guarani","Gujarati","Manx Gaelic","Hausa","Hebrew","Hindi","Croatian","Hungarian","Armenian","Interlingua","Indonesian","Interlingue","Inupiak","Icelandic","Italian","Inuktitut","Japanese","Javanese","Georgian","Kazakh","Greenlandic","Cambodian","Kannada","Korean","Kashmiri","Kurdish","Cornish","Kirghiz","Latin","Luxemburgish","Lingala","Laothian","Lithuanian","Latvian; Lettish","Malagasy","Maori","Macedonian","Malayalam","Mongolian","Moldavian","Marathi","Malay","Maltese","Burmese","Nauru","Nepali","Dutch","Norwegian","Occitan","(Afan) Oromo","Oriya","Punjabi","Polish","Pashto, Pushto","Portuguese","Quechua","Rhaeto-Romance","Kirundi","Romanian","Russian","Kinyarwanda","Sanskrit","Sindhi","Northern Sami","Sangho","Serbo-Croatian","Singhalese","Slovak","Slovenian","Samoan","Shona","Somali","Albanian","Serbian","Siswati","Sesotho","Sundanese","Swedish","Swahili","Tamil","Telugu","Tajik","Thai","Tigrinya","Turkmen","Tagalog","Setswana","Tonga","Turkish","Tsonga","Tatar","Twi","Uigur","Ukrainian","Urdu","Uzbek","Vietnamese","Volapk","Wolof","Xhosa","Yiddish","Yoruba","Zhuang","Chinese","Zulu"], "eg: language:en", "language:%@", ["xx","aa","ab","af","am","ar","as","ay","az","ba","be","bg","bh","bi","bn","bo","br","ca","co","cs","cy","da","de","dz","el","en","eo","es","et","eu","fa","fi","fj","fo","fr","fy","ga","gd","gl","gn","gu","gv","ha","he","hi","hr","hu","hy","ia","id","ie","ik","is","it","iu","ja","jw","ka","kk","kl","km","kn","ko","ks","ku","kw","ky","la","lb","ln","lo","lt","lv","mg","mi","mk","ml","mn","mo","mr","ms","mt","my","na","ne","nl","no","oc","om","or","pa","pl","ps","pt","qu","rm","rn","ro","ru","rw","sa","sd","se","sg","sh","si","sk","sl","sm","sn","so","sq","sr","ss","st","su","sv","sw","ta","te","tg","th","ti","tk","tl","tn","to","tr","ts","tt","tw","ug","uk","ur","uz","vi","vo","wo","xh","yi","yo","za","zh","zu"])
];

whatSection = new AS.Section("What are you looking for?", whatSection);
approxSection = new AS.Section("Do you need approximate search?", approxSection);
whereSection = new AS.Section("Where do you want to search?", whereSection);

context = new AS.Context("Build your query using advanced syntax", [whatSection, approxSection, whereSection]);
