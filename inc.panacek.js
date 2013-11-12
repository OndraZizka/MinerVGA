/****************************
*   cPanacek                *
****************************/

function cPanacek(game, div, x,y){
	this.game = game;
	this.div = div;
	this.img = bMSIE ? div.all.minerimg : div.firstChild;
	this.x = x;               // x position
	this.y = y;               // y position
	this.dir = 1;             // -1 left, 1 right
	this.iPohyby = 0;
	this.vevytahu = 0;
	this.sGroundBgCol = COLOR_GROUND_BGDARK;
	
	this.inv = new cInventar();  // objekt inventare s metodami atd.
	this.pripraveno = null;      // Objekt cPredmet z this.inv, ktery je pripraven na pristi pohyb. 
	
	this.penize = PAN_START_PENIZE; // stav na uctu; zahrnuje dluh 
	this.debt   = PAN_START_DLUH; // dluh v bance; minimalni limit MAX_DEBT, /// maximalne this.penize / 2
	this.zdravi = PAN_START_ZDRAVI; // zdravi <= 0 -> smrt;  max. 100
	this.stit   = 0;
	this.pt     = 0;   // platina
	this.au     = 0;   // zlato
	this.ag     = 0;   // stribro
	this.cu     = 0;   // med
	this.co     = 0;   // uhli
	this.lu     = 0;   // stesti (luck)
	
	this.casNaZachode  = new Date();
	this.casZmenaKurzu = new Date();
	this.cizinci       = false;
	
	this.aOdkryvDistrib = new Array();
	var aOD = this.aOdkryvDistrib;
	aOD[-2] = new Array();
	aOD[-1] = new Array();
	aOD[ 0] = new Array();
	aOD[ 1] = new Array();
	aOD[ 2] = new Array();
	/*aOD[-2][-2] = 0.00; aOD[-2][-1] = 0.05; aOD[-2][ 0] = 0.20; aOD[-2][ 1] = 0.10; aOD[-2][ 2] = 0.05;
	aOD[-1][-2] = 0.05; aOD[-1][-1] = 0.10; aOD[-1][ 0] = 0.30; aOD[-1][ 1] = 0.25; aOD[-1][ 2] = 0.15;
	aOD[ 0][-2] = 0.05; aOD[ 0][-1] = 0.15; aOD[ 0][ 0] = 0.00; aOD[ 0][ 1] = 0.40; aOD[ 0][ 2] = 0.25;
	aOD[ 1][-2] = 0.05; aOD[ 1][-1] = 0.10; aOD[ 1][ 0] = 0.40; aOD[ 1][ 1] = 0.25; aOD[ 1][ 2] = 0.15;
	aOD[ 2][-2] = 0.05; aOD[ 2][-1] = 0.05; aOD[ 2][ 0] = 0.15; aOD[ 2][ 1] = 0.25; aOD[ 2][ 2] = 0.05;*/

	this.PrepoctiOdkryvKoef();
}

