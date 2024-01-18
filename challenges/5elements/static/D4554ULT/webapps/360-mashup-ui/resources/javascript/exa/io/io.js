exa.provide("exa.io");

exa.io.Listener = function (type, callback, opt_context) {
	  this.callback = callback;
	  this.type = type;
	  this.context = opt_context;
};

exa.io.interfaceTree_ = {};
exa.io.listenerTree_ = {};

exa.io.share = function (type, wuid, interf) {
	// save the interface
	var map = exa.io.interfaceTree_;
	if (!map[wuid]) {
		map[wuid] = {};
	}
	map[wuid][type] = interf;

	// notify registered function
	map = exa.io.listenerTree_;	
	if (map[wuid] &&
		map[wuid][type]) {
		var listenerArr = map[wuid][type],
			listener;
		for (var i = 0; i < listenerArr.length; i ++) {
			listener = listenerArr[i]; 
			listener.callback.call(listener.opt_context, interf);
		}
	}
};

exa.io.register = function (type, wuid, callback, opt_context) {
	var map = exa.io.listenerTree_;
	if (!map[wuid]) {
		map[wuid] = {};
	}
	map = map[wuid];	
	if (!map[type]) {
		map[type] = [];
	}
	map[type].push(new exa.io.Listener(type, callback, opt_context));
	
	map = exa.io.interfaceTree_;
	if (map[wuid] &&
		map[wuid][type]) {
		callback.call(opt_context, map[wuid][type]);
	}
};
