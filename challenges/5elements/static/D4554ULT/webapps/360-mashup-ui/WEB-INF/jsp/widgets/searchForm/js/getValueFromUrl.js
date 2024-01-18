(function($) {
	
	$.fn.enableGetValueFromUrl = function(param) {
	
		var onLoad = function($input) {
			$input.val(decodeURIComponent(getQueryVariable(param)).replace(/\+/g, ' '));
		};
		
		var getQueryVariable = function (variable) {
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0; i < vars.length; i++) {
			    var pair = vars[i].split("=");
			    if(pair[0] == variable){
			    	return pair[1];
			    }
			}
			return false;
		}
		
		return this.map(function(){
			
			if (this.nodeType != 1 || this.tagName != "INPUT" || this.type != "text") {
				return;
			}
			onLoad($(this));
		});
	};

})(jQuery);