cPanacek.prototype.HalogenOnOff = function(bOn){ var p, t, s;
	t = cPredmet.NajdiTypPredmetu("halogen");
	if(!( p = this.inv.NajdiNejopotrebovanejsiZapnuty("halogen") )){
		PosliZpravuArg(cGame.str.sYouDontHave, t.s2p);		
		return false;
	}
	p.bOn = (bOn) ? bOn : !p.bOn;
	s = cGame.str["sItemWasSwitched" + (p.bOn ? "On" : "Off")].replace("%1", t.sName);
	PosliZpravu(UCFirst(s));
	return true;
}
cPanacek.prototype.PripravLopatu = function(){ var p, t, s;
	t = cPredmet.NajdiTypPredmetu("lopata");
	if(!( p = this.inv.NajdiNejopotrebovanejsiZapnuty("lopata") )){
		PosliZpravuArg(cGame.str.sYouDontHave, t.s2p);
		return false;
	}
	this.pripraveno = p;
	PosliZpravuArg(cGame.str.sYouHavePrepared, t.s2p);
	return true;
}
cPanacek.prototype.PripravKrumpac = function(){ var p, t, s;
	t = cPredmet.NajdiTypPredmetu("krumpac");
	if(!( p = this.inv.NajdiNejopotrebovanejsiZapnuty("krumpac") )){
		PosliZpravuArg(cGame.str.sYouDontHave, t.s2p);
		return false;
	}
	this.pripraveno = p;
	PosliZpravuArg(cGame.str.sYouHavePrepared, t.s2p);
	return true;
}
cPanacek.prototype.PripravVrtak = function(){ var p, t, s;
	t = cPredmet.NajdiTypPredmetu("vrtak");
	if(!( p = this.inv.NajdiNejopotrebovanejsiZapnuty("vrtak") )){
		PosliZpravuArg(cGame.str.sYouDontHave, t.s2p);
		return false;
	}
	this.pripraveno = p;	
	PosliZpravuArg(cGame.str.sYouHavePrepared, t.s2p);
	return true;
}
cPanacek.prototype.PripravSbijecku = function(){ var p, t, s;
	t = cPredmet.NajdiTypPredmetu("sbijecka");
	if(!( p = this.inv.NajdiNejopotrebovanejsiZapnuty("sbijecka") )){
		PosliZpravuArg(cGame.str.sYouDontHave, t.s2p);
		return false;
	}
	this.pripraveno = p;
	PosliZpravuArg(cGame.str.sYouHavePrepared, t.s2p);
	return true;
}
cPanacek.prototype.OdpalDynamit = function(){ var p, t, s, cell, iPolomerVybuchu;
	t = cPredmet.NajdiTypPredmetu("dynamit");
	if(!( p = this.inv.NajdiNejopotrebovanejsiZapnuty("dynamit") )){
		PosliZpravuArg(cGame.str.sYouDontHave, t.s2p);
		return false;
	}
	if(!(cell = this.GetCellRelative() )) return false;
	cell.type = g_zemdynamit;
	this.inv.Odeber(p);
	this.SynchronizeInfo();
	this.RedrawCellRelative();
	PosliZpravu(cGame.str.sDynamiteActivated);
	iPolomerVybuchu = 3 + Math.floor(5*Math.random());
	// Tady nebude this.y-WORLD_HEI , abych mohl pozdeji bouchat i baraky. //
	window.setTimeout("game.OdbouchniDynamitXY("+(this.x)+","+(this.y)+","+iPolomerVybuchu+");", DYNAMITE_DELAY_MS);
	return true;
}
cPanacek.prototype.PripravKbelik = function(){ var p, t, s;
	t = cPredmet.NajdiTypPredmetu("kbelik");
	if(!( p = this.inv.NajdiNejopotrebovanejsiZapnuty("kbelik") )){
		PosliZpravuArg(cGame.str.sYouDontHave, t.s2p);
		return false;
	}
	this.pripraveno = p;
	PosliZpravuArg(cGame.str.sYouHavePrepared, t.s2p);
	return true;
}
cPanacek.prototype.PripravPumpu = function(){ var p, t, s;
	t = cPredmet.NajdiTypPredmetu("pumpa");
	if(!( p = this.inv.NajdiNejopotrebovanejsiZapnuty("pumpa") )){
		PosliZpravuArg(cGame.str.sYouDontHave, t.s2p);
		return false;
	}
	this.pripraveno = p;
	PosliZpravuArg(cGame.str.sYouHavePrepared, t.s2p);
	return true;
}




// Ziska bunku, kde panacek zrovna stoji. //
cPanacek.prototype.GetCellRelative = function(dy, dx){
	if(dy==null) dy = 0;
	if(dx==null) dx = 0;
	return this.game.ground.GetCell(this.y-WORLD_HEI+dy, this.x+dx);
}
// Prekresli bunku, kde panacek zrovna stoji. //
cPanacek.prototype.RedrawCellRelative = function(dy, dx){
	if(dy==null) dy = 0;
	if(dx==null) dx = 0;
	return this.game.ground.RedrawCell(this.y-WORLD_HEI+dy, this.x+dx);
}

// Prepocita matici na odkryv okoli podle vlastnenych predmetu. //
cPanacek.prototype.PrepoctiOdkryvKoef = function(){
	var koef1 = Math.max(window.aOdkryvKoef["nic"][0],
		 this.inv.pocty['louc']    > 0 ? window.aOdkryvKoef["louc"][0]    : 0
		,this.inv.pocty['lampa']   > 0 ? window.aOdkryvKoef["lampa"][0]   : 0
		,this.inv.pocty['halogen'] > 0 ? window.aOdkryvKoef["halogen"][0] : 0
		//,this.inv.pocty['sonda'] > 0 ? window.aOdkryvKoef["sonda"][0] : 0
		//,this.inv.pocty['trikoder'] > 0 ? window.aOdkryvKoef["trikoder"][0] : 0
		);
	var koef2 = Math.max(window.aOdkryvKoef["nic"][1],
		 this.inv.pocty['louc']    > 0 ? window.aOdkryvKoef["louc"][1]    : 0
		,this.inv.pocty['lampa']   > 0 ? window.aOdkryvKoef["lampa"][1]   : 0
		,this.inv.pocty['halogen'] > 0 ? window.aOdkryvKoef["halogen"][1] : 0
		//this.inv.pocty['sonda'] > 0 ? window.aOdkryvKoef["sonda"][1] : 0,
		//this.inv.pocty['trikoder'] > 0 ? window.aOdkryvKoef["trikoder"][1] : 0
		);

	for(var y=-2; y<=2; y++)
		for(var x=-2; x<=2; x++)
			this.aOdkryvDistrib[y][x] = window.aOdkryvDistrib[y][x] * ((Math.abs(x)>1 || Math.abs(y)>1) ? koef2 : koef1);
	//alert(this.aOdkryvDistrib[0][1]);
}

