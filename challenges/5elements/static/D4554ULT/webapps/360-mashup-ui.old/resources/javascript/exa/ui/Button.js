exa.provide('exa.ui.Button');

exa.require('exa.ui.Component');

exa.ui.Button = function (content, opt_className) {
	this.content = content;
	this.className = opt_className || 'exa-button';
};

exa.inherit(exa.ui.Button, exa.ui.Component);

exa.ui.Button.prototype.enabled_ = true;
exa.ui.Button.prototype.active_ = false;


exa.ui.Button.prototype.createDom = function () {
	this.element_ = exa.dom.createDom('span', this.className);
	this.setContent(this.content);
	
	if (!this.enabled_){
		this.addClass(this.className + '-disabled');
	}
};

exa.ui.Button.prototype.enterDocument = function () {
	exa.ui.Button.superClass_.enterDocument.call(this);
	var $el = this.get$element();
	$el.mousedown($.proxy(this.handleMouseDown, this));
	$el.mouseup($.proxy(this.handleMouseUp, this));
	$el.mouseenter($.proxy(this.handleMouseEnter, this));
	$el.mouseleave($.proxy(this.handleMouseLeave, this));
	
	if (!this.enabled_) {
		this.addClass(this.className + '-disabled');
	}
	if (this.active_) {
		this.addClass(this.className + '-active');
	}
};

exa.ui.Button.prototype.setContent = function (content) {
	this.content = content;	
	if (this.element_) {
		if (exa.isString(content)) {
			this.element_.innerHTML = content;
		} else {
			this.element_.appendChild(content);
		}
	}
};

exa.ui.Button.prototype.setActive = function (active) {
	if (this.active_ != active) {
		this.active_ = active;
		if (this.isInDocument()) {
			if (active) {
				this.addClass(this.className + '-active');
			} else {
				this.removeClass(this.className + '-active');	
			}
		}
	}
};

exa.ui.Button.prototype.setEnabled = function (enable) {
	if (this.enabled_ != enable) {
		this.enabled_ = enable;		
		if (this.isInDocument()) {
			if (enable) {
				this.removeClass(this.className + '-disabled');
			} else {
				this.addClass(this.className + '-disabled');
				this.removeClass(this.className + '-hover');
				this.setActive(false);
			}
		}
	}
};

exa.ui.Button.prototype.handleMouseDown = function (e) {
	if (this.enabled_) {
		e.preventDefault();
		this.setActive(true);
		this.trigger('mousedown' ,e);
		return false;
	}
};

exa.ui.Button.prototype.handleMouseUp = function (e) {
	if (this.enabled_) {
		if (this.active_) {
			this.trigger('mouseup', e);
		}
		this.setActive(false);
		return false;
	}
};

exa.ui.Button.prototype.handleMouseEnter = function (e) {
	if (this.enabled_) {
		this.addClass(this.className + '-hover');
		this.trigger('mouseenter' ,e);
		return false;
	}
};
exa.ui.Button.prototype.handleMouseLeave = function (e) {
	if (this.enabled_) {
		this.removeClass(this.className + '-hover');
		this.setActive(false);
		this.trigger('mouseleave' ,e);
		return false;
	}
};


