/**************************************
*  Funkce                             *
**************************************/



/*********************************************
*  OnKeyPressed - zpracovava stisky klavesnice *
*********************************************/
function OnKeyPressed(e){
	var code; var sTmp;
	if(bMSIE){ e = window.event; }
	//DumpObjectEx(e);
	
	if(e.ctrlKey || e.altKey) return true;
	if(document.readyState != "complete"){ window.status = (cGame.str.sPatienceBringsRoses); return; }
	
	// Potvrzeni zmacknuti F5 - pouze v Mozille //
	if(e.keyCode == 116)
		return window.confirm(cGame.str.sReallyRestart);
		
	// F1 v Mozille; v MSIE je to pres window.onhelp //
	if(!bMSIE && e.keyCode == 112)
		{ game.panacek.Enter(d_info); return false; }
	
	// Mozilla do keyCode dava systemove klavesy (sipky, Fx, Esc, Tab, Enter atd.) a do which znaky (pismena, mezeru, cislice...) //
	if(bMSIE){
		code = e.keyCode;
	}else{
		switch(e.keyCode){
			case 37:   code = 52; break; // <-
			case 39:   code = 54; break; // ->
			case 38:   code = 56; break; // ^ 
			case 40:   code = 50; break; // v 
			default: code = e.charCode; break;
		}		
	}
	
	// Cheaty //  String.fromCharCode(), String.charCodeAt()
	game.CheatCheck(code);
		
	// Load jde i po smrti //
	if(code != 76 && game.panacek.zdravi <= 0){ PosliZpravu(cGame.str.sYouAreDeadPressReload, "posmrti"); return; }
	//window.status = code;///
	switch(code){
		case  52: case 54: game.panacek.Move(code==52?-1:+1, 0);  break;	// <- ->
		case  50: case 56: game.panacek.Move(0, code==50?+1:-1);  break;  // ^ v
		case 116: case 48: game.panacek.Turn(); break;                    // T
		case  13: case 53: case 101: game.panacek.TryEnter(); break;			// 5 E Enter
		case 120:          game.panacek.Exit(); break;                    // X
		
		case 104:          game.panacek.HalogenOnOff();    break;          // H - halogen
		case 108:          game.panacek.PripravLopatu();   break;          // L - lopata
		case 107:          game.panacek.PripravKrumpac();  break;          // K - krumpac
		case 118:          game.panacek.PripravVrtak();    break;          // V - vrtak
		case 115:          game.panacek.PripravSbijecku(); break;          // S - sbijecka
		case 100:          game.panacek.OdpalDynamit();    break;          // D - dynamit
		case 103:          game.panacek.PripravKbelik();   break;          // G - kbelik
		case 112:          game.panacek.PripravPumpu();    break;          // P - pumpa
		
		case  96: case 59: document.all.gametable.border = document.all.gametable.border=="1" ? 0 : 1; break; // ` ;
		case  27: OnResized(); break;
		case  83:{                                                        // Shift + S 
			// Pod povrchem se sejvovat nesmí... 
			if(game.panacek.y >= WORLD_HEI-1 || game.panacek.vevytahu)
				return PosliZpravu(cGame.str.sSavingOnlyOnTop, "savemsg");
			sTmp = game.CreateSaveString(); cGame.SaveCookie(sTmp); } break;
		case  76:{ cGame.LoadCookie(); } break;         // Shift + L; ParseLoadString se kvuli timeru vola sam pozdeji 
	}
	game.panacek.Draw();
	
	return false;
}



/**************************************
*  OnResized                          *
**************************************/
function OnResized(){
	// uprava hraci plochy 
	with(document.all.playground.style){
		// maximalne potrebna sirka nebo tak, aby zbylo na infotable 
		width = (Math.min(CELLS_HORIZ * CELL_WID, document.body.clientWidth - minInfoTableWid - 15))+"px";
		height = (document.body.clientHeight)+"px";
	}
	// uprava infotable 
	with(document.all.infotable.style){
		//left = CELLS_HORIZ * CELL_WID;
		// Bacha - left patri k infotable!
		left = parseInt(document.all.playground.style.width);
		width = (Math.min(maxInfoTableWid, Math.max(minInfoTableWid, document.body.clientWidth - parseInt(left) )))+"px";
		zIndex = 15;
	}
	
	// uprava vysky zprav 
	var point = GetXY(document.all.msg);
	//alert(document.body.clientHeight+" - "+point.y + " - 15;");
	document.all.msg.style.height = (document.body.clientHeight - point.y - 15)+"px";
}

