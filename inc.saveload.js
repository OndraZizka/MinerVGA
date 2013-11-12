/*
function parseCookie()
function CreateSaveString()
function SaveCookie(sCookie)
function SaveNextPart()
function cSaveStuff()
function LoadCookie()
function ParseLoadString(str)
*/

function parseCookie() {
	var cookieList = document.cookie.split("; ");
	var cookieArray = new Array();
	var name;
	for (var i = 0; i < cookieList.length; i++) {
		name = cookieList[i].split("=");
		cookieArray[unescape(name[0])] = unescape(name[1]);
	}
	return cookieArray;
}

/*******************************************
*   Trida drzici ve window veci k sejvum   *
*******************************************/
function cSaveStuff(){
	this.i = 0;
	this.sCookie = "somecookie";
	this.pokolika = 4000;
	this.okno = null;
}
var savestuff = new cSaveStuff();



/**************************************************
*   cGame::CreateSaveString() - pripravi string   *
***************************************************/
cGame.prototype.CreateSaveString = function(){
	var aGround = this.ground.map;
	var panacek = this.panacek;
	var vytah   = this.vytah;
	
	var sMiner = 
		panacek.penize +"/"+
		panacek.zdravi +"/"+
		panacek.debt   +"/"+
		panacek.x +"/"+
		panacek.y +"/"+
		panacek.dir +"/"+
		panacek.vevytahu +"/"+
		panacek.iPohyby +"/"+
		panacek.pt +"/"+
		panacek.au +"/"+
		panacek.ag +"/"+
		panacek.cu +"/"+
		panacek.co +"/"+
		panacek.lu +"/"+
		panacek.cizinci;
	// alert(sMiner); // ok
	
	var sVytah = 
		vytah.x +"/"+
		vytah.y +"/"+
		vytah.delkaLana;
				

	var sInventar = "";
	for(var i in panacek.inventar_pocty){
		//alert(show(panacek.inventar_pocty[i]));
		sInventar += escape(    i+"/"+
		panacek.inv.pocty[i].pocet+"/"+
		panacek.inv.pocty[i].vznik+"/"+
		panacek.inv.pocty[i].zbyva      ) + "*";
	}
	//alert(sInventar);
	

	var sRadky = "", sBunky, ss;
	var cell;
	// pro kazdou radku
	for(i = 0; i < aGround.length; i++){
		sBunky = "";
		// pro kazdou bunku
		for(j = 0; j < aGround[i].length; j++){
			cell = aGround[i][j];
			var flags = (cell.vytezeno?1:0) + (cell.zatopeno?2:0) + (cell.vyztuzeno?4:0) + ((cell.odkryto >= KOEF_ODKRYTO)?8:0);
			ss = (cell.type);
			if(cell.type) ss += "/"+(cell.kolik);
			ss += "/"+(cell.puda);
			//+"/"+(cell.kryti) // ground tam neni treba - staci nahodne
			ss += "/"+(flags);
			if(cell.odkryto < KOEF_ODKRYTO) ss += "/"+Round2(cell.odkryto);
			sBunky += ss + "*";
		}
		sRadky += sBunky + "@"; // ~ rozdeluje radky
	}
	//alert(sBunky); // ok	
	
	var sCookie = escape(sMiner) +"&"+ escape(sVytah) +"&"+ escape(sInventar) +"&"+ escape(sRadky);
	//alert(escape("!@#$%^&*()_+  []{};'\<>,./?|\`~®x"));
	return sCookie;
}
	
