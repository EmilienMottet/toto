(function($) {
	$.fn.scaleTextToFit = function() {
		return this.each(function() {
			// Hack for IE6 : Hide the content to measure the width without the overflow
			$(this).hide();
			var parentWidth = $(this).parent().width();
			$(this).show();
			var parentHeight = $(this).parent().height();
			
			var fontSize = 70;
			do {
				$(this).css('font-size', fontSize--);
			}
			while( $(this).height() > parentHeight || $(this).width() > parentWidth )
		});
	};
})(jQuery);
