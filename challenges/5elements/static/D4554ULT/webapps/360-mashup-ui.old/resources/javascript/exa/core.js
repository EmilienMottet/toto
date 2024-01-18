
var exa = exa || {};

exa.provide = function (name) {	
	var parts = name.split('.');
	var cur = window;
	for (var part; parts.length && (part = parts.shift()); ) {
	    if (cur[part] != null) {
    		cur = cur[part];
	    } else {
	    	cur = cur[part] = {};
	    }
	}
};

exa.require = function (name) {};

exa.inherit = function (child, parent) {
	function tmp() {};
	tmp.prototype = parent.prototype;
	child.superClass_ = parent.prototype;
	child.prototype = new tmp();
	child.prototype.constructor = child;
};

exa.getInterface = function (interf, obj) {	
	var ret = new interf;
	
	for (var prop in interf.prototype) {
		ret[prop] = exa.getInterfaceFunc_(prop, obj);
	}
	return ret;
};

exa.getInterfaceFunc_ = function (name, obj) {
	if (exa.isFunction(obj[name])) {
		return function () {
			return obj[name].apply(obj, arguments);
		};
	} else {
		return function () {};
	}
};

exa.isDef = function (val) {
	return val !== undefined;
};

exa.isDefAndNotNull = function (val) {
	return val != null;
};

exa.isNumber = function(val) {	
	return typeof val == 'number';
};

exa.isString = function(val) {
	return typeof val == 'string';
};

exa.isFunction = function(val) {
	return Object.prototype.toString.call(val) === "[object Function]";
};

exa.isBoolean = function(val) {
	return typeof val == 'boolean';
};

exa.isUrl = function(val){
	var a = document.createElement("a");
	a.href = val;
	return (a.host && a.host != window.location.host);
};

if (Array.isArray) {
	exa.isArray = function(val) {
		return Array.isArray(val);
	};
} else {
	exa.isArray = function(val) {	
		return Object.prototype.toString.call(val) == '[object Array]';  
	};
}
exa.redirect = function(val){
	window.location = val;
};
