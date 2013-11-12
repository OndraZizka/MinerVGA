// Predmety - jeste nepouzito //

/**********************************
*   class cPredmet                *
**********************************/

// Konstruktor //
function cPredmet(xTyp, iPrice){
	this.typ == null;

	for(i in cPredmet.aItems){
		if(cPredmet.aItems[i].sKey == xTyp){
			this.typ = cPredmet.aItems[i]; break;
		}
	}
	if(this.typ){
		this.iUsagesLeft = this.typ.iUsages;
	}
	this.iBoughtWhen = (new Date()).getTime();
	if(!iPrice) iPrice = this.typ.iPrice;
	this.iBoughtPrice = iPrice;
	this.bOn = false;
}

//var aItems = new Array('lopata','krumpac','vrtak','sbijecka','dynamit', 'louc','lampa','halogen','baterie',/*'sonda','trikoder',*/ 'kbelik','pumpa', 'stesti');

// iId      = int id typu predmetu
// sKey     = string id typu predmetu
// iUsages  = odolnost - kolik vydrzi _pouziti_ (nikoliv pohybu - napr. vrtak se odecte jen pri vrtani do skaly).
// iTime    = vydrz - jak dlouho od koupe vydrzi
// iPrice   = cena, za jakou se prodava
// sName    = jm�no p�edm�tu tohoto typu
// s2p      = jm�no p�edm�tu tohoto typu ve druh�m p�du
// sUsedUp  = text, kter� se zobraz�, kdy� je p�edm�t pou�it tolikr�t, kolik je v iUsages
// sExpired = text, kter� se zobraz�, kdy� uplyne doba, po kterou p�edm�t vydr�� od koup�

// Default values;  To localize, use lang.{language key}.js;
cPredmet.aItems = [
	{ iId: g_lopata,    sKey: 'lopata',   sImg: "inv_lopata.gif",   iUsages:  30, iTime:   -1, iPrice:  200,  sName : "lopata",   s2p : "lopatu",  sUsedUp : "Lopata byla opot�ebovan�, zlomila se n�sada.", sExpired : "Lopata je moc star�, shnila n�sada." },
	{ iId: g_krumpac,   sKey: 'krumpac',  sImg: "inv_krumpac.gif",  iUsages:  50, iTime:   -1, iPrice:  400,  sName : "krump��",  s2p : "krump��", sUsedUp : "Krump�� byl opot�ebovan�, zlomila se n�sada.", sExpired : "Krump�� je star�, shnila n�sada." },
	{ iId: g_vrtak,     sKey: 'vrtak',    sImg: "inv_vrtak.gif",    iUsages:  10, iTime:   -1, iPrice: 1200,  sName : "vrt�k",    s2p : "vrt�k",   sUsedUp : "Vrt�k byl opot�ebovan� a zlomil se.", sExpired : "Vrt�k zreziv�l a zad�el se." },
	{ iId: g_sbijecka,  sKey: 'sbijecka', sImg: "inv_sbijecka.gif", iUsages: 180, iTime:   -1, iPrice:10000,  sName : "sb�je�ka", s2p : "sb�je�ku",sUsedUp : "Sb�je�ka se opot�ebovala a p�estala fungovat.", sExpired : "Sb�je�ka se rozbila." },
	{ iId: g_dynamit,   sKey: 'dynamit',  sImg: "inv_dynamit.gif",  iUsages:   1, iTime:  300, iPrice: 3000,  sName : "dynamit",  s2p : "dynamit", sUsedUp : "Dynamit byl pou�it.", sExpired : "Dynamit u� je star� a zvlhnul." },
	{ iId: g_louc,      sKey: 'louc',     sImg: "inv_louc.gif",     iUsages:  -1, iTime:  140, iPrice:  100,  sName : "lou�",     s2p : "lou�",    sUsedUp : "Lou� doho�ela.", sExpired : "Lou� vyschla a sm�la se odrolila." },
	{ iId: g_lampa,     sKey: 'lampa',    sImg: "inv_lampa.gif",    iUsages:  -1, iTime:  200, iPrice:  600,  sName : "lampa",    s2p : "lampu",   sUsedUp : "Lampa doho�ela.", sExpired : "Lampa doho�ela." },
	{ iId: g_halogen,   sKey: 'halogen',  sImg: "inv_halogen.gif",  iUsages:  -1, iTime:  300, iPrice: 2400,  sName : "halogen",  s2p : "halogen", sUsedUp : "Halogen se opot�eboval.", sExpired : "V halogenu do�la baterie." },
	{ iId: g_baterie,   sKey: 'baterie',  sImg: "inv_baterie.gif",  iUsages:  -1, iTime: 2000, iPrice:  300,  sName : "baterie",  s2p : "baterii", sUsedUp : "Beru rezervn� baterii.", sExpired : "Baterie byla star� a vytekla." },
//{ iId: g_sonda,     sKey: 'sonda',    sImg: "inv_sonda.gif",    iUsages: 200, iTime:   -1, iPrice:20000,  sName : "sonda",    s2p : "sondu", sUsedUp : "Sond� se opot�ebovalo �idlo.", sExpired : "Sonda se rozbila." },
//{ iId: g_trikoder,  sKey: 'trikoder', sImg: "inv_trikoder.gif", iUsages:1000, iTime:   -1, iPrice:50000,  sName : "trikod�r", s2p : "trikod�r", sUsedUp : "V trikod�ru vyexpiroval shareware.", sExpired : "Do trikod�ru se dostal virus a je na vyhozen�." },
	{ iId: g_kbelik,    sKey: 'kbelik',   sImg: "inv_kbelik.gif",   iUsages:  10, iTime: 9000, iPrice:  100,  sName : "kbel�k",   s2p : "kbel�k",  sUsedUp : "Kbel�k se prod�rav�l.", sExpired : "Kbel�k strouchniv�l." },
	{ iId: g_pumpa,     sKey: 'pumpa',    sImg: "inv_pumpa.gif",    iUsages:  50, iTime: 9000, iPrice: 4200,  sName : "pumpa",    s2p : "pumpu",   sUsedUp : "Pump� se opot�ebovalo t�sn�n�.", sExpired : "Pump� zpuch�ela guma." },
	{ iId: g_stesti,    sKey: 'stesti',   sImg: "inv_stesti.gif",   iUsages:  60, iTime:  120, iPrice:    0,  sName : "�t�st�",   s2p : "�t�st�",  sUsedUp : "Vybral sis svou d�vku �t�st�.", sExpired : "�t�st� t� opustilo." }
];
cPredmet.NajdiTypPredmetu = function(xIdOrKey){
	for(i = 0; i < cPredmet.aItems.length; i++)
		if(cPredmet.aItems[i].iId == xIdOrKey || cPredmet.aItems[i].sKey == xIdOrKey)
			return cPredmet.aItems[i];
}

cPredmet.prototype.typ;            // objekt z cPredmet.aItems popisujici vlastnosti typu predmetu 
cPredmet.prototype.iUsagesLeft;    // kolik zbyva pouziti; odecita se pri kazdem pouziti 
cPredmet.prototype.iBoughtWhen;    // cas zakoupeni, nastaveno pri koupi; potom se periodicky kontroluje now() - iBoughtWhen < iTime
cPredmet.prototype.iBoughtPrice;   // cena, za jakou to bylo koupeno; mozna pak udelam i vykup
cPredmet.prototype.bOn;            // je-li predmet zapnuty


// Pouzije - snizi pocet zbyvajicich pouziti.     //
// Vraci true, pokud nejaka zbyvaji, jinak false. //
cPredmet.prototype.Pouzij = function(){
	this.iUsagesLeft--;  return (this.iUsagesLeft > 0);
}

// Vraci pocet sekund, ktere zbyvaji do konce zivotnosti predmetu. //
cPredmet.prototype.TimeLeft = function(){
	if(!this.typ) return 0;
	if(-1 == this.typ.iTime) return 999999;
	return this.typ.iTime * 1000 - ((new Date()).getTime() - this.iBoughtWhen);
}

