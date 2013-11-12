function isMSIE(){
	//alert(navigator.appName +" - "+ navigator.appVersion);
	if(navigator.appVersion.indexOf("MSIE") > 0)
		if(parseInt(navigator.appVersion.substring()) >= 4) return true;	
	return false;
}
var bMSIE = isMSIE();
function WindowEventsTarget(win){
	if(!win) win = window;
	return bMSIE ? win.document.body : win
}

function getDiv(div_id){
	return isMSIE() ? document.all[div_id] : document.getElementById(div_id);
}

function setVisible(obj, stav){
	//var s = "v setVisible(); obj: " + obj; if(obj != null)  s += " id: " + obj.id; alert(s);
	if(obj != null && obj != undefined && obj.className != null)
		obj.className = stav?'':'hidden';
}


// String functions //
function nl2br(s){ return s.replace("\r","").replace("\n","<br />\n"); }
function UCFirst(s){ return s.charAt(0).toUpperCase()+s.substring(1); }


// Parses &-separated name=value argument pairs from query string. //
// Usage:  var args = getArgs(); 
function GetArgs(oWindow){
	var aArgs = new Object();
	var aPairs = oWindow.document.location.search.substring(1).split("&");
	var p;
	for(var i = 0; i < aPairs.length; i++){
		if( -1 == (p = aPairs[i].indexOf('=')) ) continue;
		aArgs[aPairs[i].substring(0,p)] = unescape(aPairs[i].substring(p+1));
	}
	return aArgs;
}


// Math //
function Round(x, dec){
	if(t >= 0 && t <= 20) return x.toFixed(dec);
	t = Math.power(10, dec); return Math.round(x*t) / t;
}
//Math.prototype.Round = Round();


// Returns index of the first a's field not smaller than i. //
function GetInterval(val, a){
	for(var i=0; i < a.length; i++)
		if(val < a[i]) return i;
	return a.length;
}


// Zjistovani pozice tagu //
function Point(iX, iY){
	this.x = iX;
	this.y = iY;
}

function GetXY(aTag){
	var oTmp = aTag;
	var pt = new Point(0,0);
	do{
		pt.x += oTmp.offsetLeft;
		pt.y += oTmp.offsetTop;
		oTmp = oTmp.offsetParent;
	//} while(oTmp.tagName!="BODY");
	} while(oTmp!=null);
	return pt;
}



// Dumpovani objektu //
function DumpObject(obj){
	var res = "Objektovo vlastnosti:\n=================================\n";
	for(v in obj){
		res = v + " = \"" + obj[v] + "\"\n";
		alert(res);
	}
}

function DumpObjectEx(obj, sMustContain){
	var i = 0, iStr = 1;
	var res = "Objektovo vlastnosti";
	if(sMustContain) res += " s '"+sMustContain+"'";
	res += ":\n";
	if(!bMSIE) res += "type: " + obj.constructor.name+"\n";
	res += "=================================\n";
	
	for(v in obj){
		if(sMustContain && v.toString().toLowerCase().indexOf(sMustContain) == -1) continue;
		i++; var sPad = "";
		if(typeof(obj[v]) == "function") sVal = "function";
		else sVal = obj[v];
		for(k=0; k < Math.max(27 - v.length, 0); k++) sPad += ".";
		res += v + sPad + "\t= \"" + sVal + "\"\n";
		if(!(i%20)){ alert(res); res = "(strana "+(iStr++)+")\n=================================\n"; }
	}
	alert(res);
}