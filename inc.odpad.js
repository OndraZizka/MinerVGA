/*  <title>-------------------- ODPAD --------------------</title> */

/****  index.html    ****/

//var All = new ElementsById(document,
//	"gametable playground miner vytah infotable splashscreen logo penize zdravi infopt infoau infoag infocu infoco invtable");

	// umisti panacka //
	game.panacek = new cPanacek(game, document.all.miner, CELLS_HORIZ-3, WORLD_HEI-2);
	game.panacek.Draw();
	// umisti vytah   //
	game.vytah = new cVytah(document.all.vytah, CELLS_HORIZ-1);
	game.vytah.Draw();
	

/****  inc.panacek.js    ****/
// Predelan model inventare //

// cInvItem - druh itemu v inventari
// string key - urcuje predmet; int kolik - urcuje, kolik toho v inventari bude; int vznik - kdy to vzniklo, napr. pro baterii
/*function cInvItem(key, kolik, vznik){
	this.pocet = kolik;
	this.vznik = vznik;
	this.zbyva = 10; ///aItemsOdolnost[key]; /// dodelat dvourozm. pole v konstantach!
}*/

// Z konstruktoru //
	this.inventar = new Array(); // Pole predmetu; co predmet, to objekt cPredmet. 	
	this.inventar_pocty = new Array();
	for(var i in aItems)
		this.inventar_pocty[aItems[i]] = new cInvItem(aItems[i], 0, this.iPohyby);
		
// Prepocita inventar a ulozi pocty //
cPanacek.prototype.PrepoctiInventar = function(){ //* cInventar::Prepocti() 
	// Vynulujem pocty //
	for(var i in this.inventar_pocty)
		this.inventar_pocty[i] = 0;
	// Spocitame predmety //
	for(var i in this.inventar)
		this.inventar_pocty[this.inventar[i].typ.sName]++ ;
}




/****  inc.konstanty.js  ****/

// Par konstant prevedeno na uppercase, pozdeji dam jako vlastnosti cGame //

/// Mozna to predelam na jeden array 
var aItemsX = new Array();
aItemsX['lopata'] = { nazev: 'lopata', odolnost: 200, cena: 0 };
aItemsX['lopata'] = { nazev: 'lopata', odolnost: 200, cena: 0 };
var aItemsMapped = new Array('louc','lampa','halogen','baterie', 'lopata','krumpac','vrtak','sbijecka','dynamit', 'kbelik','pumpa');
var aItemsCeny   = new Array(  100 ,   600 ,    2400 ,     400 ,     200 ,     400 ,  1200 ,    10000 ,    3000 ,     100 ,  4200 );
var aItemsNazvy  = new Array('louè','lampu','halogen','baterii', 'lopatu','krumpáè','vrták','sbíjeèka','dynamit', 'kbelík','pumpu');




/****  inc.bunky.js      ****/
function InitWorld(){ //*
	aWorld = new Array(WORLD_HEI);
	for(i=0; i<WORLD_HEI; i++){
		aWorld[i] = new Array(CELLS_HORIZ);
		for(j=0;j<aWorld[i].length-1;j++)
			aWorld[i][j] = new cWorldCell(0);
		aWorld[i][j] = new cWorldCell(g_sachta);
	}
}


// Presunuto do cPanacek //
// Odkryvani okoli - zapocitat inventar (hotovo)
cGround.prototype.OdkryjOkoli = function(pan){
  // Nova matice se prepocita pres pan.PrepocitejOdkryvKoef()
	var cell, o1,o2;
	for(var y=-2; y<=2; y++){
		for(var x=-2; x<=2; x++){
			if(null != (cell = this.GetCellPan(pan, y, x))){
				o1 = cell.odkryto;
				o2 = (cell.odkryto -= -(pan.aOdkryvDistrib[y][pan.dir>0?x:-x]));
				if( (o1 < KOEF_ODKRYTO && KOEF_ODKRYTO <= o2) || 
				    (o1 < KOEF_ODKRYTOPUL && KOEF_ODKRYTOPUL <= o2) )
					this.RedrawCellPan(pan, y, x);
			}
		}
	}
}



