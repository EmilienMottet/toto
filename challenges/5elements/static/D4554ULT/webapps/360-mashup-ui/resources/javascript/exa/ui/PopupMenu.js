exa.provide('exa.ui.PopupMenu');

exa.require('exa.ui.Menu');

exa.ui.PopupMenu = function () {
	exa.ui.Menu.call(this);
	this.setVisible(false);
	this.targets_ = [];
};

exa.inherit(exa.ui.PopupMenu, exa.ui.Menu);

exa.ui.PopupMenu.prototype.unbindTargets = function () {
	for (var i = 0; i < this.targets_.length; i ++) {
		$(this.targets_).unbind();
	}
};

exa.ui.PopupMenu.prototype.bindTo = function(el) {
	this.targets_.push(el);
	$(el).mousedown($.proxy(this.onTargetMouseDown_, this));
	$(el).mouseup($.proxy(this.onTargetMouseUp_, this));
};

exa.ui.PopupMenu.prototype.bindToButton = function(button) {
	this.targets_.push(button);
	button.bind('mousedown', this.onButtonMouseDown_, this);
};

exa.ui.PopupMenu.prototype.onButtonMouseDown_ = function (e, mouseEvent) {
	return this.onTargetMouseDown_(mouseEvent);
};

exa.ui.PopupMenu.prototype.onTargetMouseDown_ = function (e) {
	if (this.isVisible()) {
		this.setVisible(false);
	} else {
		var $target = $(e.currentTarget),
			offset = $target.offset(),
			height = $target.outerHeight(); 
		this.setPosition(offset.left, height + offset.top);
		this.setVisible(true);

		var closePopup = null;
		closePopup = $.proxy(function(e) {
			if (e.target == null || e.target != this.get$element()[0]) {
				this.setVisible(false);
				$(document).off('mouseup', closePopup);
			}
		 }, this);
		$(document).on('mouseup', closePopup);
		return false;
	}
};

exa.ui.PopupMenu.prototype.onTargetMouseUp_ = function (e) {
	return false;
};