/**********************************
*  Vykresli DIV panacka            *
**********************************/
cPanacek.prototype.Draw = function(){
	if(!this.div.style.display || this.div.style.display == 'none') this.div.style.display = 'block';
	this.div.style.left = this.x * CELL_WID;
  this.div.style.top  = this.y * CELL_HEI;
	//this.img.src = (this.dir < 0) ? "img/minerl.gif" : "img/minerr.gif";
	var sDirChar  = (this.dir < 0) ? "l":"r";
	var sDeadGray = (this.zdravi <= 0) ? "_gray":"";
	this.img.src = sImgDir+"miner"+sDirChar+sDeadGray+".gif";
	//if(bMSIE) this.div.style.filter = "Gray";
	this.div.style.zIndex  = 50;
}

/**********************************
*  cPanacek::Turn()               *
**********************************/
cPanacek.prototype.Turn = function(){
	this.dir *= -1;
	this.Draw();
}

/****************************
*   Posouvani playgroundu   *
****************************/
cPanacek.prototype.Focus = function(dy,dx){
	var p = document.all.playground;
	var pt = new Point(this.x*CELL_WID, this.y*CELL_HEI);
	if(dy==null) dy = 1;
	if(dx==null) dx = 1;	
	// pokud je bunku nad nebo pod okrajem zobrazene casti 
	//if(p.scrollTop != 0  &&  p.scrollTop + p.clientHeight < p.scrollHeight)
	if((dy != 0) && 1< this.y && this.y < CELLS_VERT-1)
	if(pt.y < p.scrollTop + 2*CELL_HEI || pt.y > p.scrollTop + p.clientHeight - 2*CELL_HEI){
		// rovnice: pt.y = p.scrollTop + p.clientHeight/2
		///PosliZpravu("Panacek mimo Y!");
		p.scrollTop = pt.y - p.clientHeight/2;
	}
	//if(p.scrollLeft != 0  &&  p.scrollLeft + p.clientWidth < p.scrollWidth)
	if((dx != 0) && 1 < this.x && this.x < CELLS_HORIZ-1)
	if(pt.x < (p.scrollLeft + 2*CELL_WID) || pt.x > p.scrollLeft + p.clientWidth - 2*CELL_WID){
		// rovnice: pt.x = p.scrollLeft + p.clientWidth/2
		///PosliZpravu("Panacek mimo X!");
		p.scrollLeft = pt.x - p.clientWidth/2;
	}
}