/****************************************************************
*   cGround::RedrawCell() - Da novy HTML atd.                   *
*   - verze 3. - komplet ji prekopu (zjednodusim).              *
****************************************************************/
cGround.prototype.RedrawCell = function(y,x){
	var u       = this.tbody;
	//window.status = u+" Y: "+y+" X: "+x; // +", u.rows[y] == "+u.rows[y];
	var curcell = u.rows[y].cells[x];
	var curgr   = this.map[y][x];
	
	// typ pudy:   g_nic=0, g_normal=51, g_skala=52, g_pisek=53, g_tuha=54, g_zaval=55, g_pramen=56, g_sachta=57,   g_voda=71, g_methan=72;
	// typ obsahu: g_nic=0, g_pt=2, g_au=3, g_ag=4, g_co=5, g_cu=6, g_lu=7, g_zemdynamit=8, g_drahokam=9;
	
	// Odkryto, zobrazit vse //
	if(curgr.odkryto >= KOEF_ODKRYTO){
		// zatopeno -> ukaze jen vodu //
		if(curgr.zatopeno){
			cGround.SetBgImage(curcell, "voda.gif");
			cGround.SetFgImage(curcell, "");
		// jinak normalne...          //
		}else{
			// vytezeno -> prazdno? //
			//if(curgr.vytezeno){
			if(curgr.puda == g_nic){
				//if(curgr.IsSachta()) curcell.style.backgroundImage = "URL(img/sachta.gif)";
				if(curgr.IsSachta()) cGround.SetBgImage(curcell, "sachta.gif");
				else{ cGround.SetBgImage(curcell, ""); }
				if(curcell.methan) cGround.SetBgColor(curcell, COLOR_METHAN_BG);
				else               cGround.SetBgColor(curcell, COLOR_GROUND_BG);
				if(curgr.type)
					//curcell.innerHTML = '<img src="img/'+aTypImages[curgr.type]+'" alt="" />';
					cGround.SetFgImage(curcell, aTypImages[curgr.type]);
				else cGround.SetFgImage(curcell, "");
			}else{
				//curcell.style.backgroundImage = "URL(img/ground"+(curgr.puda+1)+".gif)";
				if(curgr.puda == g_normal)
					//curcell.style.backgroundImage = "URL(img/ground"+(curgr.kryti+1)+".gif)";
					cGround.SetBgImage(curcell, "ground"+(curgr.kryti+1)+".gif");
				else
					cGround.SetBgImage(curcell, aTypImages[curgr.puda]);
				// neco tam je, takze to zobrazime pres img //
				if(curgr.type)
					cGround.SetFgImage(curcell, aTypImages[curgr.type]);
				else cGround.SetFgImage(curcell, ""); // nic nebo sachta -> prazdno 
			}
		}
	}
	// Odkryto zpola, zobrazit typ pudy a neurcito //
	else if(curgr.odkryto >= KOEF_ODKRYTOPUDA){
		if(curgr.puda != g_normal)
			cGround.SetBgImage(curcell, aTypImages[curgr.puda]);
		if(curgr.odkryto <= KOEF_ODKRYTOPUL)
			cGround.SetFgImage(curcell, "");
		else if(curgr.type != g_nic)
			cGround.SetFgImage(curcell, "neurcito.gif");
	}
	// Neni odkryto, zobrazi defaultni pudu        // 
	else{
		//curcell.style.backgroundImage = "URL(img/ground"+(curgr.kryti+1)+".gif)";
		cGround.SetBgImage(curcell, "ground"+(curgr.kryti+1)+".gif");
		cGround.SetFgImage(curcell, "");
	}
}// cGround::RedrawCell() - KONEC

