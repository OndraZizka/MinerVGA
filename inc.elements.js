/* Konkretni elementy, ke kterym se pristupuje */

/* class cElementsById - trida pro uchovavani elementu */

/* Konst - sElements je retezec s ID elementu, oddelenymi mezerou. */
/* Rozdeli je do pole, vsechny je vyhleda v dokumentu doc a prida. */
function cElementsById(doc, sElementIDs){
	this.doc = doc;
	if((sElementIDs == '#all#')){
		if(0 && doc.implementation.hasFeature("Traversal","2.0")){
			// Je k dispozici rozhrani DOM Traversal //
			var callbackFilterFunc = function(node){ return node.hasAttribute('id') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; }
			var noteIter = doc.createNodeIterator(doc, NodeFilter.SHOW_ELEMENT, callbackFilterFunc, false);
			var node; while( node = noteIter.nextNode() ){ this.Add(node.getAttribute('id'), node); }
		}else{
			// Neni k dispozici rozhrani DOM Traversal //
			var FindIDs = function(thisFunction, objElementsById, objElement){
				// Pokud ma tento element ID, pridame do seznamu. //
				if(objElement['id']){
					objElementsById.Add(objElement['id'], objElement);
				}
				// Projedem deti touto funkci.           //
				var aChildren = isMSIE() ? objElement.children : objElement.childNodes;
				for(var i in aChildren){
					thisFunction(thisFunction, objElementsById, aChildren[i]);
				}
			};
			// Zavolame rekurzivni fci na dokument v argumentu doc //
			FindIDs(FindIDs, this, doc);
		}
			
	}
	else{
		var asElementIDs = sElementIDs.split(' ');
		for(var i in asElementIDs)
			{ this.FindAdd(asElementIDs[i]); }
	}
}

cElementsById.prototype.FindAdd = function(sId){
	return this[sId] = this.doc.getElementById(sId);
}
cElementsById.prototype.Add = function(sId, node){
	return this[sId] = node;
}
/* class cElementsById - KONEC */