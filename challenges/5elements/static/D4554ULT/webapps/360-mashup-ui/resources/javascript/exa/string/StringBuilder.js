exa.provide('exa.string.StringBuilder');

exa.string.USE_ARRAY = 'ScriptEngine' in window && window.ScriptEngine() == 'JScript';

exa.string.StringBuilder = function (initStr) {
	this.buffer_ = exa.string.USE_ARRAY ? [] : '';
	
	if (typeof initStr == 'string') {
		this.append(initStr);
	}
};

if (exa.string.USE_ARRAY) {
	
	exa.string.StringBuilder.prototype.bufferLength_ = 0;
	
	exa.string.StringBuilder.prototype.append = function (str) {
		this.buffer_[this.bufferLength_++] = str;
		return this;
	};
	
	exa.string.StringBuilder.prototype.clear = function () {
		this.buffer_.length = 0;
		this.bufferLength_ = 0;
		return this;
	};

	exa.string.StringBuilder.prototype.toString = function() {
		var str = this.buffer_.join('');
		this.clear();
		if (str) {
			this.append(str);
		}
		return str;
	};
} else {
	
	exa.string.StringBuilder.prototype.append = function (str) {
		this.buffer_ += str;
		return this;
	};
	
	exa.string.StringBuilder.prototype.clear = function () {
		this.buffer_ = '';
		return this;
	};

	exa.string.StringBuilder.prototype.toString = function() {
		return this.buffer_;
	};
}

exa.string.StringBuilder.prototype.set = function(s) {
	this.clear();
	this.append(s);
};

exa.string.StringBuilder.prototype.getLength = function() {
	return this.toString().length;
};