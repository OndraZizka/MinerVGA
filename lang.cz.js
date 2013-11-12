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
	{ iId: g_lopata,    sName : "lopata",   s2p : "lopatu",  sUsedUp : "Lopata byla opot�ebovan�, zlomila se n�sada.", sExpired : "Lopata je moc star�, shnila n�sada." },
	{ iId: g_krumpac,   sName : "krump��",  s2p : "krump��", sUsedUp : "Krump�� byl opot�ebovan�, zlomila se n�sada.", sExpired : "Krump�� je star�, shnila n�sada." },
	{ iId: g_vrtak,     sName : "vrt�k",    s2p : "vrt�k",   sUsedUp : "Vrt�k byl opot�ebovan� a zlomil se.", sExpired : "Vrt�k zreziv�l a zad�el se." },
	{ iId: g_sbijecka,  sName : "sb�je�ka", s2p : "sb�je�ku",sUsedUp : "Sb�je�ka se opot�ebovala a p�estala fungovat.", sExpired : "Sb�je�ka se rozbila." },
	{ iId: g_dynamit,   sName : "dynamit",  s2p : "dynamit", sUsedUp : "Dynamit byl pou�it.", sExpired : "Dynamit u� je star� a zvlhnul." },
	{ iId: g_louc,      sName : "lou�",     s2p : "lou�",    sUsedUp : "Lou� doho�ela.", sExpired : "Lou� vyschla a sm�la se odrolila." },
	{ iId: g_lampa,     sName : "lampa",    s2p : "lampu",   sUsedUp : "Lampa doho�ela.", sExpired : "Lampa doho�ela." },
	{ iId: g_halogen,   sName : "halogen",  s2p : "halogen", sUsedUp : "Halogen se opot�eboval.", sExpired : "V halogenu do�la baterie." },
	{ iId: g_baterie,   sName : "baterie",  s2p : "baterii", sUsedUp : "Beru rezervn� baterii.", sExpired : "Baterie byla star� a vytekla." },
//{ iId: g_sonda,     sName : "sonda",    s2p : "sondu", sUsedUp : "Sond� se opot�ebovalo �idlo.", sExpired : "Sonda se rozbila." },
//{ iId: g_trikoder,  sName : "trikod�r", s2p : "trikod�r", sUsedUp : "V trikod�ru vyexpiroval shareware.", sExpired : "Do trikod�ru se dostal virus a je na vyhozen�." },
	{ iId: g_kbelik,    sName : "kbel�k",   s2p : "kbel�k",  sUsedUp : "Kbel�k se prod�rav�l.", sExpired : "Kbel�k strouchniv�l." },
	{ iId: g_pumpa,     sName : "pumpa",    s2p : "pumpu",   sUsedUp : "Pump� se opot�ebovalo t�sn�n�.", sExpired : "Pump� zpuch�ela guma." },
	{ iId: g_stesti,    sName : "�t�st�",   s2p : "�t�st�",  sUsedUp : "Vybral sis svou d�vku �t�st�.", sExpired : "�t�st� t� opustilo." }
];

lang.str.sYouDontHave        = "Nem� %1.";
lang.str.sItemWasSwitchedOn  = "Zapnuls %1.";
lang.str.sItemWasSwitchedOff = "Vypnuls %1.";
lang.str.sYouHavePrepared    = "P�ipravil sis %1.";
lang.str.sYouHaveUsed = "Pou�ils %1.";
lang.str.sMiningSuccesful = "T�ba �sp�n�.";
lang.str.sMiningUnsuccesful = "T�ba se nepovedla. Zkus to znova.";
lang.str.sElevHire = "N�jem v�tahu: %1 "+CURRENCY;
lang.str.sDynamiteActivated = "N�lo� dynamitu aktivov�na.";
lang.str.sMinedSandstone = "P�s�it� zem - snadn� t�ba.";
lang.str.sMinedThough = "Tvrd� hornina - t�k� t�ba.";
lang.str.sCaveIn = "Z�val";
lang.str.sSpring = "Pramen";
lang.str.sGranite = "Sk�la";
lang.str.sFoundPt = "Na�els platinu!";
lang.str.sFoundAu = "Na�els zlat� pruty!";
lang.str.sFoundAg = "Na�els st��brn� pruty";
lang.str.sFoundCu = "Na�els m��";
lang.str.sFoundCo = "Na�els uhl�";
lang.str.sFoundLu = "Na�lo si t� �t�s� :)";
lang.str.sFoundDynamite = "Ten dynamit brzy bouchne.";
lang.str.sSpringUnremovable = "Pramen nejde od�erpat - je nekone�n�...";
lang.str.sNoWaterThatDir = "V dan�m sm�ru nen� �tola zatopen�.";
lang.str.sYouAreDead = "Ses mrtvej kamo.\nZkus to znova (F5)";
lang.str.sOuch = "Jau.";
lang.str.sAaaargh = "A%1u!";
lang.str.sAaaarghChar = "a";
lang.str.sIWasMinuteAgo = "Zrovna jsem byl.";
lang.str.sIDontWantNow = "Ted se mi nechce.";
lang.str.sNowhereToEnter = "Nen� kam vstoupit.";
lang.str.sToiletRelief = "Aaaaach...";
lang.str.sEnteringBank = "Jdu do banky.";
lang.str.sEnteringHospital = "Jdu do nemocnice.";
lang.str.sEnteringShop = "Jdu do obchodu.";
lang.str.sEnteringClosed = "Zav�eno.";
lang.str.sEnteringInfo = "Informace...";
lang.str.sEnteringSaloon = "Jdu do saloonu.";

lang.str.sEscapingToSide  = "Zde jsou lvi.";
lang.str.sEscapingToSky  = "Nem��e� l�tat trdlo.";
lang.str.sEscapingToShaft  = "Z�vra� te tam nepust�.";
lang.str.sEscapingToGround  = "Chce� se snad prohrabat rukama?";
lang.str.sEscapingToLand  = "Z�kaz povrchov� t�by.";
lang.str.sEscapingToHell  = "U� jsi skoro u j�dra Zem� - d�l to nejde.";
lang.str.sEscapingToSkyElev  = "Jsi ve v�tahu, ne v raket�.";
lang.str.sElevEndOfRope  = "Do�lo lano. Dokup del��.";
lang.str.sCantMineGranite  = "Sk�lu nejde vyt�it.\nZkus ji odstranit.";

lang.str.sBoom = "Bum!";
lang.str.sReallyRestart = "Opravdu chcete ukon�it rozehranou hru a za��t znovu?";
lang.str.sPatienceBringsRoses = "Trp�livost r��e p�in��.";
lang.str.sYouAreDeadPressReload = "Jsi mrtvej, k�mo. Ma�kni Obnovit.";
lang.str.sSavingOnlyOnTop = "Ukl�dat jde jen na povrchu (a mimo v�tah).";


lang.str.s = "";
lang.str.s = "";
lang.str.s = "";
lang.str.s = "";
lang.str.s = "";
// cGame.str.sEnteringInfo
//lang.str.s = "%1";