/******************************************************************************
*  cPanacek::Move()                                                           *
*  osetri pohyb panacka po mape                                               *
******************************************************************************/
cPanacek.prototype.Move = function(dx,dy){
	var vytah = this.game.vytah;
	
	this.iPohyby++;
	if(this.zdravi <= 0) return;
	
	// osetreni uniku vodorovne //
	if(dx != 0){
		this.dir = (dx < 0) ? -1 : 1;                                          // smer natoceni panacka
		if(this.x == 0 && dx < 0){                  UtikaDoStrany(); dx = 0; } // doleva  
		else if(this.x >= CELLS_HORIZ-1 && dx > 0){ UtikaDoStrany(); dx = 0; } // doprava 
		if(this.vevytahu && (this.y == WORLD_HEI-1 || this.y + dy == WORLD_HEI-1 )){ UtikaDoPovrchu(); dx = 0; } // vedle povrchu 
	}

	// osetreni uniku svisle //
	if(dy != 0){
		if(this.y + dy == WORLD_HEI-1 && !this.vevytahu){ UtikaDoPovrchu(); dy = 0; }
		if(this.y == WORLD_HEI-2){                                          // na povrchu
			if(dy > 0 && !this.vevytahu){ UtikaDoPovrchu(); dy = 0; }         // jde dolu  
			else if(dy < 0){ UtikaDoVzduchu(); dy = 0; }                      // jde nahoru
		}
		if(this.y + dy > CELLS_VERT + WORLD_HEI-1){ UtikaDoJadra(); dy=0; } // je na dne 
	}
	
	// osetreni pohybu pod povrchem //
	var podpovrchem = this.y > WORLD_HEI-1,  podpovrchem2 = this.y + dy > WORLD_HEI-1;
	// jde z podpovrchu do podpovrchu (krasna slova)
	if(podpovrchem && podpovrchem2){
		var puvy = this.y+dy-WORLD_HEI, puvx = this.x+dx;      // ulozi puvodne zamyslene souradnice - na prekresleni
		var oldcell = this.game.ground.map[this.y-WORLD_HEI][this.x];       // bunka, odkud jde
		var newcell = this.game.ground.map[puvy][puvx];                     // bunka, kam jde
		
		// zjistime, jestli ma vubec penize na tezbu, kdyz neni odkryta b. //
		if(newcell.odkryto < KOEF_ODKRYTO){
			// nakonec to neudelam, protoze pruzkum si dela sam (ukrajinci by utekli) a zadarmo
			//if(this.penize < MAX_MINUS){ dx = dy = 0; PosliZpravu("Nemáš peníze na tìžbu! Možná ti pùjèí banka."); }
			// v souladu s puvodni verzi pri pokusu odkryt bunku
			newcell.Odkryj();
		}
		
		// Sachta //
		if(newcell.IsSachta()){      // pokud jde do sachty
			if(dx || !this.vevytahu){         // pokud jde do strany (odkudkoliv) nebo neni ve vytahu
				if( !(vytah.x == this.x+dx && vytah.y == this.y+dy) ) // pokud tam, co jde, neni vytah
					{	UtikaDoSachty(); return; }
			}
		}
		// Skala  //
		else if(newcell.puda == g_skala){
			switch(this.ZkusTezitSkalu()){
				case 1:
					//this.VytezBunku(dy,dx);
					this.VytezBunku(newcell);
					this.RedrawCellRelative(dy,dx);
					PosliZpravu(cGame.str.sMiningSuccesful);
					break;
				case -1:
					PosliZpravu(cGame.str.sMiningUnsuccesful);
					dx = dy = 0;
					break;
				case 0:
					NejdeTezitSkalu();
					dx = dy = 0;
					break;
			}
		}
		
		// Zaval  //
		else if(newcell.puda == g_zaval){
			var iZaval;
			switch(this.ZkusTezitZaval()){
				case 1:
					this.VytezBunku(newcell);
					this.RedrawCellRelative(dy,dx);
					PosliZpravu(cGame.str.sMiningSuccesful);
					break;
				case -1:
					PosliZpravu(cGame.str.sMiningUnsuccesful);
					dx = dy = 0;
					break;
				case 0:
					if(oldcell.vyztuzeno && newcell.vyztuzeno);
					else{
						// rozlisime, odkad zaval jde - zezhora, z patra, ci ze zdola (?)
						iZaval = (dy < 0)? (dx?45:50) : (dy == 0 ? 30 : 5); // jo holt tezit nahoru je blbost, zejo
						if(oldcell.vyztuzeno) Math.ceil(iZaval /= 10);      // vyztuzit stolu se vyplati
						this.UberZdraviUprav(iZaval);                       // upravi hodnotu podle vybaveni - helma atd.
						oldcell.Zaval();
						this.RedrawCellRelative(0,0);
					}
					dx = dy = 0;
					break;
			}
		}
		
		// Zaplaveno nebo pramen //
		else if(newcell.IsVoda()){
			iUbrat = (dy < 0)? (dx?20:25) : ((dy == 0) ? 10 : 2); // jo holt tezit nahoru je blbost, zejo
			if(newcell.puda == g_pramen) iUbrat += 5;
			this.UberZdraviUprav(iUbrat, g_voda);
			oldcell.Zatop();
			// pokud pramen, zatopit i dalsi bunky okolo
			if(newcell.puda == g_pramen){
				dx = dy = 0;
				var nextcell;
				for(var vodady = 1; ; vodady++){
					nextcell = this.GetCellRelative(vodady,0);
					if(null == nextcell) break;
					if(nextcell.zatopeno) break;
					if(!nextcell.vytezeno) break;
					nextcell.Zatop();
					this.RedrawCellRelative(vodady,0);
				}
				// zalije bunky dole horizontalne
				vodady--;
				if( (null != (nextcell = this.GetCellRelative(vodady,-1))) && (!nextcell.zatopeno) && (nextcell.vytezeno)){
					nextcell.Zatop(); this.RedrawCellRelative(vodady,-1);
					if( (null != (nextcell = this.GetCellRelative(vodady,-2))) && (!nextcell.zatopeno) && (nextcell.vytezeno)){
						nextcell.Zatop(); this.RedrawCellRelative(vodady,-2); } }
				if( (null != (nextcell = this.GetCellRelative(vodady, 1))) && (!nextcell.zatopeno) && (nextcell.vytezeno)){
					nextcell.Zatop(); this.RedrawCellRelative(vodady, 1);
					if( (null != (nextcell = this.GetCellRelative(vodady, 2))) && (!nextcell.zatopeno) && (nextcell.vytezeno)){
						nextcell.Zatop(); this.RedrawCellRelative(vodady, 2); } }
			}
		}
		
		// jinak //
		else{
			//if(!newcell.vytezeno)                 // Pokud bunka neni vytezena, zkus vytezit 
				if(!this.VytezBunku(newcell)){      // Pokud nejde vytezit (napr. skala, pramen),
					dy = dx = 0;                      // panacek se nepresune
				}
		}
		
		// Prekresleni bunek (pouze pod povrchem!!!)
		this.game.ground.RedrawCell(puvy, puvx);                // newcell
		this.game.ground.RedrawCell(this.y-WORLD_HEI, this.x);  // oldcell
		this.SynchronizeInfo();
		
	} // podpovrchem && podpovrchem2
	
	
	// Pokud panacek vstupuje do dolu, obarvime pozadi dolu podle typu osvetleni. //
	// jde dolu //
	if(this.y < WORLD_HEI && this.y + dy >= WORLD_HEI)
		this.game.ground.SetBgColor(this.sGroundBgCol);
	// jde nahoru //
	else if(this.y >= WORLD_HEI && this.y + dy < WORLD_HEI)
		this.game.ground.SetBgColor(COLOR_GROUND_BGDARK);
	
	
	// Posunuti vytahu //
	if(dx==0 && dy!=0 && this.vevytahu){
		dy = vytah.Move(dy);       // vraci, o kolik se muze pohnout vytah. Pokud je v nem, dal ho to nepusti.
		vytah.Draw();
	}
	
	// Teprv ted se posune panacek. //
	this.x += dx;                     
	this.y += dy;
	this.Draw();
	
	// Po presunuti panacka poodkryje okoli
	if((dy || dx) && this.y >= WORLD_HEI){
		this.OdkryjOkoli();
		/*var xcell = GetCellPan(this,0,-1);
		if(xcell!=null)
			window.status = "0,-1: "+xcell.odkryto;	/**/
	}
	
	// osetreni nastupovani a vystupovani z vytahu - dodatecny zjisteni, jestli je in/out
	if(this.vevytahu && dx != 0)
		this.vevytahu = 0;
	
	if(!this.vevytahu)
		if(this.x == vytah.x && this.y == vytah.y){
			this.vevytahu = 1;
			if(this.y < WORLD_HEI-1){
				//PosliZpravu("Tento výtah je majetkem The Community Capital Bank, Inc.")
				PosliZpravuArg(cGame.str.sElevHire, VYTAH_CENA_NAJEM);
				this.UpravPenize(-VYTAH_CENA_NAJEM);
			}
		}
	
	this.Focus(dy,dx); // presune playground na panacka
}

