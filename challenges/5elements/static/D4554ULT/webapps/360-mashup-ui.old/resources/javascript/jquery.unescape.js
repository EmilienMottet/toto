/**
 * @name jquery.unescape.js
 */
(function($) {
	$.fn.unescape = function() {
		return $(this).html($.unescape($(this).html()));
	}

	/**
	 * @param string html - HTML string to unescape.
	 * @return string - unescaped HTML string.
	 */
	$.unescape = function(html) {
		var htmlNode = document.createElement('div');
		htmlNode.innerHTML = html;
		if (htmlNode.innerText) {
			return htmlNode.innerText; // IE
		}
		return htmlNode.textContent; // FF
	}
})(jQuery);