/****************************************************************
*   cGround::RedrawCell() - Da novy HTML atd.                   *
*   - verze 2. - prepisu na pouziti SetBg/FgImage a SetBgColor. *
****************************************************************/
cGround.prototype.RedrawCell = function(y,x){
	var u       = this.tbody;
	//window.status = u+" Y: "+y+" X: "+x; // +", u.rows[y] == "+u.rows[y];
	var curcell = u.rows[y].cells[x];
	var curgr   = this.map[y][x];
	
	// typ pudy:   g_nic=0, g_normal=51, g_skala=52, g_pisek=53, g_tuha=54, g_zaval=55, g_pramen=56, g_sachta=57,   g_voda=71, g_methan=72;
	// typ obsahu: g_nic=0, g_pt=2, g_au=3, g_ag=4, g_co=5, g_cu=6, g_lu=7, g_zemdynamit=8, g_drahokam=9;
	
	// Odkryto, zobrazit vse //
	if(curgr.odkryto >= KOEF_ODKRYTO){
		// zatopeno -> ukaze jen vodu //
		if(curgr.zatopeno){
			curcell.style.backgroundImage = "URL(img/voda.gif)";
			curcell.innerHTML = "";
		// jinak normalne...          //
		}else{
			// vytezeno -> prazdno? //
			//if(curgr.vytezeno){
			if(curgr.puda == g_nic){
				//if(curgr.IsSachta()) curcell.style.backgroundImage = "URL(img/sachta.gif)";
				if(curgr.IsSachta()) cGround.SetBgImage(curcell, "sachta.gif");
				else{ curcell.style.backgroundImage = ""; }
				if(curcell.methan)curcell.style.backgroundColor = COLOR_METHAN_BG;
				else              curcell.style.backgroundColor = COLOR_GROUND_BG;
				if(curgr.type)
					//curcell.innerHTML = '<img src="img/'+aTypImages[curgr.type]+'" alt="" />';
					cGround.SetFgImage(curcell, aTypImages[curgr.type]);
				else curcell.innerHTML = "";
			}else{
				//curcell.style.backgroundImage = "URL(img/ground"+(curgr.puda+1)+".gif)";
				if(curgr.puda == g_normal)
					//curcell.style.backgroundImage = "URL(img/ground"+(curgr.kryti+1)+".gif)";
					cGround.SetBgImage(curcell, "ground"+(curgr.kryti+1)+".gif");
				else
					curcell.style.backgroundImage = "URL(img/"+aTypImages[curgr.puda]+")";					
				// neco tam je, takze to zobrazime pres img //
				if(curgr.type)
					curcell.innerHTML = '<img src="img/'+aTypImages[curgr.type]+'" alt="" />';
				else curcell.innerHTML = ""; // nic nebo sachta -> prazdno 
			}
		}
	}
	// Odkryto zpola, zobrazit typ pudy a neurcito //
	else if(curgr.odkryto >= KOEF_ODKRYTOPUDA){
		if(curgr.puda != g_normal)
			curcell.style.backgroundImage = "URL(img/"+aTypImages[curgr.puda]+")";
		if(curgr.odkryto <= KOEF_ODKRYTOPUL)
			curcell.innerHTML = "";
		else if(curgr.type != g_nic)
			curcell.innerHTML = '<img src="img/neurcito.gif" alt="" border="0" />';
	}
	// Neni odkryto, zobrazi defaultni pudu        // 
	else{
		//curcell.style.backgroundImage = "URL(img/ground"+(curgr.kryti+1)+".gif)";
		cGround.SetBgImage(curcell, "ground"+(curgr.kryti+1)+".gif");
		curcell.innerHTML = "";
	}
}// cGround::RedrawCell() - KONEC