/******************************************
*  Animace mraku a vubec sveta nahore     *
******************************************/
function OnAnimateMrak(){
	var sL, iL, iDelayMS = ANIM_MRAK1_STEPDELAY_MS;
	sL = document.all.mrak1.style.left;
	if(sL == ""){
		document.all.mrak1.style.width = document.all.mrak1.clientWidth+"px";
		iL = document.all.mrak1.offsetLeft;
	}
	else iL = parseInt(sL) +1;

	if(iL > document.all.playground.clientWidth){
		iL = -document.all.mrak1.clientWidth;
		iDelayMS = ANIM_MRAK1_ROUNDDELAY_MS;
	}
	document.all.mrak1.style.left = iL+"px";
	setTimeout("OnAnimateMrak();", iDelayMS);
}

/******************************************
*  Zkontroluje, jestli neco v inventari   *
*  neni zastarale, a pripadne to vyhodi   *
******************************************/
function OnCheckInventory(){
	if(game.panacek.inv.CheckObsoletness()){
		game.panacek.PrepoctiOdkryvKoef();
		game.panacek.SynchronizeInfo();
	}
	setTimeout("OnCheckInventory()", CAS_INVENTORY_CHECK_DELAY_MS);
}


/****************************
*   Zpravy API              *
****************************/
function PosliZpravuDoOkna(win, str, clss){
	/* ...poslat neco do tabulky vpravo...*/
	if(clss == null) clss = "normal";
	var msg = win.document.all.msg;
	msg.innerHTML += '<div class="'+clss+'">'+str+'</div>';

	var childs = bMSIE ? msg.children : msg.childNodes;
	if(childs.length > MAX_MESSAGES)
		for(var i = MAX_MESSAGES/2; i >= 0; i--)
			bMSIE ? (msg.children[i].outerHTML = "") : msg.removeChild(msg.firstChild);
	if(msg.scrollHeight > msg.clientHeight)
		msg.scrollTop = msg.scrollHeight - msg.clientHeight;
}
 
function PosliHelp(){}


// Nacte obrazky do cache //
function NatahniObrazky(){
	var aImages = new Array();
	for(var i = 1; i < aTypImages.length; i++){
	//for(var i in aTypImages){
		if(typeof(aTypImages[i]) == "string" && aTypImages[i].length != 0)
			(aImages[i-1] = new Image()).src = sImgDir + aTypImages[i];
	}
	(aImages[++i-1] = new Image()).src = sImgDir + "minerr";
	(aImages[++i-1] = new Image()).src = sImgDir + "minerl";
	
}

// Zaokrouhli na dve desetinna mista
function Round2(dX){ return Math.round(dX*100)/100.0; }

function Cancel(){ return false; }
// Zamezi vyberu, pravymu tlacitku, presunovani  a nastavi kurzor na sipku //
function FreezeDocument(win){
	if(bMSIE){
		win.document.body.onselectstart = Cancel;
		win.document.body.ondragstart   = Cancel;
		win.document.body.oncontextmenu = Cancel;
		if(isMSIE6())
			win.document.body.style.cursor = "default";
	}else{
		win.oncontextmenu = Cancel;
	}
	
}

function isMSIE6(){
	return isMSIE() && (parseInt(navigator.appVersion.substring(navigator.appVersion.indexOf("MSIE")+4)) >= 6);	
}

// show //
function show(obj, obj_name){
	var result = "";
	for(var i in obj)
		result += i + " = " + obj[i] + "\n";
  return result;
}

function falert(x){}/*/
function falert(x){alert(x);}/**/