/**************************************************
*   cGame::SaveCookie() - ulozi string do cookies *
**************************************************/
cGame.SaveCookie = function(sCookie){
	//alert(sCookie.length);
	
	// Jednoducha cesta - funguje jen do 4096 byte, coz je malo :(
	//document.cookie = sCookie;
	//alert("Ulozeno: " + document.cookie);
	
	var saveurl = "save/preparing.html";
	var okno = window.open(saveurl,"saveload","border=thin,scrollbars=0,directories=0,height=30,width=360,left=0,top=0,location=0,menubar=0,status=0,toolbar=0");
	if(okno == null) return alert("Chyba! Nepoda¯ilo se otev¯Ìt okno na ukl·d·nÌ.\nZkontrolujte, jestli nenÌ spuötÏn\nprogram na blokov·nÌ (nap¯. Pop-up Stopper).");
	var pokolika = 4000;
	
	// Opet jednoducha cesta, kdy se to tam naseka behem ctvrtsekundy, coz nema zadnou poezii. :)
	/*for(i = Math.ceil(sCookie.length / pokolika); i>0; i--){
		okno.location.href = "save/"+i+"/saving.html";
		okno.document.cookie = sCookie.substring(i*pokolika, pokolika);
		okno.alert("Ukl·d·m Ë·st "+(i*pokolika)+" - "+(i*pokolika + pokolika)+".");
	}
	okno.close();	 /**/
	
	// Cistka ve slotech - pouzil jsem zbytek shora 
	for(i = 0; i < MAX_SAVESLOTS; i++){
		okno.location.href = "save/"+i+"/saving.html";
		okno.document.cookie = "";
		//falert("Mazu Ë·st "+i+" - cookie: ["+okno.document.cookie.length+"]\n"+okno.document.cookie);
	} 
	
	
	// Takze je lepsi to udelat pres timer...
	falert("Math.ceil("+sCookie.length+" / "+pokolika+") == "+Math.ceil(sCookie.length / pokolika));
	window.savestuff.i = Math.ceil(sCookie.length / pokolika) - 1; // -1, protoze se uklada i do nuly
	window.savestuff.sCookie = sCookie;
	window.savestuff.okno = okno;
	window.savestuff.pokolika = pokolika;
	window.setTimeout("cGame.SaveNextPart();",500);
	
	return (true);
}


/*******************************************
*   Zajistuje prodlevy pri ukladani        *
*******************************************/
cGame.SaveNextPart = function(){
	// natahnuti promennych - musi byt pres window, je to volano z Timeru
	var okno    = window.savestuff.okno;
	var i       = window.savestuff.i;
	var sCookie = window.savestuff.sCookie;
	var pokolika= window.savestuff.pokolika;
																				 
	// kontrola, jestli to je out of bounds -> konec
	if(i == -1 || i > Math.ceil(sCookie.length / pokolika) ){
		window.savestuff.i = -2;
		okno.location.href = "save/saved.html";
		return setTimeout("cGame.SaveNextPart();",1000);
	}else if(i < -1) return okno.close();
	
	//falert("3: i="+i+" - neni out of bounds.");
	// kontrola natazeni okna 
	var oh = "save/"+i+"/saving.html";
	var olh = okno.location.href;
	falert("oh:	"+oh+"\nolh:	" + olh.substring(olh.length - oh.length));
	if(olh.substring(olh.length - oh.length) != oh){
		okno.location.href = oh; return setTimeout("cGame.SaveNextPart();",200); }
	
	//falert("4: okno.document.readyState == "+okno.document.readyState);
	if(okno.document.readyState != "complete"){ return setTimeout("cGame.SaveNextPart();",200); }
	
	falert("5: okno je nactene, takze zapisem.");
	// nalezeni spravne casti a jeji ulozeni 
	okno.document.all.slot.innerHTML = i;
	//okno.alert("Ukl·d·m Ë·st "+(i*pokolika)+" - "+(i*pokolika + pokolika)+".");
	var substr = sCookie.substr(i*pokolika, pokolika);
	okno.document.cookie = substr;
	//alert("6: okno.document.cookie == substr: "+(okno.document.cookie == substr)+"\n"+substr);
	//if(okno.document.cookie != substr)
		//return alert("Chyba p¯i ukl·d·nÌ hry do cookie Ë. "+i+".\nZkontrolujte, zda jsou cookies povoleny.\nHra nebyla uloûena.");
	window.savestuff.i--; return setTimeout("cGame.SaveNextPart();",1000);
}





