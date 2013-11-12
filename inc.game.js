/* class cGame - hlavni objekt obsahujici vse */
function cGame(doc){
	this.doc = doc;
	this.table = doc.all['gametable'];
	
	// umisti panacka //
	this.panacek = new cPanacek(this, this.doc.all.miner, CELLS_HORIZ-3, WORLD_HEI-2);
	// umisti vytah   //
	this.vytah = new cVytah(this.doc.all.vytah, CELLS_HORIZ-1);
	this.world = new cWorld();
	this.ground = new cGround();
	
	this.sTypedString = "";
}
cGame.prototype.panacek;
cGame.prototype.vytah;
cGame.prototype.world;
cGame.prototype.ground;
cGame.prototype.table;
cGame.prototype.sTypedString;

cGame.str;    // "pointer" to actual set of strings (language mutations) in cLang[...].str
cGame.konst;  // "pointer" to actual set of game settings constants in cSettings[...].konst


// Vyplni tabulku podle ground.map //
cGame.prototype.VytvorTabulku = function(){
	var currow, curcell, curgr, r,i,j, w, u, t;
	var aWorld, aGround;
	
	t = this.table;                        // tabulka hry 
	aWorld  = this.world.map;              // jen zkratka pro tuto fci
	aGround = this.ground.map;             // jen zkratka pro tuto fci
	

	for(i = 0; i <  t.tBodies.length; i++)
		if(t.tBodies[i].id == "world"){ w = t.tBodies[i]; break; }
	if(!w) alert("TBODY s id 'world' nenalezeno.");
	
	// obloha - dodelat ptaky, mraky atd.
	currow = w.insertRow(w.rows.length);
	curcell = currow.insertCell(0);
	curcell.colSpan = CELLS_HORIZ;
	//curcell.height = CELL_HEI;
	//curcell.width = CELL_WID;
	curcell.style.height = CELL_HEI+"px";
	curcell.style.width = CELL_WID+"px";
	curcell.style.backgroundColor = "#87cefa";

	currow = w.insertRow(w.rows.length);
	curcell = currow.insertCell(0);
	curcell.colSpan = CELLS_HORIZ;
	curcell.style.height = CELL_HEI+"px";
	curcell.style.width = CELL_WID+"px";
	curcell.style.backgroundColor = "#87cefa";
	// treti a ctvrta rada - obloha 
	for(r=0; r<2; r++){
		currow = w.insertRow(w.rows.length);
		currow.bgColor = "#87cefa";
		for(i=0; i<CELLS_HORIZ; i++){
			curcell = currow.insertCell(currow.cells.length);
			curcell.style.height = CELL_HEI+"px";
			curcell.style.width = CELL_WID+"px";
		}
	}
	// napleska baraky 
	this.world.PleskniSprite(WORLD_HEI-2,0,"img/_kaktus.gif");   aWorld[WORLD_HEI-2][0].type = g_kaktus;
	this.world.PleskniSprite(WORLD_HEI-2,2,"img/_zachod.gif");   aWorld[WORLD_HEI-2][2].type = g_zachod;
	this.world.PleskniBarak(3,7);
	this.world.PleskniDvere(WORLD_HEI-2,7,"img/_vratal.gif",d_nemocnice);
	this.world.PleskniDvere(WORLD_HEI-2,8,"img/_vratar.gif",d_nemocnice);
	this.world.PleskniSprite(WORLD_HEI-2,4,"img/_kriz.gif");
	this.world.PleskniBarak(13,4);
	this.world.PleskniDvere(WORLD_HEI-2,14,"img/_dvere.gif",d_banka);
	this.world.PleskniSprite(WORLD_HEI-2,15,"img/_dolar.gif");
	this.world.PleskniBarak(20,5);
	this.world.PleskniSprite(WORLD_HEI-2,20,"img/_drink.gif");
	this.world.PleskniDvere(WORLD_HEI-2,22,"img/_saloon.gif",d_bordel);
	this.world.PleskniSprite(WORLD_HEI-2,24,"img/_bordel.gif");
	this.world.PleskniBarak(26,4);
	this.world.PleskniDvere(WORLD_HEI-2,27,"img/_dvere.gif", d_tools);
	this.world.PleskniSprite(WORLD_HEI-2,29,"img/_kolo.gif");
	this.world.PleskniBarak(33,2);
	this.world.PleskniSprite(WORLD_HEI-2,33,"img/_info.gif");
	this.world.PleskniDvere(WORLD_HEI-2,34,"img/_dvere.gif", d_info);
		
	this.world.PleskniSprite(WORLD_HEI-2,36,"img/_hradlo.gif");  aWorld[WORLD_HEI-2][36].type = g_hradlo;

	// 'podlaha' - posledni radka of world
	currow = w.insertRow(w.rows.length);
	for(i=0; i<aGround[0].length; i++){
		curcell = currow.insertCell(currow.cells.length);
		curcell.style.height = CELL_HEI+"px";
		curcell.style.width = CELL_WID+"px";
		curcell.style.backgroundImage = "URL(img/ground.gif)";
	}
	curcell.style.backgroundImage = "URL(img/sachta.gif)";
	///curcell.innerHTML = '<img src="img/sechta.gif" width="'+ CELL_WID +'" height="'+ CELL_HEI +'">';
	

	////////////////////////////////////
	//      Underground               //
	////////////////////////////////////
	for(i = 0; i <  t.tBodies.length; i++)
		if(t.tBodies[i].id == "underground"){ u = t.tBodies[i]; break; }
	if(!u) alert("TBODY s id 'underground' nenalezeno.");
	
	t.style.width  = (CELL_WID * CELLS_HORIZ) + "px";
	t.style.height = (CELL_HEI * CELLS_VERT) + "px";
	
	// vytvori tabulku, nasazi do ni images
	for(i=0; i<aGround.length; i++){
		currow = u.insertRow(i);
		for(j=0; j<aGround[i].length; j++){
			curcell = currow.insertCell(j);
			curgr = aGround[i][j];
			//curcell.style.backgroundImage = "URL(img/ground"+(curgr.kryti+1)+".gif)";
			cGround.SetBgImage(curcell, "ground"+(curgr.kryti+1)+".gif");
			curcell.style.height = CELL_HEI+"px";
			curcell.style.width = CELL_WID+"px";

			/// Nakresli rovnou odkryte vsechno
			//if(curgr.type && curgr.type!= g_sachta) curcell.innerHTML = '<img src="img/'+aTypImages[curgr.type]+'" alt="">';
		}
		// tohle zpusobovalo chybu s roztahovanim obrazku - je to sloupec navic (omylem)
		/*curcell = currow.insertCell(j++);
		curcell.height = CELL_HEI;
		curcell.background = "img/sachta.gif";*/
	}
}


