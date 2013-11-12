document.expando = false;
var _DEBUG = true;

/******************************************************
*  Vìci nesouvisející pøímo se hrou                   *
******************************************************/

var GAME_NAME = "Miner JS";
var GAME_VERSION = "0.9.36";

var CELL_WID = 16, CELL_HEI = 24;
var WORLD_HEI = 5;

var sImgDir = "img/";

// InfoTable //
var minInfoTableWid = 120, maxInfoTableWid = 250;

// typ policka nahore //
var g_dvere = 1, g_zed = 2, g_kaktus = 3, g_zachod = 4, g_hradlo = 5;
// dvere //
var d_banka = 1, d_tools = 2, d_bordel = 3, d_nemocnice = 4, d_info = 5; 
var aBudovyURLs = new Array("","budova.banka.html","budova.obchod.html","budova.bordel.html","budova.nemocnice.html","budova.info.html");

// typ policka dole
var g_nic=0, g_pt=2, g_au=3, g_ag=4, g_co=5, g_cu=6, g_lu=7, g_zemdynamit=8, g_drahokam=9,
	g_normal=51, g_skala=52, g_pisek=53, g_tuha=54, g_zaval=55, g_pramen=56, g_sachta=57,  g_voda=71, g_methan=72;
var aTypImages = new Array("",null,"platina_t.gif","zlato2_t.gif","stribro_t.gif","uhli_t.gif","med_t.gif","inv_stesti.gif","inv_dynamit.gif","drahokam.gif");
		aTypImages[g_normal]  = "";
		aTypImages[g_skala]  = "skala.gif";
		aTypImages[g_pisek]  = "pisek.gif";
		aTypImages[g_tuha]   = "zemtuha.gif";
		aTypImages[g_zaval]  = "zaval.gif";
		aTypImages[g_pramen] = "pramen.gif";
		aTypImages[g_voda]   = "voda.gif";
		aTypImages[g_sachta] = "sachta.gif";

var COLOR_GROUND_BGLIGHT1 = "#BE8E56";
var COLOR_GROUND_BGLIGHT2 = "#d2b48c";
var COLOR_GROUND_BGLIGHT3 = "#A9D9D7"; // #B1D9DD
var COLOR_GROUND_BGDARK   = "#AD5200";
var COLOR_METHAN_BG       = "#c0d28a";
var COLOR_SKYBLUE         = "#87cefa";

var g_lopata = 1, g_krumpac = 2, g_vrtak = 3, g_sbijecka = 4, g_dynamit = 5,
  g_louc = 6, g_lampa = 7, g_halogen = 8, g_baterie = 9, g_sonda = 10, g_trikoder = 11, g_kbelik = 12, g_pumpa = 13, g_stesti = 14;
//var aItems = new Array('lopata','krumpac','vrtak','sbijecka','dynamit', 'louc','lampa','halogen','baterie',/*'sonda','trikoder',*/ 'kbelik','pumpa', 'stesti');

// animace //
var ANIM_MRAK1_STEPDELAY_MS  = 2500;
var ANIM_MRAK1_ROUNDDELAY_MS = 5000;

var CAS_INVENTORY_CHECK_DELAY_MS = 3000;



/******************************************************
*  Vìci pøímo související se hrou                     *
******************************************************/

// šíøka a výška hracího pole //
var CELLS_HORIZ = 50, CELLS_VERT = 45;/*/
var CELLS_HORIZ = 50, CELLS_VERT = 100;/**/

// koeficient odkryvani pudy  //
var KOEF_ODKRYTO     = 4.0,   // Odkryto vse - typ pudy i typ obsahu 
    KOEF_ODKRYTOPUL  = 2.0,   // Odkryt typ pudy a jestli to ma nejaky obsah 
		KOEF_ODKRYTOPUDA = 1.0;   // Odkryt typ pudy
		
// Matice odkryvu policek okolo smejdiciho minera - kouka doprava //
// Ale POZOR! Toto je DEFAULTNI matice. Panackova se nastavi pomoci PrepoctiOdkryvKoef(). //
var aODw, aOdkryvDistrib = new Array();
aODw = aOdkryvDistrib;
aODw[-2] = new Array();
aODw[-1] = new Array();
aODw[ 0] = new Array();
aODw[ 1] = new Array();
aODw[ 2] = new Array();
aODw[-2][-2] = 0.00; aODw[-2][-1] = 0.05; aODw[-2][ 0] = 0.20; aODw[-2][ 1] = 0.10; aODw[-2][ 2] = 0.05;
aODw[-1][-2] = 0.05; aODw[-1][-1] = 0.10; aODw[-1][ 0] = 0.30; aODw[-1][ 1] = 0.25; aODw[-1][ 2] = 0.15;
aODw[ 0][-2] = 0.05; aODw[ 0][-1] = 0.15; aODw[ 0][ 0] = 0.00; aODw[ 0][ 1] = 0.40; aODw[ 0][ 2] = 0.25;
aODw[ 1][-2] = 0.05; aODw[ 1][-1] = 0.10; aODw[ 1][ 0] = 0.40; aODw[ 1][ 1] = 0.25; aODw[ 1][ 2] = 0.15;
aODw[ 2][-2] = 0.05; aODw[ 2][-1] = 0.05; aODw[ 2][ 0] = 0.15; aODw[ 2][ 1] = 0.25; aODw[ 2][ 2] = 0.05;