/**********************************************
*   cGround::RedrawCell() - Da novy HTML atd. *
-    Predelal jsem ji na novy koncept pudy    -
**********************************************/
cGround.prototype.RedrawCell = function(y,x){
	var u       = this.tbody;
	//window.status = u+" Y: "+y+" X: "+x; // +", u.rows[y] == "+u.rows[y];
	var curcell = u.rows[y].cells[x];
	var curgr   = this.map[y][x];
	
	// Neni odkryto, zobrazi jen typ pudy // 
	if(curgr.odkryto < KOEF_ODKRYTO){
		curcell.style.backgroundImage = "URL(img/ground"+(curgr.puda+1)+".gif)";
		if(curgr.odkryto < KOEF_ODKRYTOPUL) curcell.innerHTML = "";
		else if(curgr.type != 0)
			curcell.innerHTML = '<img src="img/neurcito.gif" alt="" border="0" />';
			
	// Odkryto                            //
	}else{
		// zatopeno -> ukaze jen vodu 
		if(curgr.zatopeno){
			//alert("y: "+y+" x: "+x+"\n"+show(curgr));
			curcell.style.backgroundImage = "URL(img/voda.gif)";
		// jinak normalne... 
		}else{
			// vytezeno -> prazdno? 
			if(curgr.vytezeno){
				if(curgr.type == g_sachta) curcell.style.backgroundImage = "URL(img/sachta.gif)";
				else{ curcell.style.backgroundImage = ""; /*curcell.style.backgroundColor = "#d2b48c";*/ }
				curcell.innerHTML = ""; // nic
			}else{
				curcell.style.backgroundImage = "URL(img/ground"+(curgr.puda+1)+".gif)";
				// neco tam je, takze to zobrazime pres img
				if(curgr.type && curgr.type != g_sachta)
					curcell.innerHTML = '<img src="img/'+aTypImages[curgr.type]+'" alt="" />';
				else curcell.innerHTML = ""; // nic nebo sachta -> prazdno 
			}
		}
	}// odkryto 
}

/*********************************************************************
*  projede celou tabulku a nasazi tam nahodny bunky + vytah po boku  *
*********************************************************************/
function InitGround(){ //*
	var type, cell, r;
	aGround = new Array(CELLS_VERT);
	for(i=0; i<aGround.length; i++){
		aGround[i] = new Array(CELLS_HORIZ);
		//alert("aGround: "+ aGround[i]);
		for(j=0; j<aGround[i].length-1; j++){
			type = GetRandomType();
			cell = new cGroundCell(type);
			r = Math.random(); r*=r;r*=r; // r^4
			cell.kolik = Math.ceil(r * 20);
			aGround[i][j] = cell;
		}
		// vytah po boku
		aGround[i][j] = new cGroundCell(g_sachta);
		aGround[i][j].odkryto = KOEF_ODKRYTO;
	}
}

/*******************************************
*   GetCell()  - vrati referenci z aGround *
*******************************************/
function GetCell(y,x){ //*
	if(y<0 || y >= CELLS_VERT || x<0 || x >= CELLS_HORIZ) return null;
	return aGround[y][x];
}
function GetCellPan(pan,dy,dx){ //*
	if(dy==null) dy = 0;
	if(dx==null) dx = 0;
	return GetCell(pan.y-WORLD_HEI+dy, pan.x+dx);
}


