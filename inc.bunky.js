/****************************************************
*  Tridy a inity                                    *
****************************************************/

// cCell - abstraktni trida //
function cCell(){}
cCell.CELL_WID = CELL_WID;
cCell.CELL_HEI = CELL_HEI;

/**********************************************************
*                                                         *
*  class cWorldCell - bunka worldu                        *
*                                                         *
**********************************************************/
function cWorldCell(type, dvereid){
	this.type = type;
	this.dvereid = dvereid;
}
cWorldCell.prototype.type;
cWorldCell.prototype.dvereid;


/**********************************************************
*                                                         *
*  class cWorld - svet nad zemi vcetne povrchu            *
*                                                         *
**********************************************************/
function cWorld(){
	this.map = null;
	this.tbody = null;
}

cWorld.prototype.Init = function(tBody, iCellsHoriz, iCellsVert){
	this.tbody = tBody;
	
	this.map = new Array(WORLD_HEI);
	for(i=0; i<WORLD_HEI; i++){
		this.map[i] = new Array(CELLS_HORIZ);
		for(j=0; j<this.map[i].length-1; j++)
			this.map[i][j] = new cWorldCell(0);
		this.map[i][j] = new cWorldCell(g_sachta);
	}
}

// pleskne barak do daneho tbody
cWorld.prototype.PleskniBarak = function(x, sirka){
	var i;
	for(i=x; i<x+sirka; i++){
	  this.tbody.rows[WORLD_HEI-3].cells[i].style.backgroundImage = "URL(img/_strecha.gif)";
		//this.tbody.rows[WORLD_HEI-2].cells[i].background = "img/_zed.gif";
		this.tbody.rows[WORLD_HEI-2].cells[i].style.backgroundImage = "URL(img/_zed.gif)";
		this.map[WORLD_HEI-3][i].type = this.map[WORLD_HEI-2][i].type = g_zed;
	}
	//this.tbody.rows[2].cells[x].innerHTML = '<img src="img/_strechal.gif" width="16" height="24">';
	//this.tbody.rows[2].cells[x+sirka-1].innerHTML = '<img src="img/_strechar.gif" width="16" height="24">';
	this.tbody.rows[WORLD_HEI-3].cells[x].style.backgroundImage = "URL(img/_strechal.gif)"
	this.tbody.rows[WORLD_HEI-3].cells[x+sirka-1].style.backgroundImage = "URL(img/_strechar.gif)"
	this.map[WORLD_HEI-3][x].type = this.map[WORLD_HEI-3][x+sirka-1].type = g_nic;
}
// pleskne jeden obrazek na dane souradnice daneho this.tbody
cWorld.prototype.PleskniSprite = function(y, x, src){
	this.tbody.rows[y].cells[x].innerHTML = '<img src="'+src+'" width="'+ CELL_WID +'" height="'+ CELL_HEI +'">';
}
cWorld.prototype.PleskniDvere = function(y, x, src, dvereid){
	this.PleskniSprite(y, x, src);
	this.map[y][x].type = g_dvere;
	this.map[y][x].dvereid = dvereid;
}

/* class cWorld - KONEC */
		



/**********************************************************
*                                                         *
*  class cGroundCell - bunka groundu                      *
*                                                         *
**********************************************************/
function cGroundCell(puda, type, kolik){
	this.puda      = puda;        // typ pudy: g_nic=0, g_normal=51, g_skala=52, g_pisek=53, g_tuha=54, g_zaval=55, g_pramen=56, g_sachta=57,  g_voda=71, g_methan=72;
	this.type      = type;        // typ obsahu: g_nic=0, g_pt=2, g_au=3, g_ag=4, g_co=5, g_cu=6, g_lu=7, g_zemdynamit=8, g_drahokam=9
	this.kolik     = kolik;       // kolik je v bunce jednotek obsahu

	var kryti = (type == g_sachta) ? 4 : Math.floor(Math.random() * 1000) % 4;
	this.kryti = kryti;           // kryti bunky, tedy co bude zobrazeno, dokud se to neodkryje; ground(0-3).gif 
	// Dale si uz kryti vubec nebudeme vsimat (krome cGround::RedrawCell()).        //
	
	this.vytezeno  = false;       // bool   - vytezeno                 
	//this.odkryto   = 0.0;
	var r = Math.random();            
	this.odkryto   = -3 * (r*r*r);// double - postup odkryvani; generuje se nahodne od -3 do 0
	this.zatopeno  = false;       // bool   - jestli je to zatopeny    
	this.methan    = false;       // bool   - jestli je v bunce methan 
	this.vyztuzeno = (type == g_sachta) ? false : false;
	
	if(this.puda == g_voda){ this.puda = g_normal; this.zatopeno = true; }
}


