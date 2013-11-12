// Miner JS language mutation file //

// Language key. Should be 2 characters, the same as in this file's name. //
// Not set with var - the variable is declared in lang._.js as it can be used more than once. //
sLangKey = "cz";
// var lang; // declared in lang._.js 

if(cLang && typeof(cLang) == "function"){
	lang = cLang[sLangKey] = new Object();
	lang.aItems = new Array();
	lang.str = new Object();
}	


// Strings for items. //
// iId:       internal integer ID
// sName:     name of the item
// s2p:       name of the item in 2nd gramatical version - accusative case (needed for some languages like Czech)
// sUsedUp:   string to be prompted when the item has been used as many times as it could (depleted)
// sExpired:  string to be prompted when the item has got old by time (obsolete)
//   If you played the game for a while, it should be quite clear. 
//   Note that the strings in the inc.predmety.js file are used as default if the localized version is not provided here.
lang.aItems = [
	{ iId: g_lopata,    sName : "lopata",   s2p : "lopatu",  sUsedUp : "Lopata byla opotøebovaná, zlomila se násada.", sExpired : "Lopata je moc stará, shnila násada." },
	{ iId: g_krumpac,   sName : "krumpáè",  s2p : "krumpáè", sUsedUp : "Krumpáè byl opotøebovanı, zlomila se násada.", sExpired : "Krumpáè je starı, shnila násada." },
	{ iId: g_vrtak,     sName : "vrták",    s2p : "vrták",   sUsedUp : "Vrták byl opotøebovanı a zlomil se.", sExpired : "Vrták zrezivìl a zadøel se." },
	{ iId: g_sbijecka,  sName : "sbíjeèka", s2p : "sbíjeèku",sUsedUp : "Sbíjeèka se opotøebovala a pøestala fungovat.", sExpired : "Sbíjeèka se rozbila." },
	{ iId: g_dynamit,   sName : "dynamit",  s2p : "dynamit", sUsedUp : "Dynamit byl pouit.", sExpired : "Dynamit u je starı a zvlhnul." },
	{ iId: g_louc,      sName : "louè",     s2p : "louè",    sUsedUp : "Louè dohoøela.", sExpired : "Louè vyschla a smùla se odrolila." },
	{ iId: g_lampa,     sName : "lampa",    s2p : "lampu",   sUsedUp : "Lampa dohoøela.", sExpired : "Lampa dohoøela." },
	{ iId: g_halogen,   sName : "halogen",  s2p : "halogen", sUsedUp : "Halogen se opotøeboval.", sExpired : "V halogenu došla baterie." },
	{ iId: g_baterie,   sName : "baterie",  s2p : "baterii", sUsedUp : "Beru rezervní baterii.", sExpired : "Baterie byla stará a vytekla." },
//{ iId: g_sonda,     sName : "sonda",    s2p : "sondu", sUsedUp : "Sondì se opotøebovalo èidlo.", sExpired : "Sonda se rozbila." },
//{ iId: g_trikoder,  sName : "trikodér", s2p : "trikodér", sUsedUp : "V trikodéru vyexpiroval shareware.", sExpired : "Do trikodéru se dostal virus a je na vyhození." },
	{ iId: g_kbelik,    sName : "kbelík",   s2p : "kbelík",  sUsedUp : "Kbelík se prodìravìl.", sExpired : "Kbelík strouchnivìl." },
	{ iId: g_pumpa,     sName : "pumpa",    s2p : "pumpu",   sUsedUp : "Pumpì se opotøebovalo tìsnìní.", sExpired : "Pumpì zpuchøela guma." },
	{ iId: g_stesti,    sName : "štìstí",   s2p : "štìstí",  sUsedUp : "Vybral sis svou dávku štìstí.", sExpired : "Štìstí tì opustilo." }
];