// Najde bunku zadanou relativne od mista, kde panacek stoji //
cPanacek.prototype.GetCellRelative = function(dy,dx){
	if(dy == null) dy = 0;
	if(dx == null) dx = 0;
	return this.game.ground.GetCell(this.y-WORLD_HEI+dy, this.x+dx);
}

// Prekresli bunku zadanou relativne od mista, kde panacek stoji //
cPanacek.prototype.RedrawCellRelative = function(dy,dx){
	if(dy == null) dy = 0;
	if(dx == null) dx = 0;
	return this.game.ground.RedrawCell(this.y-WORLD_HEI+dy, this.x+dx);
}

// Odkryje bunky okolo panacka //
cPanacek.prototype.OdkryjOkoli = function(){
  // Nova matice se prepocita pres this.PrepocitejOdkryvKoef()
	var cell, o1,o2;
	for(var y=-2; y<=2; y++)
		for(var x=-2; x<=2; x++)
			if(null != (cell = this.GetCellRelative(y, x))){
				o1 = cell.odkryto;
				o2 = (cell.odkryto -= -(this.aOdkryvDistrib[y][this.dir>0?x:-x]));
				if( (o1 < KOEF_ODKRYTO && KOEF_ODKRYTO <= o2) || 
				    (o1 < KOEF_ODKRYTOPUL && KOEF_ODKRYTOPUL <= o2) )
					this.RedrawCellRelative(y, x);
			}
}

/****************************
*  Vytezeni zeminy z bunky. *
****************************/
cPanacek.prototype.VytezBunkuPudu = function(cell){
	var cenaTezby = 2;
	switch(cell.puda){
		case g_nic:    cenaTezby =  0; break;
		case g_pisek:  cenaTezby =  1; PosliZpravu(cGame.str.sMinedSandstone,"pisek"); break;
		case g_tuha:   cenaTezby =  4; PosliZpravu(cGame.str.sMinedThough,"tuha"); break;
		case g_zaval:  cenaTezby = 10; PosliZpravu(cGame.str.sCaveIn,"tuha"); break;  // nema cenu?
		case g_pramen: cenaTezby =  3; PosliZpravu(cGame.str.sSpring,"voda"); break; // nema cenu
		case g_skala:  cenaTezby =  1; PosliZpravu(cGame.str.sGranite,"voda"); break;  // nema cenu?
	}
	if(this.cizinci) cenaTezby = Math.ceil(cenaTezby * 0.5);
	this.penize -= cenaTezby;
	
	cell.VytezPudu();
}

/****************************
*  Vytezeni obsahu z bunky. *
****************************/
cPanacek.prototype.VytezBunkuObsah = function(cell){
	switch(cell.type){
		case g_pt: this.pt += cell.kolik; PosliZpravu(cGame.str.sFoundPt, "pt"); break;
		case g_au: this.au += cell.kolik; PosliZpravu(cGame.str.sFoundAu, "au"); break;
		case g_ag: this.ag += cell.kolik; PosliZpravu(cGame.str.sFoundAg, "ag"); break;
		case g_cu: this.cu += cell.kolik; PosliZpravu(cGame.str.sFoundCu, "cu"); break;
		case g_co: this.co += cell.kolik; PosliZpravu(cGame.str.sFoundCo, "co"); break;
		case g_lu: this.lu += cell.kolik; PosliZpravu(cGame.str.sFoundLu, "lu"); break;
		case g_dynamit: PosliZpravu(cGame.str.sFoundDynamite, "dynamit"); break;
	}
	cell.VytezObsah();
}

