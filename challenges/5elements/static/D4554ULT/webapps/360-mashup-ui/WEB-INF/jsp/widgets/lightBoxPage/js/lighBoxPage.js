function LighBoxPage(width, height) {
	this.$body = $('body');
	this.$el = null;
	this.$elOverlay = null;

	this.width = width;
	this.height = height;

	var _this = this;
	// Catch resize events
	$(window).on('resize', function(e) {
		_this.onResize();
	});

	// Catch key up events
	$(window).on('keyup', function(e) {
		if (e.keyCode == 27) {
			_this.close();
		}
	});
};

LighBoxPage.prototype.addSelector = function(selector) {
	var _this = this;
	$(document).on('click', selector, function(e) {
		// Catch the click event
		e.preventDefault();

		// Open the Lightbox
		_this.open($(this).attr('href'));
	});
};

LighBoxPage.prototype.onResize = function() {
	if (this.$el == null) {
		return;
	}

	var height = this.height,
		width = this.width;

	if (height > $(window).height()) {
		height = $(window).height();
	}
	if (width > $(window).width()) {
		width = $(window).width();
	}

	var top = ($(window).height() - this.height) / 2,
		left = ($(window).width() - this.width) / 2;

	if (top < 0) {
		top = 0;
	}
	if (left < 0) {
		left = 0;
	}

	this.getEl().css('width', width - 10)
				.css('height', height - 10)
				.css('top', top + 5)
				.css('left', left + 5);

	this.getEl().find('> iframe').css('width', width - 10)
								 .css('height', height - 10);
};

LighBoxPage.prototype.open = function(url) {
	if (this.$elOverlay == null) {
		this.getElOverlay().appendTo(this.$body);
	}
	if (this.$el == null) {
		this.getEl().appendTo(this.$body);

		var _this = this;
		this.getEl().on('click', 'span.closeButton', function() {
			_this.close();
		});
	}

	this.getElOverlay().show();
	this.onResize();
	this.getEl().find('> iframe').attr('src', url);
};

LighBoxPage.prototype.close = function() {
	if (this.$el != null) {
		this.$el.off('click', 'span.closeButton');
		this.$el.remove();
		this.$el = null;
	}

	if (this.$elOverlay != null) {
		this.$elOverlay.hide();
	}
};

LighBoxPage.prototype.getEl = function(e) {
	if (this.$el == null) {
		var html = '' +
			'<div id="light-box-page-iframe">' +
			'	<span class="closeButton">&times;</span>' +
			'	<iframe src="">' +
			'	</iframe>' +
			'</div>';
		this.$el = $(html);
	}
	return this.$el;
};

LighBoxPage.prototype.getElOverlay = function(e) {
	if (this.$elOverlay == null) {
		var html = '<div id="light-box-page-overlay"></div>';
		this.$elOverlay = $(html);
	}
	return this.$elOverlay;
};