// Bunka po odkryti //
cGroundCell.prototype.Odkryj = function(){
	this.odkryto = KOEF_ODKRYTO+1;    // jednicka pro jistotu... you know, double.
}
cGroundCell.prototype.IsVoda = function(){
	return (this.puda == g_pramen || this.zatopeno)
}
cGroundCell.prototype.IsSachta = function(){
	return (this.type == g_sachta || this.puda == g_sachta);
}

// Bunka po tezbe   //
cGroundCell.prototype.Vytez = function(){
	if(this.odkryto < KOEF_ODKRYTO) this.Odkryj();
	this.VytezObsah();
	this.VytezPudu();
	return true;
}
cGroundCell.prototype.VytezPudu  = function(){ this.vytezeno = true; this.puda = g_nic; }
cGroundCell.prototype.VytezObsah = function(){ this.kolik = 0;       this.type = g_nic; }

// Bunka po zavalu  //
cGroundCell.prototype.Zaval = function(){
	this.vytezeno = false;
	this.puda = g_normal;
	this.zatopeno = false;
	this.vyztuzeno = false;
}

// Bunka po zaplave //
cGroundCell.prototype.Zatop = function(){
	this.vytezeno = true;
	this.zatopeno = true;
	this.vyztuzeno = false;
}

// Nasledujici fce jde delat po odkryti, za urcitych podminek a s danymi nastroji
// Co s cim se da delat se obsluhuje v  cPanacek::Move v inc.panacek.js

// Odstraneni zavalu //
cGroundCell.prototype.OdlifrujZaval = function(){
	//if(!this.odkryto) this.Odkryj();
	if(this.puda != g_zaval) return false;
	//this.odkryto  = KOEF_ODKRYTO;
	if(this.odkryto < KOEF_ODKRYTO) return false;	
	this.vytezeno = true;
	this.puda = g_normal;
	this.zatopeno = false;
	return true;
}

// Odcerpani vody //   
cGroundCell.prototype.OdcerpejVodu = function(){
	//if(!this.odkryto) this.Odkryj();
	if(this.odkryto < KOEF_ODKRYTO) return false;
	if(this.puda == g_pramen){ PosliZpravu(cGame.str.sSpringUnremovable); return false; }
	if(!this.zatopeno){ PosliZpravu(cGame.str.sNoWaterThatDir); return false; }
	this.zatopeno = false;
	return true;
}

// Methan //
cGroundCell.prototype.MethanNahormad  = function(){ this.methan = true; }
cGroundCell.prototype.MethanOdvetrej = function(){ this.methan = false; }
cGroundCell.prototype.MethanBouchni  = function(){ this.methan = false; this.vyztuzeno = false; }





/**********************************************************
*                                                         *
*  class cGround - svet pod povrchem                      *
*                                                         *
**********************************************************/
function cGround(){
	this.map = null;
	this.tbody = null;
}

cGround.prototype.VytezBunkuYX = function(y,x){ var b = this.GetCell(y,x);  b && b.Vytez(); }
cGround.prototype.ZavalBunkuYX = function(y,x){ var b = this.GetCell(y,x);  b && b.Zaval(); }
cGround.prototype.ZatopBunkuYX = function(y,x){ var b = this.GetCell(y,x);  b && b.Zatop(); }