/****************************
*  Vytezeni bunky.          *
****************************/
cPanacek.prototype.VytezBunku = function(cell){
	if(this.penize < MAX_MINUS){
		if(this.cizinci){
			PosliZpravu("Neplatíš mzdy. Ukrajinci tì zbili a našli si jinou práci.");
			this.UberZdravi(15); this.cizinci = false; return false;
		}else{
			PosliZpravu("Došly finance. Není z èeho hradit tìžbu."); return false;
		}
	}
	
	this.VytezBunkuPudu(cell);
	this.VytezBunkuObsah(cell);
	return true;	
}


/****************************
*   Zdravi & so             *
****************************/
cPanacek.prototype.UberZdraviUprav = function(kolik, pricina){
	// v pricine jsou veci jako g_pramen, g_zaval, atd...
	var nomsg = 0; var str;
	if(pricina == g_voda || pricina == g_pramen){ nomsg=1; PosliZpravu("Grlgloglgl.","voda"); }
	if(pricina == g_methan){ nomsg=1; PosliZpravu("Bum!","methan"); }
	this.UberZdravi(kolik,nomsg);    /// zatim se s tim nechci stvat - casem
}
cPanacek.prototype.Smrt = function(){
	PosliZpravu(cGame.str.sYouAreDead, "smrt");
	this.Draw();
}

cPanacek.prototype.PridejZdravi = function(kolik){ this.zdravi = Math.min(this.zdravi + kolik, 100); }
cPanacek.prototype.UberZdravi = function(kolik,nomsg){
	this.stit -= kolik;
	if(this.stit < 0){ this.UberZdraviBezStitu(-this.stit, nomsg); this.stit = 0; }
	//if( (this.zdravi) < 0) this.zdravi = 0;
}
cPanacek.prototype.UberZdraviBezStitu = function(kolik,nomsg){
	if(this.stit > 0) return;
	// Aaau!
	if(nomsg == null || !nomsg){
		var sAu;
		if(kolik < 5) sAu = cGame.str.sOuch;
		else{
			//sAu = "A"; for(var x=kolik; x > 0; x -= 10) sAu += cGame.str.sAaaarghChar; sAu += "u!"
			sAu = ""; for(var x=kolik; x > 0; x -= 10) sAu += cGame.str.sAaaarghChar;
			sAu = cGame.str.sAaaargh.replace("%1", sAu);
		};
		PosliZpravu(sAu, "zdravi");
	}
	if( (this.zdravi -= kolik) < 0) this.zdravi = 0;
	if(this.zdravi == 0) this.Smrt();
}

cPanacek.prototype.PridejStit = function(kolik){ this.stit = Math.min(this.stit + kolik, 100); }
cPanacek.prototype.UberStit   = function(kolik){ this.stit = Math.max(this.stit - kolik, 0); }



/****************************
*   TryEnter                *
****************************/
cPanacek.prototype.TryEnter = function(){
	if(this.y > WORLD_HEI-1) return;
	switch(this.game.world.map[this.y][this.x].type){
		case g_kaktus: PosliZpravu(cGame.str.sOuch,"zdravi");     this.UberZdravi(1,1);
		case g_zed:    PosliZpravuArg(cGame.str.sAaaargh, "", "zdravi");     this.UberZdravi(1,1);   break;
		case g_zachod:
			var ted = new Date();
			if(ted.getTime() - this.casNaZachode.getTime() <  5*1000){ PosliZpravu(cGame.str.sIWasMinuteAgo); return; }
			if(ted.getTime() - this.casNaZachode.getTime() < 30*1000){ PosliZpravu(cGame.str.sIDontWantNow);  return; }
			this.casNaZachode = ted;
			
			document.all.miner.style.visibility = "hidden";
			if(isMSIE6()) document.body.style.cursor = "wait";
			window.setTimeout("game.panacek.VratSeZeZachodu();",3000);
		break;
		case g_hradlo:
			PosliZpravu(RandomKec(aKecyHradlo),"kec"); break;
						
		case g_dvere:  this.Enter(this.game.world.map[this.y][this.x].dvereid); break;
		
		default: PosliZpravu(cGame.str.sNowhereToEnter); break;
	}
	this.SynchronizeInfo();
}

// Vrat se - k zachodu //
cPanacek.prototype.VratSeZeZachodu = function(){
	PosliZpravu(cGame.str.sToiletRelief, "uzdraveni");
	this.PridejZdravi(1);
	this.VratSe();
	this.SynchronizeInfo();
}
cPanacek.prototype.VratSe = function(){
	this.div.style.visibility = ""
	if(isMSIE6()) document.body.style.cursor = "";
}