lang.str.sYouDontHave        = "Nemáš %1.";
lang.str.sItemWasSwitchedOn  = "Zapnuls %1.";
lang.str.sItemWasSwitchedOff = "Vypnuls %1.";
lang.str.sYouHavePrepared    = "Pøipravil sis %1.";
lang.str.sYouHaveUsed = "Pouils %1.";
lang.str.sMiningSuccesful = "Tìba úspìšná.";
lang.str.sMiningUnsuccesful = "Tìba se nepovedla. Zkus to znova.";
lang.str.sElevHire = "Nájem vıtahu: %1 "+CURRENCY;
lang.str.sDynamiteActivated = "Nálo dynamitu aktivována.";
lang.str.sMinedSandstone = "Písèitá zem - snadná tìba.";
lang.str.sMinedThough = "Tvrdá hornina - tìká tìba.";
lang.str.sCaveIn = "Zával";
lang.str.sSpring = "Pramen";
lang.str.sGranite = "Skála";
lang.str.sFoundPt = "Našels platinu!";
lang.str.sFoundAu = "Našels zlaté pruty!";
lang.str.sFoundAg = "Našels støíbrné pruty";
lang.str.sFoundCu = "Našels mìï";
lang.str.sFoundCo = "Našels uhlí";
lang.str.sFoundLu = "Našlo si tì štìsí :)";
lang.str.sFoundDynamite = "Ten dynamit brzy bouchne.";
lang.str.sSpringUnremovable = "Pramen nejde odèerpat - je nekoneènı...";
lang.str.sNoWaterThatDir = "V daném smìru není štola zatopená.";
lang.str.sYouAreDead = "Ses mrtvej kamo.\nZkus to znova (F5)";
lang.str.sOuch = "Jau.";
lang.str.sAaaargh = "A%1u!";
lang.str.sAaaarghChar = "a";
lang.str.sIWasMinuteAgo = "Zrovna jsem byl.";
lang.str.sIDontWantNow = "Ted se mi nechce.";
lang.str.sNowhereToEnter = "Není kam vstoupit.";
lang.str.sToiletRelief = "Aaaaach...";
lang.str.sEnteringBank = "Jdu do banky.";
lang.str.sEnteringHospital = "Jdu do nemocnice.";
lang.str.sEnteringShop = "Jdu do obchodu.";
lang.str.sEnteringClosed = "Zavøeno.";
lang.str.sEnteringInfo = "Informace...";
lang.str.sEnteringSaloon = "Jdu do saloonu.";

lang.str.sEscapingToSide  = "Zde jsou lvi.";
lang.str.sEscapingToSky  = "Nemùeš lítat trdlo.";
lang.str.sEscapingToShaft  = "Závra te tam nepustí.";
lang.str.sEscapingToGround  = "Chceš se snad prohrabat rukama?";
lang.str.sEscapingToLand  = "Zákaz povrchové tìby.";
lang.str.sEscapingToHell  = "U jsi skoro u jádra Zemì - dál to nejde.";
lang.str.sEscapingToSkyElev  = "Jsi ve vıtahu, ne v raketì.";
lang.str.sElevEndOfRope  = "Došlo lano. Dokup delší.";
lang.str.sCantMineGranite  = "Skálu nejde vytìit.\nZkus ji odstranit.";

lang.str.sBoom = "Bum!";
lang.str.sReallyRestart = "Opravdu chcete ukonèit rozehranou hru a zaèít znovu?";
lang.str.sPatienceBringsRoses = "Trpìlivost rùe pøináší.";
lang.str.sYouAreDeadPressReload = "Jsi mrtvej, kámo. Maèkni Obnovit.";
lang.str.sSavingOnlyOnTop = "Ukládat jde jen na povrchu (a mimo vıtah).";


lang.str.s = "";
lang.str.s = "";
lang.str.s = "";
lang.str.s = "";
lang.str.s = "";
// cGame.str.sEnteringInfo
//lang.str.s = "%1";