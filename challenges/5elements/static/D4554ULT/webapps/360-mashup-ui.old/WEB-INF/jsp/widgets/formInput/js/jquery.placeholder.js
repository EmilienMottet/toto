jQuery.fn.placeholder = function(options) {
	/* if browser supports placeholder stop the function */
	if (!!('placeholder' in document.createElement('input'))) {
		return;
	}

	var $input = $(this);
	if ($input.attr('placeholder') == '') {
		return;
	}

	options = $.extend({
		color : '#999'
	}, options);
	var previousColor = $input.css('color');

	if ($input.is('input') && $input.attr('type') == 'password') {
		var $dummy = $('<input type="text" />');
		$dummy.attr('style', $input.attr('style'));
		$dummy.attr('class', $input.attr('class'));
		$dummy.css('color', options.color);
		$dummy.val($input.attr('placeholder'));
		$dummy.insertAfter($input);
		$dummy.bind('focus', function() {
			$input.show().val('').focus();
			$dummy.hide();
		});

		$input.bind('blur', function() {
			if ($input.val().length == 0) {
				$input.hide();
				$dummy.show();
			}
		}).hide();
	} else {
		if ($input.val().length == 0) {
			$input.val($input.attr('placeholder')).addClass('placeholder').css('color', options.color);
		}
		$input.bind({
			focus : function() {
				if ($input.hasClass('placeholder')) {
					$input.val('').removeClass('placeholder').css('color', previousColor);
				}
			},
			blur : function() {
				if ($input.val().length == 0) {
					$input.val($input.attr('placeholder')).addClass('placeholder').css('color', options.color);
				}
			}
		});
	}
};