/****************************
*   Enter, Exit, etc.       *
****************************/
cPanacek.prototype.Enter = function(dvereid){
	switch(dvereid){
		case d_banka:     PosliZpravu(cGame.str.sEnteringBank);     break;
		case d_nemocnice: PosliZpravu(cGame.str.sEnteringHospital); break;
		case d_tools:     PosliZpravu(cGame.str.sEnteringShop);     break;
		case d_bordel:
			if(0){ PosliZpravu(cGame.str.sEnteringSaloon); } ////
			else { PosliZpravu(cGame.str.sEnteringClosed); return; }
			break;
		case d_info:      PosliZpravu(cGame.str.sEnteringInfo);     break;
		default: return;
	}
	var addr = aBudovyURLs[dvereid];
	/// Zarovnat nove okno na stred //
	//var iWinHei = bMSIE ? document.body.clientHeight : window.innerHeight;
	//var iWinWid = bMSIE ? document.body.clientWidth  : window.innerWidth;
	//DumpObjectEx(document,"cli");
	//DumpObjectEx(document,"top");
	//DumpObjectEx(document.body,"cli");
	//DumpObjectEx(document.body,"top");
	var win = window.open(addr,"budova","scrollbars=0,directories=0,height=550,width=750,left=0,top=0,location=0,menubar=0,status=0,toolbar=0");
	win.focus();
}
cPanacek.prototype.Exit = function(){}


/****************************
*   Inventar                *
****************************/

// BuyItem() //
cPanacek.prototype.BuyItem = function(sItemKey, iCena){
	if(this.inv.Pridej(sItemKey)){
		this.UpravPenize(-iCena);
		this.PrepoctiOdkryvKoef();
	}
}

cPanacek.prototype.PouzijPredmetAZkontroluj = function(p){
	this.pripraveno = null;                      // Použijeme to, takže to "odpripravime"
	if(!p.Pouzij()){                             // Pokud nezbývá žádné použití,
		PosliZpravu(p.typ.sUsedUp);                    //   pošleme zprávu o opotøebení,
		this.inv.Odeber(p);                        //   odebereme z inventáøe
		this.SynchronizeInfo();		                 //   a aktualizujeme info.
	}
}


// ZkusTezitSkalu - vraci 1 pri uspechu, -1 pri neuspechu, 0 kdyz neni mozno tezit //
cPanacek.prototype.ZkusTezitSkalu = function(cell){
	var p, koef = 0, iCenaTezby = 20;            // koeficient sance na odrubani skaly
	
	if(!(p = this.pripraveno)) return 0;
	if(p.typ.iId != g_krumpac && p.typ.iId != g_vrtak && p.typ.iId != g_sbijecka) return 0;
	PosliZpravuArg(cGame.str.sYouHaveUsed, p.typ.s2p);
	this.PouzijPredmetAZkontroluj(p);            // zkontroluje opotrebovanost a kdyztak vyhodi 
	
	
	// podle nastroje urci base sanci //
	/*if(this.inv.pocty['sbijecka'] > 0)     koef = 1.0;
	else if(this.inv.pocty['vrtak'] > 0)   koef = 0.7;
	else if(this.inv.pocty['krumpac'] > 0) koef = 0.2;
	else                                   koef = 0.0;*/
	switch(p.typ.iId){
		case g_sbijecka:  koef = 1.0; break;
		case g_vrtak:     koef = 0.5; break;
		case g_krumpac:   koef = 0.2; break;
	}
	
	// za tmy nema moc sanci //
	if(!(this.inv.pocty['lampa'] > 0 || this.inv.pocty['halogen'] > 0 || this.inv.pocty['louc'] > 0))
		koef *= 0.1;
	// jeste stesticko... //
	if(this.inv.pocty['stesti'] > 0) koef *= 2;

	// Cena tezby //
	iCenaTezby = Math.round(iCenaTezby / koef);
	// Nedam kontrolovat zde... kontroluje se to v cPanacek::Move(), jestli to neni pod MAX_MINUS //
	/*if(iCenaTezby > this.penize)
		{ PosliZpravu("Nedostatek penìz na tìžbu!"); return 0; }
	else */
		this.UpravPenize(-iCenaTezby);
	
	// jeste do toho zamichame zdravotni stav... //
	koef *= this.zdravi / 100;
	
  //  pokud uspech, vraci kladne, jinak zaporne //
	return Math.random() < koef ? 1 : -1;
}


// ZkusTezitZaval - vraci 1 pri uspechu, -1 pri neuspechu, 0 kdyz neni mozno tezit //
cPanacek.prototype.ZkusTezitZaval = function(cell){
	var p, koef = 0, iCenaTezby = 10;            // koeficient sance na odlifrování závalu 
	
	if(!(p = this.pripraveno)) return 0;
	if(p.typ.iId != g_lopata) return 0;
	this.pripraveno = null;                      // pouzijeme to, takze to "odpripravime"
	PosliZpravuArg(cGame.str.sYouHaveUsed, p.typ.s2p);
	this.PouzijPredmetAZkontroluj(p);            // zkontroluje opotrebovanost a kdyztak vyhodi 
	
	
	switch(p.typ.iId){
		case g_lopata:  koef = 0.9; break;
	}
	
	// za tmy nema moc sanci //
	if(!(this.inv.pocty['lampa'] > 0 || this.inv.pocty['halogen'] > 0 || this.inv.pocty['louc'] > 0))
		koef *= 0.1;
	// jeste stesticko... //
	if(this.inv.pocty['stesti'] > 0) koef *= 2;

	// Cena tezby //
	iCenaTezby = Math.round(iCenaTezby / koef);
	// Nedam kontrolovat zde... kontroluje se to v cPanacek::Move(), jestli to neni pod MAX_MINUS //
	/*if(iCenaTezby > this.penize)
		{ PosliZpravu("Nedostatek penìz na tìžbu!"); return 0; }
	else */
		this.UpravPenize(-iCenaTezby);
	
	// jeste do toho zamichame zdravotni stav... //
	koef *= this.zdravi / 100;
	
  //  pokud uspech, vraci kladne, jinak zaporne //
	return Math.random() < koef ? 1 : -1;
}