/*******************************************
*   RedrawGroundCellPan(cPanacek, int, int)*
*******************************************/
function RedrawGroundCellPan(pan,dy,dx){ //*
	if(dy==null) dy = 0;
	if(dx==null) dx = 0;
	return RedrawGroundCell(pan.y-WORLD_HEI+dy, pan.x+dx);
}
/*******************************************
*   RedrawGroundCell() - Da novy HTML atd. *
*******************************************/
function RedrawGroundCell(y,x){ //*
	var t = document.all.gametable;
	var u; for(i in t.tBodies) if(t.tBodies[i].id == "underground") u = t.tBodies[i];
	//window.status = u+" Y: "+y+" X: "+x; // +", u.rows[y] == "+u.rows[y];
	var curcell = u.rows[y].cells[x];
	var curgr   = aGround[y][x];
	
	// Neni odkryto, zobrazi jen ground 
	if(curgr.odkryto < KOEF_ODKRYTO){
		curcell.background = "img/ground"+(curgr.ground+1)+".gif";
		if(curgr.odkryto < KOEF_ODKRYTOPUL) curcell.innerHTML = "";
		else if(curgr.type != 0)
			curcell.innerHTML = '<img src="img/neurcito.gif" alt="" border="0" />';
			
	// Odkryto                          
	}else{
		// zatopeno -> ukaze jen vodu 
		if(curgr.zatopeno){
			//alert("y: "+y+" x: "+x+"\n"+show(curgr));
			curcell.background = "img/voda.gif";
		// jinak normalne... 
		}else{
			// vytezeno -> prazdno? 
			if(curgr.vytezeno){
				if(curgr.type == g_sachta) curcell.background = "img/sachta.gif";
				else{ curcell.background = ""; curcell.bgColor    = "#d2b48c"; }
				curcell.innerHTML = ""; // nic
			}else{
				curcell.background = "img/ground"+(curgr.ground+1)+".gif";
				// neco tam je, takze to zobrazime pres img
				if(curgr.type && curgr.type != g_sachta)
					curcell.innerHTML = '<img src="img/'+aTypImages[curgr.type]+'" alt="" />';
				else curcell.innerHTML = ""; // nic nebo sachta -> prazdno 
			}
		}
	}// odkryto 
}

// Bunka po odkryti...  do curgr jde aGround[y][x]   
function OdkryjBunku(curgr){ //* cGroundCell
	curgr.odkryto = KOEF_ODKRYTO;
}
// Odkryvani okoli - zapocitat inventar (hotovo)
function OdkryjOkoli(pan){ //* cGround
  // Nova matice se prepocita pres pan.PrepocitejOdkryvKoef()
	var cell, o1,o2;
	for(var y=-2; y<=2; y++)
		for(var x=-2; x<=2; x++)
			if(null != (cell = GetCellPan(pan, y, x))){
				o1 = cell.odkryto;
				o2 = (cell.odkryto -= -(pan.aOdkryvDistrib[y][pan.dir>0?x:-x]));
				if( (o1 < KOEF_ODKRYTO && KOEF_ODKRYTO <= o2) || 
				    (o1 < KOEF_ODKRYTOPUL && KOEF_ODKRYTOPUL <= o2) )
					RedrawGroundCellPan(pan, y, x);
			}
}

// Bunka po tezbe...  do curgr jde aGround[y][x]   
function VytezBunku(curgr){ //*
	if(curgr.odkryto < KOEF_ODKRYTO) OdkryjBunku(curgr);
	curgr.vytezeno = true;
	curgr.type = g_nic;
	return true;
}
function VytezBunkuYX(y,x){ VytezBunku(aGround[y][x]); }

// Bunka po zavalu...         
function ZavalBunku(curgr){ //*
	curgr.vytezeno = false;
	curgr.zatopeno = false;
	curgr.vyztuzeno = false; /// to by melo jit pres nahodu 
}
function ZavalBunkuYX(y,x){ ZavalBunku(aGround[y][x]); }

// Bunka po zaplave...        
function ZatopBunku(curgr){ //*
	curgr.vytezeno = true;
	curgr.zatopeno = true;
	curgr.vyztuzeno = false; /// to by melo jit pres nahodu 
}
function ZatopBunkuYX(y,x){ ZatopBunku(aGround[y][x]); }

// Nasledujici fce jde delat po odkryti, za urcitych podminek a s danymi nastroji
// Co s cim se da delat se obsluhuje v  cPanacek::Move v inc.panacek.js