/*******************************************
*   LoadCookie()                           *
*******************************************/
cGame.LoadCookie = function(){
	var saveurl = "save/preload.html";
	var okno = window.open(saveurl,"saveload","border=thin,scrollbars=0,directories=0,height=30,width=360,left=0,top=0,location=0,menubar=0,status=0,toolbar=0");
	if(okno == null) return alert("Chyba! Nepoda¯ilo se otev¯Ìt okno na ukl·d·nÌ.\nZkontrolujte, jestli nenÌ spuötÏn\nprogram na blokov·nÌ (nap¯. Pop-up Stopper).");
	var pokolika = 4000;
	var sCookie = "";
	
	// Opet jednoducha cesta, kdy se to tam naseka behem ctvrtsekundy, coz nema zadnou poezii. :)
	/*for(i = Math.ceil(sCookie.length / pokolika); i>0; i--){
		okno.location.href = "save/"+i+"/loading.html";
		sCookie += okno.document.cookie;
		okno.alert("Nahr·v·m Ë·st Ë·st "+(i*pokolika)+" - "+(i*pokolika + pokolika)+".");
	} 
	okno.close();	 /**/
	
	// Takze je lepsi to udelat pres timer...
	window.savestuff.i = 0;
	window.savestuff.sCookie = "";
	window.savestuff.okno = okno;
	window.savestuff.pokolika = 0;
	setTimeout("game.LoadNextPart();",500);
	
	return (true);
}

/*******************************************
*   Zajistuje prodlevy pri nahravani       *
*******************************************/
cGame.prototype.LoadNextPart = function(){
	var aGround = this.ground.map;
	var panacek = this.panacek;
	var vytah   = this.vytah;
	// natahnuti promennych - musi byt pres window, je to volano z Timeru
	var okno    = window.savestuff.okno;
	var i       = window.savestuff.i;
	var pokolika= window.savestuff.pokolika;
	var sTmp = "";
																				 
	//falert("2: i="+i);
	// kontrola, jestli to je out of bounds -> konec
	if(i == -1 || i > 10 ){
		window.savestuff.i = -2;
		// Konec, nacteno, zavolej ParseLoadString(sCookie);
		okno.location.href = "save/loaded.html";
		falert("Loadstring: [delka "+window.savestuff.sCookie.length+" znaku]\n"+window.savestuff.sCookie);
		this.ParseLoadString(window.savestuff.sCookie);
		panacek.SynchronizeInfo();
		panacek.Draw();
		vytah.Draw();
		return setTimeout("game.LoadNextPart();",1000);
	}else if(i < -1){
		// Uplnej konec, obnoveno, zavri nahravaci okno; 
		PosliZpravu("Hra byla naËtena.","loadmsg");
		return okno.close();
	}
	
	//falert("3: i="+i+"   > neni out of bounds.");
	// kontrola natazeni okna 
	var oh = "save/"+i+"/loading.html";
	var olh = okno.location.href;
	//falert("oh:	"+oh+"\nolh:	" + olh.substring(olh.length - oh.length));
	if(olh.substring(olh.length - oh.length) != oh){
		okno.location.href = oh; return setTimeout("game.LoadNextPart();",200); }
	
	//falert("4: okno.document.readyState == "+okno.document.readyState);
	if(okno.document.readyState != "complete"){ return setTimeout("game.LoadNextPart();",200); }
	

	// nahrani aktualni casti
	okno.document.all.slot.innerHTML = i;
	falert("5: i="+i+"; Natahuju Ë·st "+(i*pokolika)+" - "+(i*pokolika + pokolika)
		+"; cookie: ["+okno.document.cookie.length+"] "+okno.document.cookie);

	// odstraneni stredniku, co se tam naserou
	sTmp = okno.document.cookie;
	if(sTmp.substring(sTmp.length-2) == "; ")
		sTmp = sTmp.substr(0,sTmp.length-2);
		
	//falert("6: i="+i+"; cookie: ["+sTmp.length+"] "+sTmp);
	
	window.savestuff.sCookie += sTmp;
	
	// kontrola delky; pokud se zmensuje nebo == "", konec;
	if(sTmp.length < window.savestuff.pokolika ||/**/ sTmp == ""){
		window.savestuff.i = -1; return setTimeout("game.LoadNextPart();",50); }

	window.savestuff.pokolika = sTmp.length;
	window.savestuff.i++;
	setTimeout("game.LoadNextPart();", 100);
}

