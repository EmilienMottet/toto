exa.provide('exa.flea.FleaInputStream');


exa.flea.FleaInputStream = function (str) {
    var bytes = [],
    	i;
    for (i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i) & 0xff;
    }
	this.stream = bytes;
};
	
exa.flea.FleaInputStream.prototype.readCodedTag = function () {
	return this.readRef();
};

exa.flea.FleaInputStream.prototype.readUbyteField = function () {
	return this.readExact();
};

exa.flea.FleaInputStream.prototype.readBooleanField = function () {
	return this.readUbyteField() != 0;
};

exa.flea.FleaInputStream.prototype.readFixedintField = function () {
	return this.readLE32();
};

exa.flea.FleaInputStream.prototype.readFixedlongField = function () {
	return this.readLE64();
};

exa.flea.FleaInputStream.prototype.readShortField = function () {
	return this.readRef16();
};

exa.flea.FleaInputStream.prototype.readIntField = function () {
	return this.readRef32();
};

exa.flea.FleaInputStream.prototype.readLongField = function () {
	return this.readRef64();
};

exa.flea.FleaInputStream.prototype.readSignedshortField = function () {
	return this.readSignedRef16();
};

exa.flea.FleaInputStream.prototype.readSignedintField = function () {
	return this.readSignedRef32();
};

exa.flea.FleaInputStream.prototype.readSignedlongField = function () {
	return this.readSignedRef64();
};

exa.flea.FleaInputStream.prototype.readFloatField = function () {
	throw new Error('exa.flea.FleaInputStream.prototype.readFloatField not implemented');
};

exa.flea.FleaInputStream.prototype.readDoubleField = function () {
	throw new Error('exa.flea.FleaInputStream.prototype.readDoubleField not implemented');
};

exa.flea.FleaInputStream.prototype.readUbytearrayField = function () {
	var nbElems = this.readRef32(),
		ret = [],
		i;
	for (i = 0; i < nbElems; i++) {
		ret[i] = this.stream.shift();
	}
	return ret;
};

exa.flea.FleaInputStream.prototype.readStringField = function () {
	var nbElems = this.readRef32(),
		data = [],
		i;	 
    for (i = 0; i < nbElems; i++) {
    	data.push(this.stream.shift());
    }
    return String.fromCharCode.apply(String, data);
};

exa.flea.FleaInputStream.prototype.readShortarrayField = function () {
	var nbElems = this.readRef32(),
		ret = [],
		i;
	for (i = 0; i < nbElems; i++) {
		ret[i] = this.readRef16();
	}
	return ret;
};

exa.flea.FleaInputStream.prototype.readIntarrayField = function () {
	var nbElems = this.readRef32(),
		ret = [],
		i;
	for (i = 0; i < nbElems; i++) {
		ret[i] = this.readRef32();
	}
	return ret;
};

exa.flea.FleaInputStream.prototype.readLongarrayField = function () {
	var nbElems = this.readRef32(),
		ret = [],
		i;
	for (i = 0; i < nbElems; i++) {
		ret[i] = this.readRef64();
	}
	return ret;
};

exa.flea.FleaInputStream.prototype.readStringarrayField = function () {
	var nbElems = this.readRef32(),
		ret = [],
		i;
	for (i = 0; i < nbElems; i++) {
		ret[i] = this.readStringField();
	}
	return ret;
};

exa.flea.FleaInputStream.prototype.readObjectField = function (type) {
	return new type(this);
};

exa.flea.FleaInputStream.prototype.readObjectarrayField = function (type) {
	var nbElems = this.readRef32(),
		ret = [],
		i;
	for (i = 0; i < nbElems; i++) {
		ret[i] = this.readObjectField(type);
	}
	return ret;
};

exa.flea.FleaInputStream.prototype.skipField = function () {
	throw new Error('exa.flea.FleaInputStream.prototype.skipField not implemented');
};

/* Low level */
exa.flea.FleaInputStream.prototype.readExact = function () {
	return this.stream.shift();
};

exa.flea.FleaInputStream.prototype.readRef = function () {
	 var shift = 0,
	 	 result = 0,
	 	 b,
	 	 lb;
	 while (shift < 64) {
		 b = this.readExact();
		 lb = b >= 0 ? b : 256 + b;
		 result |= (lb >> 1) << shift;
		 shift += 7;
		 if ((lb & 0x01) == 0) {
			 return result;
		 }
	 }
	 throw Error('MalformedEncodingException.malformedVariableInteger()');
};

exa.flea.FleaInputStream.prototype.readRef16 = function () {
	return this.readRef();
};

exa.flea.FleaInputStream.prototype.readRef32 = function () {
	return this.readRef();
};

exa.flea.FleaInputStream.prototype.readRef64 = function () {
	return this.readRef();
};