// Odstraneni zavalu...  do curgr jde aGround[y][x]   
function OdlifrujZaval(curgr){ //*
	//if(!curgr.odkryto) OdkryjBunku(curgr);
	if(curgr.type != g_zaval) return;
	if(!curgr.odkryto) return;
	//curgr.odkryto  = KOEF_ODKRYTO;
	curgr.vytezeno = true;
	curgr.zatopeno = false;
}
// Odstraneni zavalu...  do curgr jde aGround[y][x]   
function OdcerpejVodu(curgr){ //*
	//if(!curgr.odkryto) OdkryjBunku(curgr);
	if(curgr.odkryto < keof_odkryto) return;
	if(curgr.puda == g_pramen){ PosliZpravu("Pramen nejde odcerpat - je nekonecny..."); return; }
	if(!curgr.zatopeno){ PosliZpravu("V danem smeru neni stola zatopena."); return; }
	curgr.zatopeno = false;
}




/****  inc.saveload.js   ****/
// Tam jeste nic neprotridovano //



/****  inc.envcreate.js  ****/
// Soubor byl uplne zrusen //

// pleskne barak do daneho tbody
function PleskniBarak(x, sirka, tbody){
	var i;
	for(i=x; i<x+sirka; i++){
	  tbody.rows[WORLD_HEI-3].cells[i].style.backgroundImage = "URL(img/_strecha.gif)";
		//tbody.rows[WORLD_HEI-2].cells[i].background = "img/_zed.gif";
		tbody.rows[WORLD_HEI-2].cells[i].style.backgroundImage = "URL(img/_zed.gif)";
		aWorld[WORLD_HEI-3][i].type = aWorld[WORLD_HEI-2][i].type = g_zed;
	}
	//tbody.rows[2].cells[x].innerHTML = '<img src="img/_strechal.gif" width="16" height="24">';
	//tbody.rows[2].cells[x+sirka-1].innerHTML = '<img src="img/_strechar.gif" width="16" height="24">';
	tbody.rows[WORLD_HEI-3].cells[x].style.backgroundImage = "URL(img/_strechal.gif)"
	tbody.rows[WORLD_HEI-3].cells[x+sirka-1].style.backgroundImage = "URL(img/_strechar.gif)"
	aWorld[WORLD_HEI-3][x].type = aWorld[WORLD_HEI-3][x+sirka-1].type = g_nic;
}
// pleskne jeden obrazek na dane souradnice daneho tbody
function PleskniSprite(tbody, y, x, src){
	tbody.rows[y].cells[x].innerHTML = '<img src="'+src+'" width="'+ CELL_WID +'" height="'+ CELL_HEI +'">';
}
function PleskniDvere(tbody, y, x, src, dvereid){
	PleskniSprite(tbody, y, x, src);
	aWorld[y][x].type = g_dvere;
	aWorld[y][x].dvereid = dvereid;
}

