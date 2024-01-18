exa.provide('exa.ui.Menu');

exa.require('exa.ui.Component');

exa.ui.Menu = function () {
};

exa.inherit(exa.ui.Menu, exa.ui.Component);

exa.ui.Menu.prototype.createDom = function() {
	exa.ui.Menu.superClass_.createDom.call(this);
	this.element_.className = 'exa-menu';
};

exa.ui.Menu.prototype.setPosition = function (left, top) {
	if (this.element_) {
		this.element_.style.top = top + 'px';
		this.element_.style.left = left + 'px';
	}
};

exa.ui.Menu.prototype.addItem = function (item) {
	this.addChild(item, true);	
};