// Vola se setTimeout()em po umisteni dynamitu.        //
// y je souradnice panacka! Musi se odecist WORLD_HEI! //
cGame.prototype.OdbouchniDynamitXY = function(x,y, iPolomer){
	var a, b, dVzdalenost, dPoskozeni;
	if(!iPolomer) iPolomer = 1;
	PosliZpravu(cGame.str.sBoom,"dynamit");
	this.ground.OdbouchniDynamitXY(x, y-WORLD_HEI, iPolomer);
	a = game.panacek.x - x;
	b = game.panacek.y - y;
	dVzdalenost = Math.sqrt(a*a + b*b)+1;
	dPoskozeni = (iPolomer - dVzdalenost) / iPolomer;
	if(dPoskozeni > 0){
		this.panacek.UberZdraviUprav(Math.floor(100*dPoskozeni));
		this.panacek.SynchronizeInfo();
	}
}

// Koukne na dosud napsana pismena, jestli na jejich konci neni cheat. //
cGame.prototype.CheatCheck = function(code){
	var s;
	if(!(97 <= code && code <= 122)) return false;
	this.sTypedString += String.fromCharCode(code);
	var asCheats = [
		{ sCheat: "fruu", fAction: function(){
				this.panacek.penize = 100000;
				this.panacek.SynchronizeInfo();
			} },
		{ sCheat: "unhide", fAction: function(){
				this.ground.OdkryjVse();
			} }
		];
	for(var i=0; i < asCheats.length; i++){
		s = asCheats[i].sCheat;
		if(s == this.sTypedString.substring(this.sTypedString.length-s.length, this.sTypedString.length)){
			asCheats[i].fAction.call(game);
		}
	}
}