/*******************************
*   Vytvori tabulku, vyplni    *
*******************************/
function VytvorTabulku(t){ //* presunuto do cGame::VytvorTabulku()
	var currow, curcell, r,i,j, w, u;

	for(i in t.tBodies)
		if(t.tBodies[i].id == "world")
			w = t.tBodies[i];
	if(!w) alert("TBODY s id 'world' nenalezeno.");
	
	// obloha - dodelat ptaky, mraky atd.
	currow = w.insertRow(w.rows.length);
	curcell = currow.insertCell(0);
	curcell.colSpan = CELLS_HORIZ;
	curcell.height = CELL_HEI;
	curcell.width  = CELL_WID;
	curcell.bgColor = "#87cefa";

	currow = w.insertRow(w.rows.length);
	curcell = currow.insertCell(0);
	curcell.colSpan = CELLS_HORIZ;
	curcell.height = CELL_HEI;
	curcell.width  = CELL_WID;
	curcell.bgColor = "#87cefa";
	// treti a ctvrta rada - obloha 
	for(r=0; r<2; r++){
		currow = w.insertRow(w.rows.length);
		currow.bgColor = "#87cefa";
		for(i=0; i<CELLS_HORIZ; i++){
			curcell = currow.insertCell(currow.cells.length);
			curcell.height = CELL_HEI;
			curcell.width  = CELL_WID;
		}
	}
	// napleska baraky 
	PleskniSprite(w,WORLD_HEI-2,0,"img/_kaktus.gif");   aWorld[WORLD_HEI-2][0].type = g_kaktus;
	PleskniSprite(w,WORLD_HEI-2,2,"img/_zachod.gif");   aWorld[WORLD_HEI-2][2].type = g_zachod;
	PleskniBarak(3,7,w);
	PleskniDvere(w,WORLD_HEI-2,7,"img/_vratal.gif",d_nemocnice);
	PleskniDvere(w,WORLD_HEI-2,8,"img/_vratar.gif",d_nemocnice);
	PleskniSprite(w,WORLD_HEI-2,4,"img/_kriz.gif");
	PleskniBarak(13,4,w);
	PleskniDvere(w,WORLD_HEI-2,14,"img/_dvere.gif",d_banka);
	PleskniSprite(w,WORLD_HEI-2,15,"img/_dolar.gif");
	PleskniBarak(20,5,w);
	PleskniSprite(w,WORLD_HEI-2,20,"img/_drink.gif");
	PleskniDvere(w,WORLD_HEI-2,22,"img/_saloon.gif",d_bordel);
	PleskniSprite(w,WORLD_HEI-2,24,"img/_bordel.gif");
	PleskniBarak(26,4,w);
	PleskniDvere(w,WORLD_HEI-2,27,"img/_dvere.gif", d_tools);
	PleskniSprite(w,WORLD_HEI-2,29,"img/_kolo.gif");
	
	PleskniBarak(33,2,w);
	PleskniSprite(w,WORLD_HEI-2,33,"img/_info.gif");
	PleskniDvere(w,WORLD_HEI-2,34,"img/_dvere.gif", d_info);
	
	PleskniSprite(w,WORLD_HEI-2,36,"img/_hradlo.gif");  aWorld[WORLD_HEI-2][36].type = g_hradlo;

	// 'podlaha' - posledni radka of world
	currow = w.insertRow(w.rows.length);
	for(i=0; i<aGround[0].length; i++){
		curcell = currow.insertCell(currow.cells.length);
		//curcell.height = CELL_HEI;
		curcell.style.height = CELL_HEI+"px";
		//curcell.width = CELL_WID;
		curcell.style.width = CELL_WID+"px";
		curcell.style.backgroundImage = "URL(img/ground.gif)";
	}
	curcell.style.backgroundImage = "URL(img/sachta.gif)";
	//curcell.innerHTML = '<img src="img/sechta.gif" width="'+ CELL_WID +'" height="'+ CELL_HEI +'">';
	

	////////////////////////////////////
	//      Underground               //
	////////////////////////////////////
	for(i in t.tBodies)
		if(t.tBodies[i].id == "underground")
			u = t.tBodies[i];
	if(!u) alert("TBODY s id 'underground' nenalezeno.");
	
	t.style.width  = (CELL_WID * CELLS_HORIZ) + "px";
	t.style.height = (CELL_HEI * CELLS_VERT) + "px";
	
	// vytvori tabulku, nasazi do ni images
	for(i=0; i<aGround.length; i++){
		currow = u.insertRow(i);
		for(j=0; j<aGround[i].length; j++){
			curcell = currow.insertCell(j);
			curgr = aGround[i][j];
			//curcell.background = "img/ground"+(curgr.ground+1)+".gif";
			//curcell.height = CELL_HEI;
			//curcell.width = CELL_WID;
			curcell.style.backgroundImage = "URL(img/ground"+(curgr.ground+1)+".gif)";
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




/****  inc.predmety.js   ****/
// Tam odpad nebude, to je novy soubor kam uz pisu rovnou tridy. //


/****  inc.system.js     ****/
// Tam odpad bude mozna az casem. //


/****  inc.game.js       ****/
// Tam odpad nebude, to je novy soubor kam uz pisu rovnou tridy. //