/****************************
*   Penize & so             *
****************************/
cPanacek.prototype.UpravPenize = function(kolik){
	this.penize -= -kolik;     // Trik na prevedeni stringu na cislo.
	this.SynchronizeInfo();
}

/****************************
*   Synchronizace s info    *
****************************/
cPanacek.prototype.SynchronizeInfo = function(){
	document.all.penize.innerHTML = Round2(this.penize);
	document.all.zdravi.innerHTML = Round2(this.zdravi);
	document.all.infopt.innerHTML = this.pt;
	document.all.infoau.innerHTML = this.au;
	document.all.infoag.innerHTML = this.ag;
	document.all.infocu.innerHTML = this.cu;
	document.all.infoco.innerHTML = this.co;

	// inventar //
	var invtable = document.all.invtable, item_div;
	//<tr class="inv"><td><span id="inv_XXX"></span></td></tr>
	for(i = 0; i < cPredmet.aItems.length; i++){
		if(!(item_div = document.all["inv_"+cPredmet.aItems[i].sKey]));
		if(this.inv.pocty[cPredmet.aItems[i].sKey] > 0)
			item_div.className = "";
		else
			item_div.className = "hidden";
	}
	
	// BgColor podzemi //
	                                  this.sGroundBgCol = COLOR_GROUND_BGDARK;
	if(this.inv.pocty["louc"] > 0)    this.sGroundBgCol = COLOR_GROUND_BGLIGHT1;
	if(this.inv.pocty["lampa"] > 0)   this.sGroundBgCol = COLOR_GROUND_BGLIGHT2;
	if(this.inv.pocty["halogen"] > 0) this.sGroundBgCol = COLOR_GROUND_BGLIGHT3;
	// Pokud je panacek v podzemi, rozsvitime podzemi podle typu osvetleni. //
	if(this.y > WORLD_HEI-1)
		this.game.ground.SetBgColor(this.sGroundBgCol);
}



/****************************
*    Vytah                  *
****************************/
function cVytah(div, x){
	this.y = WORLD_HEI-2;
	this.x = x;
	this.div = div;
	this.div.style.left = this.x * CELL_WID;
	this.delkaLana   = VYTAH_LANO_DELKA_VYCHOZI;
	this.delkaSachty = VYTAH_SACHTA_DELKA_VYCHOZI;
}
cVytah.prototype.ProdluzLano   = function(iBunekY){ this.delkaLana   += iBunekY; }
cVytah.prototype.ProdluzSachtu = function(iBunekY){ this.delkaSachty += iBunekY; }

// vykresli div panacka
cVytah.prototype.Draw = function(){
	if(!this.div.style.display || this.div.style.display == 'none') this.div.style.display = 'block';
	//this.div.style.left = this.x * CELL_WID;
  this.div.style.top  = this.y * CELL_HEI - 6;
	//this.div.all.vytahimg.src = ;
}

// presune div vytah
cVytah.prototype.Move = function(dy){
	// osetreni uniku svisle
	if(this.y == document.all.gametable.tBodies[0].rows.length - 2){ // na povrchu
		if(dy < 0){ UjizdiDoVzduchu(); dy = 0; }
	}
	if(this.y + dy > this.delkaLana){ UjizdiDoHloubky(); dy = this.delkaLana - this.y; } // jel by moc hluboko

	this.y += dy;
	return dy;
}



/****************************
*   Zpravy API              *
****************************/
// kdyz nekam utika, pada, proste dela blbosti
function UtikaDoStrany(){ PosliZpravu(cGame.str.sEscapingToSide); }
function UtikaDoVzduchu(){ PosliZpravu(cGame.str.sEscapingToSky); }
function UtikaDoSachty(){ PosliZpravu(cGame.str.sEscapingToShaft); }
function UtikaDoZeme(){ PosliZpravu(cGame.str.sEscapingToGround); }
function UtikaDoPovrchu(){ PosliZpravu(cGame.str.sEscapingToLand); }
function UtikaDoJadra(){ PosliZpravu(cGame.str.sEscapingToHell); }
function UjizdiDoVzduchu(){ PosliZpravu(cGame.str.sEscapingToSkyElev); }
function UjizdiDoHloubky(){ PosliZpravu(cGame.str.sElevEndOfRope); }
// kdyz neco nejde...
function NejdeTezitSkalu(){ PosliZpravu(cGame.str.sCantMineGranite); }
