exa.provide('exa.string.util');

exa.string.util.hashCode = function (str) {
	var hash = 0;
	if (str == undefined || str.length == 0) return hash;
	for (var i = 0; i < str.length; i++) {
		hash = ((hash<<5)-hash)+str.charCodeAt(i);
		hash = hash & hash; // convert to 32bit integer
	}
	if (hash < 0) hash *= -1; // force positive values
	return hash;
};
