(function(w) {
	var messages;
	w.mashupI18N = {
		get : function(widgetId, code) {
			if (messages && messages[widgetId]
					&& typeof messages[widgetId][code] != 'undefined') {
				var ret = messages[widgetId][code],
					re;
				for (var i = 0; i < arguments.length-2; i ++) {
					re = new RegExp('\\{'+i+'\\}', 'g');
					ret = ret.replace(re, arguments[i+2]);
				}
				return ret;
			}
			return code;
		},
		load : function(msgs) {
			messages = msgs;
		}
	};
})(window);