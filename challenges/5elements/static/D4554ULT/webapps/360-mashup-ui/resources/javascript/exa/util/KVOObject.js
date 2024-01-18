exa.provide('exa.util.KVOObject');


exa.util.KVOObject = function() {
	
};

exa.util.KVOObject.getListeners_ = function(obj) {
	if (!obj.listeners_) obj.listeners_ = {};
	return obj.listeners_;
};

exa.util.KVOObject.prototype.get = function(key) {
	return this[key];
};

exa.util.KVOObject.prototype.set = function(key, value) {
	if (value != this[key]) {
		this[key] = value;
		this.changed(key);
	}
};
	

exa.util.KVOObject.prototype.changed = function(key) {
	this.notify(key);
};

exa.util.KVOObject.prototype.notify = function(key) {	
	var listeners  = exa.util.KVOObject.getListeners_(this)[key];
	if (listeners) {
		for (var i = 0; i < listeners.length; i ++) {			
			listeners[i].observeValueForKey(key, this);
		}
	}
};

exa.util.KVOObject.prototype.addObserverForKey = function (listener, key) {
	if (typeof listener.observeValueForKey !== "function") {
		throw 'exa.util.KVOObject.addObserverForKey: Listener doesn\'t implement observeValueForKey';
	}
	var listeners = exa.util.KVOObject.getListeners_(this); 
	listeners[key] = listeners[key] || [];
	listeners[key].push(listener);
	
	if (typeof this[key] !== 'undefined') {
		listener.observeValueForKey(key, this);
	}
};

exa.util.KVOObject.addProperty = function(obj, key) {
	var camelCase = key.substr(0, 1).toUpperCase() + key.substr(1);
	obj.prototype['set'+camelCase] = function (value) {
		this.set(key, value);
	};
	
	obj.prototype['get'+camelCase] = function (value) {
		return this.get(key);
	};
};