// Vliv predmetu na odkryvani - nejblizsi pole, vzdalenejsi pole //
var aOdkryvKoef = new Array();
aOdkryvKoef["nic"]      = new Array(0.2, 0);
aOdkryvKoef["louc"]     = new Array(0.8, 0.3);
aOdkryvKoef["lampa"]    = new Array(1, 1);
aOdkryvKoef["halogen"]  = new Array(1.3, 1.4);
aOdkryvKoef["sonda"]    = new Array(1.6, 2.0);
aOdkryvKoef["trikoder"] = new Array(3.0, 4.0);



var CURRENCY = "Kè";
		
// stredni hodnoty cen mineralu  //
var shpt = 270;
var shau =  55;
var shag =  30;
var shcu =  15;
var shco =   5;

// mineraly //
var MAX_MINERALS_IN_CELL = 20;
var NUM_AU_VE_ZLATE_ZILE = 12;

// maxy, miny, konstanty //
var MAX_MESSAGES       =    60;
var MAX_DEBT           =  1500;
var MAX_MINUS          =  -300;
var PAN_START_PENIZE   =   100;
var PAN_START_DLUH     =   100;
var PAN_START_ZDRAVI   =   100;

// vytah //
var VYTAH_LANO_DELKA_VYCHOZI   =    20;
var VYTAH_SACHTA_DELKA_VYCHOZI =    30;
var VYTAH_CENA_NAJEM           =    20;
var VYTAH_LANO_CENA            =  3000;
var VYTAH_LANO_DELKAPRIDANI    =     5;
var VYTAH_SACHTA_CENA          = 18000;
var VYTAH_SACHTA_DELKA_PRIDANI =    10;


var CENA_LECBAZADEN    =   150;
var ZDRAVI_LECBAZADEN  =    10;
var MAX_SAVESLOTS      =    10;
var DYNAMITE_DELAY_MS  =  5000;




/**************************************
*  Kecy                               *
**************************************/
function RandomKec(aPoleKecu){
	return aPoleKecu[Math.floor(Math.random()*10000) % aPoleKecu.length];
}			

var aKecyHradlo = new Array("Jùù, prolejzaèka.","Na to nepolezu.","Si upad?","A co jako?",
  "Co s tim?","Je tøeba makat.","Nemam èas se tu opírat.","Jako malej jsem si na tom hrál celý hodiny...",
	"Obèas tu postávaji Ukrajinci. Moh bych je zkusit zamìstnat.","Ach jo.",
	"Nìkdy si øíkám: Svìt je prima! :) A pak se vrátim do reality.",
	"Potkal jsem jednu prima holku, dìlá v nemocnici tady kousek. Lucka, myslim.",
	"Nebejt ta prima kóèa z nemocnice kuøaèka, hned bych si jí vzal...",
	"Na svìtì je moc násilí. Tøeba já jsem vèera pøesekal asi padesát žížal. Jen tak, chápete? Fik, a pìt set žížalek nemìlo mámy.",
	"Nejlepší psi jsou stejnì jezevèíci.",
	"Letošní burèák se poved. Sehnal jsem ho ve sklípku ve Šrámkovce.",
	"Pozdrav pro Mistra Mesoda :)", "A ne a ne zapršet.", "Chcíp tu pes.","La laaa lalaaaa, la la laaa laliii...",
	"Nìkdy bych vzal tisíc kuøákù a narval je do jedný krabièky od cigaret. Nebo naopak?",
	"Jednou si jeden od nás zapálil v dole, vybuch s nim metan. Tejden. Tejden! ho škrabali z výtahový šachty.",
	"Možná bych mìl seknout s hornièinou a dát se na filozofii.",
	"Život je jako studna a smrt je jako... Ne, život je jako... smrt... é... kašlu na to.",
	"Filip je debil.","Ta všivá banka okrádá lidi, kde mùže. Ani výtah už neni zadara.",
	"Ondra Žižka, to je borec, lidi. Ten to tady prej celý postavil.",
	"Až budete na internetu, mrknìte na www.dynawest.cz.",
	"Kdyby byla mrkev jako cibule, nic by z ní po oloupání nezbylo.",
	"Víte co je nejlepší produkt Microsoftu? Myš.",
	"Dneska jsem spal jako malý dítì. Každý dvì hodiny jsem se vzbudil a plakal.",
	"Nic proti Sergejovi, ale komunisti se mìli po revoluci postøílet.",
	"Kdo kouøí, má za tøi. Za tøi roky rakovinu.",
	"Kdyby mìly ryby brusle, mohly by v zime blbnout na rybnících.",
	"Všim jsem si, že u toho výtahu praská lano.",
	"Neni vám divný, že nikdy nespim?",
	"Jaký by asi bylo žít ve trojrozmìrným svìtì... Strašnì bych se chtìl dostat do hospody zadem.",
	"Dana Glover vydala nový album - Testimony, ale nedá se tu sehnat. Snad ho nìkde Sergej splaší.");

var aKecyNemocnice = new Array("Chlape, jak to dìláte, že ještì žijete?","Vám by tak slušela nìjaká jizva...",
"Prosím, sundejte tu ruku z mojeho zadku.", "Vy jste prý horník. Bojíte se tam dole?",
"Dneska mì sprdla vrchní sestra, že se s vámi moc vybavuju.", "Malej moment, jen dám tomu mrzákovi vedle morfium.",
"Copak?", ":)", "Na co vám bude moje èíslo...", "Nemám na starosti jen vás, pane.");