// Vraci soucasnou hodnotu predmetu v pripade prodeje. //
cPredmet.prototype.CurrentValue = function(){
	var dUsageKoef = (this.typ.iUsages <= 0) ? 1 : this.iUsagesLeft / this.typ.iUsages;
	var dTimeKoef  = (this.typ.iTime   <= 0) ? 1 : this.TimeLeft() / this.typ.iTime;
	return this.typ.iPrice * dUsageKoef * dTimeKoef;
}

// class cPredmet - KONEC //


/**********************************
*   class cInventar               *
**********************************/

function cInventar(){
	this.predmety = new Array();   // Pole predmetu; co prvek, to objekt cPredmet 
	this.pocty    = new Object();  // Asociativni pole: [key] = pocet predmetu    
	this.Prepocti();               // Inicializujeme pocty na nulu 
}
cInventar.prototype.predmety;
cInventar.prototype.pocty;
//cInventar.prototype.;
//cInventar.prototype. = function(){}


// P�id�n� p�edm�tu dan�ho typu do invent��e //
cInventar.prototype.Pridej = function(sKey){
	var p = new cPredmet(sKey);
	if(p.typ){
		this.predmety[this.predmety.length] = p;
		this.Prepocti();
		return true;
	}
	else return false;
}

// Odebr�n� konkr�tn�ho objektu p�edmetu z invent��e //
cInventar.prototype.Odeber = function(p){
	var ret = false;
	for(var i = 0; i < this.predmety.length; i++)
		if(p == this.predmety[i]){
			this.predmety.splice(i,1);
			this.Prepocti();
			ret = true; break;
		}
	return ret;
}


// Najde v inventari predmet daneho typu,                  //
// pokud mozno ten s nejmensim poctem zbyvajicich pouziti. //
cInventar.prototype.NajdiNejopotrebovanejsiZapnuty = function(xIdOrKey){
	var p1 = null;                        // momentalne vyhovujici predmet
	var p2 = null;                        // dalsi zkoumany predmet 
	for(var i in this.predmety){
		p2 = this.predmety[i];
		// if(cPredmet.aItems[i].iId == xIdOrKey || cPredmet.aItems[i].sKey == xIdOrKey)
		//if(p2.typ.sKey != sKey) continue;                                   // neni to to, co hledame - dal... 
		if(p2.typ.sKey != xIdOrKey && p2.typ.iId != xIdOrKey) continue;       // neni to to, co hledame - dal... 
		if(p2.bOn){ p1 = p2; break; }                                         // zapnute veci maji nejvyssi prednost 
		if( (!p1) || p1.iUsagesLeft > p2.iUsagesLeft ){ p1 = p2; continue; }  // vic opotrebovane veci maji prednost
		p1 = p2;
	}
	return p1;
}

// Prepocita inventar a ulozi pocty //
cInventar.prototype.Prepocti = function(){ var i;
	// Vynulujem pocty //
	/*for(i in this.pocty) this.pocty[i] = 0;*/
	for(i = 0; i < cPredmet.aItems.length; i++)
		this.pocty[cPredmet.aItems[i].sKey] = 0;
	// Spocitame predmety //
	for(i in this.predmety)
		this.pocty[this.predmety[i].typ.sKey]++ ;
}

// Zkontroluje, jestli nejake predmety nedosly //
cInventar.prototype.CheckObsoletness = function(){ var i, zmeny = 0, p, p2;
	for(i = 0; i < this.predmety.length; i++){
		p = this.predmety[i];
		if(!p) continue;
		if(p.TimeLeft() <= 0){
			PosliZpravu(p.typ.sExpired);
			// Pokud je to halogen a mame nahradni baterii, misto halogenu odebere baterii
			if(p.typ.iId = g_halogen){
				if(p2 = this.NajdiNejopotrebovanejsiZapnuty("baterie")){
					PosliZpravu(cPredmet.NajdiTypPredmetu(g_baterie).sUsedUp);
					p.iBoughtWhen = (new Date()).getTime();
					this.Odeber(p2); zmeny++; continue;
				}
			}
			this.Odeber(p); i--; zmeny++;
		};
	}
	if(zmeny)  this.Prepocti();
	return zmeny;		
}


// class cInventar - KONEC //
