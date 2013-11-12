document.expando = false;
var _DEBUG = true;

/******************************************************
*  V�ci nesouvisej�c� p��mo se hrou                   *
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
*  V�ci p��mo souvisej�c� se hrou                     *
******************************************************/

// ���ka a v��ka hrac�ho pole //
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



var CURRENCY = "K�";
		
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

var aKecyHradlo = new Array("J��, prolejza�ka.","Na to nepolezu.","Si upad?","A co jako?",
  "Co s tim?","Je t�eba makat.","Nemam �as se tu op�rat.","Jako malej jsem si na tom hr�l cel� hodiny...",
	"Ob�as tu post�vaji Ukrajinci. Moh bych je zkusit zam�stnat.","Ach jo.",
	"N�kdy si ��k�m: Sv�t je prima! :) A pak se vr�tim do reality.",
	"Potkal jsem jednu prima holku, d�l� v nemocnici tady kousek. Lucka, myslim.",
	"Nebejt ta prima k��a z nemocnice ku�a�ka, hned bych si j� vzal...",
	"Na sv�t� je moc n�sil�. T�eba j� jsem v�era p�esekal asi pades�t ��al. Jen tak, ch�pete? Fik, a p�t set ��alek nem�lo m�my.",
	"Nejlep�� psi jsou stejn� jezev��ci.",
	"Leto�n� bur��k se poved. Sehnal jsem ho ve skl�pku ve �r�mkovce.",
	"Pozdrav pro Mistra Mesoda :)", "A ne a ne zapr�et.", "Chc�p tu pes.","La laaa lalaaaa, la la laaa laliii...",
	"N�kdy bych vzal tis�c ku��k� a narval je do jedn� krabi�ky od cigaret. Nebo naopak?",
	"Jednou si jeden od n�s zap�lil v dole, vybuch s nim metan. Tejden. Tejden! ho �krabali z v�tahov� �achty.",
	"Mo�n� bych m�l seknout s horni�inou a d�t se na filozofii.",
	"�ivot je jako studna a smrt je jako... Ne, �ivot je jako... smrt... �... ka�lu na to.",
	"Filip je debil.","Ta v�iv� banka okr�d� lidi, kde m��e. Ani v�tah u� neni zadara.",
	"Ondra �i�ka, to je borec, lidi. Ten to tady prej cel� postavil.",
	"A� budete na internetu, mrkn�te na www.dynawest.cz.",
	"Kdyby byla mrkev jako cibule, nic by z n� po oloup�n� nezbylo.",
	"V�te co je nejlep�� produkt Microsoftu? My�.",
	"Dneska jsem spal jako mal� d�t�. Ka�d� dv� hodiny jsem se vzbudil a plakal.",
	"Nic proti Sergejovi, ale komunisti se m�li po revoluci post��let.",
	"Kdo kou��, m� za t�i. Za t�i roky rakovinu.",
	"Kdyby m�ly ryby brusle, mohly by v zime blbnout na rybn�c�ch.",
	"V�im jsem si, �e u toho v�tahu prask� lano.",
	"Neni v�m divn�, �e nikdy nespim?",
	"Jak� by asi bylo ��t ve trojrozm�rn�m sv�t�... Stra�n� bych se cht�l dostat do hospody zadem.",
	"Dana Glover vydala nov� album - Testimony, ale ned� se tu sehnat. Snad ho n�kde Sergej spla��.");

var aKecyNemocnice = new Array("Chlape, jak to d�l�te, �e je�t� �ijete?","V�m by tak slu�ela n�jak� jizva...",
"Pros�m, sundejte tu ruku z mojeho zadku.", "Vy jste pr� horn�k. Boj�te se tam dole?",
"Dneska m� sprdla vrchn� sestra, �e se s v�mi moc vybavuju.", "Malej moment, jen d�m tomu mrz�kovi vedle morfium.",
"Copak?", ":)", "Na co v�m bude moje ��slo...", "Nem�m na starosti jen v�s, pane.");