/************************************************************************************
* cGround::Init - projede celou tabulku a nasazi tam bunky + vytah po boku          *
************************************************************************************/
cGround.prototype.Init = function(tBody, iCellsHoriz, iCellsVert){
	this.tbody = tBody;


	// Nahodne typ a obsah //
	var X_type, puda, type, cell, r,  i,j;
	this.map = new Array(iCellsVert);
	for(i = 0; i < this.map.length; i++){
		this.map[i] = new Array(iCellsHoriz);
		//alert("this.map: "+ this.map[i]);
		for(j = 0; j < this.map[i].length-1; j++){
			// typ pudy:   g_nic=0, g_normal=51, g_skala=52, g_pisek=53, g_tuha=54, g_zaval=55, g_pramen=56, g_sachta=57
			// typ obsahu: g_nic=0, g_pt=2, g_au=3, g_ag=4, g_co=5, g_cu=6, g_lu=7, g_zemdynamit=8, g_drahokam=9
			// flags:      g_voda=71, g_methan=72  (vyuzito spis jako agrument "pricina" do cPanacek::UberZdravi();
			
			// Zatim zachovame puvodni chovani... bud je tam jinej typ pudy, nebo nejaky obsah //
			X_type = GetRandomType();
			type = g_nic;    if( 1 <= X_type && X_type <=50) type = X_type;
			puda = g_normal; if(51 <= X_type && X_type <=99) puda = X_type;
			// Pozdeji vsak bude kazde generovano zvlast. //
			
			r = Math.random(); r*=r; r*=r; r = Math.ceil(r * MAX_MINERALS_IN_CELL); // r^4; r je 0 az 1 
			
			cell = new cGroundCell(puda, type, r);
			this.map[i][j] = cell;
		}
		// vytah po boku //
		this.map[i][j] = new cGroundCell(g_nic, g_sachta);
		this.map[i][j].odkryto = KOEF_ODKRYTO;
	}
	

	// Aby bylo nejaky vzruso, dame nekam zlatou zilu obklopenou skalami //
	var iCenterX, iCenterY, bZona0, bZona1, bZona2, bZona3; 
	with(Math){
		iCenterX = ceil(random()*(CELLS_HORIZ - 12)) + 6;
		iCenterY = ceil(random()*(CELLS_VERT  - 10)) + 5
	}
	for(i=-3; i <= 3; i++){
		for(j=-5; j <= 5; j++){
			cell = this.map[iCenterY+i][iCenterX+j];
			
			// Center: Y = {-1,0,1}, X = {-3,-2,-1,0,1,2,3} //
			bZona0 = Math.abs(i) * Math.abs(j) == 15; // rohove bunky nechame byt 
			bZona3 = !bZona0 && Math.abs(i) < 2  &&  Math.abs(j) < 4;
			bZona2 = !bZona3 && Math.abs(i) < 3 && Math.abs(j) < 5;
			bZona1 = !bZona2 && Math.abs(i) < 4 && Math.abs(j) < 6;			
																			
			if(bZona3){
				cell.puda = g_skala;
				cell.type = g_au;
				r = Math.random(); r*=r; r*=r; r*=r; // r^8
				cell.kolik = Math.floor(1 + r * NUM_AU_VE_ZLATE_ZILE);
			}
			else if(bZona2){
				if(Math.random() > 0.70) cell.puda = g_skala;
			}
			else if(bZona1){
				if(Math.random() > 0.35) cell.puda = g_skala;
			}
			// else if(bZona0) // nic, nechame to byt
		}// for(j) 
	}// for(i) 
	
}// cGround.prototype.Init() 


/************************************************
*  cGround::OdkryjVse() - Odkryje vsechny bunky *
************************************************/
cGround.prototype.OdkryjVse = function(){
	for(i = 0; i < this.map.length; i++){
		for(j = 0; j < this.map[i].length-1; j++){
			this.map[i][j].Odkryj();
			this.RedrawCell(i,j);
		}
	}
}

/*********************************************************
*  cGround::JeVytezenoVse() - jsou vytezene vsechny bunky? *
*********************************************************/
cGround.prototype.JeVytezenoVse = function(){
	for(i = 0; i < this.map.length; i++)
		for(j = 0; j < this.map[i].length-1; j++)
			with(this.map[i][j])
				if(type != g_nic || odkryto < KOEF_ODKRYTO)
					return false;
	return true;
}