/*******************************************
*   ParseLoadString()                      *
*******************************************/
cGame.prototype.ParseLoadString = function(str){
	var aGround = this.ground.map;
	var panacek = this.panacek;
	var vytah   = this.vytah;

	var aVars = str.split("&");
	falert("Zacatek ParseLoadString(); aVars:\n"+show(aVars));
	aVars[0] = unescape(aVars[0]);
	aVars[1] = unescape(aVars[1]);
	aVars[2] = unescape(aVars[2]);
	falert("escaped aVars:\n"+show(aVars));
	var a, aa; var pitem; var i;
	
	// Panacek
	a = aVars[0].split("/"); i = 0;
	panacek.penize = parseInt(a[i++]);
	panacek.zdravi = parseInt(a[i++]);
	panacek.debt   = parseInt(a[i++]);
	panacek.x = parseInt(a[i++]);
	panacek.y = parseInt(a[i++]);
	panacek.dir = parseInt(a[i++]);
	panacek.vevytahu = parseInt(a[i++]);
	panacek.iPohyby = parseInt(a[i++]);
	panacek.pt = parseInt(a[i++]);
	panacek.au = parseInt(a[i++]);
	panacek.ag = parseInt(a[i++]);
	panacek.cu = parseInt(a[i++]);
	panacek.co = parseInt(a[i++]);
	panacek.lu = parseInt(a[i++]);
	panacek.cizinci = a[i++] == "true"? true : false;
	
	// Vytah //
	a = aVars[1].split("/"); i = 0;
	vytah.x = parseInt(a[i++]);
	vytah.y = parseInt(a[i++]);
	vytah.delkaLana = parseInt(a[i++]);	
	
	// Items //
	var aaII = aVars[2].split("*");
	//alert(show(aaII));
	var aII;
	for(i=0;i<aaII.length-1;i++){ // minus jedna, protoze tam pridavam jeden strednik navic
		aII = unescape(aaII[i]).split("/");
		pitem = panacek.inventar_pocty[aII[0]];
		pitem.pocet = aII[1];
		pitem.vznik = aII[2];
		pitem.zbyva = aII[3];
		//alert(show(pitem));
	}
	
	/// A ted to nejhorsi - bunky
	var cell, v, aRadky, aBunky;
	aRadky = aVars[3].split("@");
	//alert(aRadky);
	// pro kazdou radku
	for(i=0;i<aRadky.length-1;i++){
		aBunky = aRadky[i].split("*");
		// pro kazdou bunku 
		for(j=0;j<aBunky.length-1;j++){
			a = aBunky[j].split("/");
			v = 0;
			cell = aGround[i][j];
			cell.type   = parseInt(a[v++]);
			if(cell.type) cell.kolik  = parseInt(a[v++]);
			cell.puda   = parseInt(a[v++]);
			//cell.kryti = parseInt(a[v++]);
			var flags = a[v++];
			cell.vytezeno  = flags & 1 ? true : false;
			cell.zatopeno  = flags & 2 ? true : false;
			cell.vyztuzeno = flags & 4 ? true : false;
			cell.odkryto   = flags & 8 ? KOEF_ODKRYTO : parseFloat(a[v++]);
			//if(i==0 && j > 20) alert("cell: [y="+i+", x="+j+"]\n"+show(cell));
			this.ground.RedrawCell(i,j);
		}
	}
	
	return true;
}
