$(document).ready(function() {
	$('.refinesAsSelect select').bind('change', function(e) {
			var $this = $(this);
			if ($this.val().length > 0 && ($this.find('[refined]').length == 0 || $this.find(':selected').attr('refined') == undefined)) {
				// no refine or no refine on selected item, take the selected item
				exa.redirect($this.val());
			} else {
				// selected a refined link, we take the next so that
				// the cancelled refine result in the one we selected
				exa.redirect($this.find(':selected').next().val());
			}

	});
});