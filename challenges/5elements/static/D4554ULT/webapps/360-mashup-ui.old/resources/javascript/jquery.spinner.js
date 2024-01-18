/**
 * Loading spinner - style in search-ui.css
 */

jQuery.fn.showSpinner = function(options) {
	options = options || {};

	var $this = $(this);
	if ($this.length > 0 && $this.is(':visible') && $this.find('> .loading-spinner').length == 0) {
		var position = $this.offset();

		// Overlay
		if (options.overlay == true) {
			$this.append('<div class="loading-overlay" style="position: absolute;"></div>');
			$this.find('> .loading-overlay').css('top', position.top);
			$this.find('> .loading-overlay').css('left', position.left);
			$this.find('> .loading-overlay').css('height', $this.outerHeight());
			$this.find('> .loading-overlay').css('width', $this.outerWidth());
		}

		// Spinner
		$this.append("<div class='loading-spinner' style='position: absolute;'></div>");
		$this.find('> .loading-spinner').css('top', position.top + $this.outerHeight() / 2);
		$this.find('> .loading-spinner').css('left', position.left + $this.outerWidth() / 2);
	}
};

jQuery.fn.hideSpinner = function(fade) {
	var $this = $(this);
	if ($this.is(':visible')) {
		if (fade == undefined || fade == true) {
			$this.find("> .loading-spinner").fadeOut('normal', function() {
				$(this).parent().find('> .loading-overlay').remove();
				$(this).remove();
			});
		} else {
			$this.find('> .loading-spinner').remove();
			$this.find('> .loading-overlay').remove();
		}
	}
};
