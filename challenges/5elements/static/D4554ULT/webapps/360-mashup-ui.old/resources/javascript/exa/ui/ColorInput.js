exa.provide('exa.ui.ColorInput');

exa.require('exa.ui.Component');

exa.ui.ColorInput = function (content, opt_className, opt_colorPicker) {
	exa.ui.ColorInput.superClass_.constructor.call(this, content, opt_className);
	this.colorPicker_ = opt_colorPicker;
};
exa.inherit(exa.ui.ColorInput, exa.ui.Button);

exa.ui.ColorInput.prototype.value_ = '#336699';

exa.ui.ColorInput.prototype.createDom = function () {
	exa.ui.ColorInput.superClass_.createDom.call(this);
	
	var colorHint = document.createElement('div');
	colorHint.className = this.className + '-colorhint';	
	this.element_.insertBefore(colorHint, this.element_.firstChild);
	
	if (this.value_) {
		colorHint.style.backgroundColor = this.value_;
	}
	
	this.colorHint_ = colorHint;
	
	this.addClass(this.className + '-color');
};

exa.ui.ColorInput.prototype.enterDocument = function () {
	exa.ui.ColorInput.superClass_.enterDocument.call(this);
	if (!this.colorPicker_) {
		this.colorPicker_ = new exa.ui.ColorPicker();
		this.colorPicker_.render();
	}
	this.bind('mousedown', this.openPicker_, this);
	this.colorPicker_.bind('color', this.colorChosen_, this);
};

exa.ui.ColorInput.prototype.colorChosen_ = function (e, color, target) {	
	if (target == this.element_) {
		this.setValue(color);
	}
};

exa.ui.ColorInput.prototype.openPicker_ = function () {
	this.colorPicker_.open(this.element_, this.value_);
};

exa.ui.ColorInput.prototype.getValue = function () {
	return this.value_;
};

exa.ui.ColorInput.prototype.setValue = function (color) {
	this.value_ = color;
	if (this.colorHint_) {
		this.colorHint_.style.backgroundColor = this.value_;
	}
};
