// Miner JS settings mutation file. //

// Settings key. Should be the same as in this file's name. //
var sSettingsKey = "default";
if(cSettings && typeof(cSettings) == "function"){
	set = cSettings[sSettingsKey] = new Object();
	set.konst = new Object();
}

// Settings for items. //	
// iId:       internal integer ID
// iUsages:   how many times can the item be used before being "depleted"
// iTime:     number of seconds after which the item will be obsolete and disappear (expire)
// iPrice:    the price what will be the item sold for.
//   Note that neither of the three properties must be always used. E.g., iTime is not used for g_lopata (showel).
//   If you played the game for a while, it should be quite clear. 
//   Note that the settings in the inc.predmety.js file are used as default if not modified here.
cSettings[sSettingsKey].aItems = [
	{ iId: g_lopata,    iUsages:  30, iTime:   -1, iPrice:  200  },
	{ iId: g_krumpac,   iUsages:  50, iTime:   -1, iPrice:  400  },
	{ iId: g_vrtak,     iUsages:  10, iTime:   -1, iPrice: 1200  },
	{ iId: g_sbijecka,  iUsages: 180, iTime:   -1, iPrice:10000  },
	{ iId: g_dynamit,   iUsages:   1, iTime:  300, iPrice: 3000  },
	{ iId: g_louc,      iUsages:  -1, iTime:  200, iPrice:  100  },
	{ iId: g_lampa,     iUsages:  -1, iTime:  200, iPrice:  600  },
	{ iId: g_halogen,   iUsages:  -1, iTime:  300, iPrice: 2400  },
	{ iId: g_baterie,   iUsages:  -1, iTime: 2000, iPrice:  300  },
//{ iId: g_sonda,     iUsages: 200, iTime:   -1, iPrice:20000  },
//{ iId: g_trikoder,  iUsages:1000, iTime:   -1, iPrice:50000  },
	{ iId: g_kbelik,    iUsages:  10, iTime: 9000, iPrice:  100  },
	{ iId: g_pumpa,     iUsages:  50, iTime: 9000, iPrice: 4200  },
	{ iId: g_stesti,    iUsages:  60, iTime:  120, iPrice:    0  }
];

// Constants //
//set.konst. = ;