exa.provide('exa.ui.MenuSeparator');

exa.require('exa.ui.Component');

exa.ui.MenuSeparator = function () {
};

exa.inherit(exa.ui.MenuSeparator, exa.ui.Component);

exa.ui.MenuSeparator.prototype.createDom = function() {
	exa.ui.MenuSeparator.superClass_.createDom.call(this);
	this.element_.className = 'exa-menuseparator';
};