/************************************************
*  cGround::GetCell()  - vrati referenci z pole *
************************************************/
cGround.prototype.GetCell = function(y, x){
	if(y < 0 || y >= this.map.length || x < 0 || x >= this.map[y].length) return null;
	return this.map[y][x];
}

// Presunuto do cPanacek::GetCellRelative()
cGround.prototype.GetCellPan = function(pan, dy, dx){
	if(dy==null) dy = 0;
	if(dx==null) dx = 0;
	return this.GetCell(pan.y-WORLD_HEI+dy, pan.x+dx);
}


// Blbovina, presunuto do cPanacek::RedrawCellRelative = function(dy,dx) //
cGround.prototype.RedrawCellPan = function(pan, dy, dx){
	if(dy==null) dy = 0;
	if(dx==null) dx = 0;
	return this.RedrawCell(pan.y-WORLD_HEI+dy, pan.x+dx);
}

/****************************************************************
*   static cGround::SetBgColor() - barva pozadi bunky           *
****************************************************************/
cGround.SetBgColor = function(cell, sColor){   cell.style.backgroundColor = sColor; }
/****************************************************************
*   static cGround::SetBgImage() - pozadi bunky (typ pudy)      *
****************************************************************/
cGround.SetBgImage = function(cell, sImgFile){ cell.style.backgroundImage = sImgFile ? ("URL("+sImgDir+sImgFile+")") : null; }
/****************************************************************
*   static cGround::SetFgImage() - obrazek v bunce (typ obsahu) *
****************************************************************/
cGround.SetFgImage = function(cell, sImgFile){ cell.innerHTML = sImgFile ? ('<img src="'+sImgDir+sImgFile+'" alt="" />') : ""; }

cGround.prototype.SetBgColor = function(sColor){ this.tbody.style.backgroundColor = sColor; }

/****************************************************************
*   cGround::RedrawCell() - Da novy HTML atd.                   *
****************************************************************/
cGround.prototype.RedrawCell = function(y,x){
	var u       = this.tbody;
	//window.status = u+" Y: "+y+" X: "+x; // +", u.rows[y] == "+u.rows[y];
	var curcell = u.rows[y].cells[x];
	var curgr   = this.map[y][x];
	var iStupenOdkryti = GetInterval(curgr.odkryto, [KOEF_ODKRYTOPUDA, KOEF_ODKRYTOPUL, KOEF_ODKRYTO]);
	var sFg, sBg = "", sBgCol;
	
	// Background image //
	do{
		// Neni odkryto nic. //
		if(iStupenOdkryti == 0){  sBg = "ground"+(curgr.kryti+1)+".gif"; sFg = ""; break; }
		// Odsud dal je odkryta aspon puda //
		if(curgr.zatopeno && iStupenOdkryti >= 2){ sBg = "voda.gif"; sFg = ""; break; }
		// Nebezpeci musime take zkryt, aby to nebylo prilis jednoduchy... //
		if(iStupenOdkryti < 3 && (curgr.puda == g_zaval || curgr.puda == g_pramen) ){
			sBg = "ground"+(curgr.kryti+1)+".gif";
			sFg = "neurcito_t.gif"; break;
		}
		if(curgr.puda == g_normal){ sBg = "ground"+(curgr.kryti+1)+".gif"; break; }
		if(curgr.puda != g_nic){ sBg = aTypImages[curgr.puda]; break; }
		if(curgr.IsSachta()){ sBg = "sachta.gif"; break; }
	}while(0);
	
	// Foreground image, if not set in previous (Bg) block //
	do{
		// Uz je nastaveno, nechame  //
		if(typeof(sFg) == "string") break;
		// odkryti <  KOEF_ODKRYTOPUL //
		if(iStupenOdkryti < 2){  sFg = ""; break; }
		// odkryti >= KOEF_ODKRYTOPUL //
		if(curgr.type != g_nic && !curgr.IsSachta()){  sFg = (iStupenOdkryti < 3 ? "neurcito_t.gif" : aTypImages[curgr.type]); break; }
	}while(0);
	
	// Background color //
	do{
		// Pokud neni vytezeno, bude v Bg obrazek horniny. //
		if(!curgr.vytezeno){ sBgCol = ""; break; }

		// Barvu pozadi menime podle toho, jestli ma panacek svetlo nebo ne.
		// Proto je v else "".
		if(curgr.methan) sBgCol = COLOR_METHAN_BG;
		//else             sBgCol = COLOR_GROUND_BGLIGHT1;
		else             sBgCol = "";
	}while(0);
	
	
	cGround.SetBgImage(curcell, sBg);
	cGround.SetBgColor(curcell, sBgCol); // az za Bg, aby to tam neprobliklo
	cGround.SetFgImage(curcell, sFg);
	
	return true;
	
	
	// -------------------------------------------------------------- //
	// typ pudy:   g_nic=0, g_normal=51, g_skala=52, g_pisek=53, g_tuha=54, g_zaval=55, g_pramen=56, g_sachta=57,   g_voda=71, g_methan=72;
	// typ obsahu: g_nic=0, g_pt=2, g_au=3, g_ag=4, g_co=5, g_cu=6, g_lu=7, g_zemdynamit=8, g_drahokam=9;
	

}// cGround::RedrawCell() - KONEC