/*****************************************************
*  Loads localized strings                           *
*****************************************************/
cGame.LoadLocalizedStrings = function(sLangKey){
	var i, aItems, oItem, oInternalItem;
	// If lang._.js script was loaded, cLang function object should exist. //
	if(!cLang || typeof(cLang) != "function") return false;
	// If lang.{sLangKey}.js script was loaded, cLang.{sLangKey} should be an object. //
	if(!cLang[sLangKey]) return false;

	// If lang.{sLangKey}.js script was loaded, cLang.{sLangKey}.aItem should be an array of objects. //
	if(!cLang[sLangKey].aItems || typeof(cLang[sLangKey].aItems) != "array" && typeof(cLang[sLangKey].aItems) != "object") return false;
	
	// Items - cLang[sLangKey].aItems => cPredmet.aItems //
	aItems = cLang[sLangKey].aItems;
	for(i = 0; i < aItems.length; i++){
		oItem = aItems[i];
		// Find the item type in cPredmet.aItems[] //
		if(!(oInternalItem = cPredmet.NajdiTypPredmetu(oItem.iId)))
			continue;
		if(oItem.sName)    oInternalItem.sName    = oItem.sName;
		if(oItem.s2p)      oInternalItem.s2p      = oItem.s2p;
		if(oItem.sUsedUp)  oInternalItem.sUsedUp  = oItem.sUsedUp;
		if(oItem.sExpired) oInternalItem.sExpired = oItem.sExpired;
	}

	//  Miscellaneous strings undertaken from the cLang[...].str  //
	if(typeof(cLang[sLangKey].str) == "object")
		cGame.str = cLang[sLangKey].str;
	
	return true;
}


/*****************************************************
*  Loads modified settings                           *
*****************************************************/
cGame.LoadModifiedSettings = function(sSettingsKey){
	var i, aItems, oItem, oInternalItem;
	// If settings._.js script was loaded, cSettings function object should exist. //
	if(!cSettings || typeof(cSettings) != "function") return false;
	// If settings.{sSettingsKey}.js script was loaded, cSettings.{sSettingsKey} should be an object. //
	if(!cSettings[sSettingsKey]) return false;

	// If settings.{sSettingsKey}.js script was loaded, cSettings.{sSettingsKey}.aItem should be an array of objects. //
	if(!cSettings[sSettingsKey].aItems || typeof(cSettings[sSettingsKey].aItems) != "array" || typeof(cSettings[sSettingsKey].aItems) != "object") return false;
	
	// Items - cSettings[sSettingsKey].aItems => cPredmet.aItems //
	aItems = cSettings[sSettingsKey].aItems;
	for(i = 0; i < aItems.length; i++){
		oItem = aItems[i];
		// Find the item type in cPredmet.aItems[] //
		if(!(oInternalItem = cPredmet.NajdiTypPredmetu(oItem.iId)))
			continue;
		if(oItem.iUsages)   oInternalItem.iUsages   = oItem.iUsages;
		if(oItem.iTime)     oInternalItem.iTime     = oItem.iTime;
		if(oItem.iPrice)    oInternalItem.iPrice    = oItem.iPrice;
	}
	
}

/* class cGame - KONEC */