// Dynamit - odbouchne zhruba obdelnik //
cGround.prototype.OdbouchniDynamitXY = function(x,y, iSila){
	var cell, o1,o2, iZona = 0;
	var iHalfWid, iHalfHei;
	
	cell = this.GetCell(y,x);
	cell.type = g_nic;

	iHalfWid = Math.floor(iSila);
	iHalfHei = Math.floor(iSila)-1;
	
	for(var dy = -iHalfHei; dy <= iHalfHei; dy++){
		for(var dx = -iHalfWid; dx <= iHalfWid; dx++){
			cell = this.GetCell(y+dy, x+dx);
			if(cell == null) continue;
			
			// Zona //
			with(Math){
				if(abs(dy) == iHalfHei && abs(dx) == iHalfWid) iZona = 10;
				else iZona = round(sqrt(dy*dy + dx*dx));
			}
			
			if(iZona < 10) cell.Odkryj();
			if(iZona < 2){ cell.puda = g_normal; }
			if(iZona < 4){
				if(cell.puda == g_skala) { cell.puda = g_zaval; }    // skala => zaval 
				if(cell.puda == g_zaval) { cell.puda = g_pisek; }    // zaval => pisek
				if(cell.puda == g_pisek) { cell.VytezPudu(); }       // pisek => nic
				if(cell.puda == g_tuha)  { cell.puda = g_normal; }      // tuhá  => normální
				if(cell.puda == g_pramen){ cell.puda = g_normal; cell.Zatop(); }
				cell.zatopeno = false; 
				if(cell.puda == g_sachta){ cell.puda = g_zaval; }
			}
			if(iZona < 3){ cell.VytezPudu(); }
			
			this.RedrawCell(y+dy, x+dx);
		}
	}
}

/* class cGround - KONEC */




/****************************************************
*  uklada predvypocitany hodnoty pro GetRandomType 	*
****************************************************/
function GRTstuff(){
	//                         nic, pt,au,ag, uhli, med, stesti, dyn, drah, skala, pisek, tuha, zaval, pramen, voda, sachta
	this.aTypeProb = new Array(500,  1,10,30,   60,  10,      0,   0,    0,   150,    70,  100,    25,     15,   30,     0);
	this.aTypeMap  = new Array(g_nic, g_pt, g_au, g_ag, g_co, g_cu, g_lu, g_dynamit, g_drahokam,
	                           g_skala, g_pisek, g_tuha, g_zaval, g_pramen,    g_voda, g_sachta, g_methan);
	var i; this.soucet;
	for(i=0, this.soucet=0; i < this.aTypeProb.length; this.soucet += this.aTypeProb[i], i++); // secte
} 
var grts = new GRTstuff();

// vrati 'inteligentne' nahodny typ bonky - v zavislosti na GRTstuff
function GetRandomType(){
	var i, x;
	var iRandom = Math.floor(Math.random()*grts.soucet);    // cislo od 0 do souctu 
	for(i=0, x=0; i<grts.aTypeProb.length; i++){            // zjisti, kam to padlo 
		x += grts.aTypeProb[i];
		if(x > iRandom) break;
	}
	return grts.aTypeMap[i];
}