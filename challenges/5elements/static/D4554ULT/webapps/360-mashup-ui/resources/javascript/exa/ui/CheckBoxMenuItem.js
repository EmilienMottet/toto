exa.provide('exa.ui.CheckBoxMenuItem');

exa.require('exa.dom');
exa.require('exa.ui.MenuItem');

exa.ui.CheckBoxMenuItem = function (content, opt_data) {	
	exa.ui.MenuItem.call(this, content, opt_data);
};

exa.inherit(exa.ui.CheckBoxMenuItem, exa.ui.MenuItem);

exa.ui.CheckBoxMenuItem.prototype.checked = false;

exa.ui.CheckBoxMenuItem.prototype.createDom = function() {
	exa.ui.CheckBoxMenuItem.superClass_.createDom.call(this);
	var span = exa.dom.createDom('span', 'exa-checkboxmenuitem');
	this.checkElement_ = span;
	this.element_.firstChild.insertBefore(span, this.element_.firstChild.firstChild);
	this.setValue(this.checked);
};

exa.ui.CheckBoxMenuItem.prototype.setValue = function (checked) {
	this.checked = checked;
	if (this.checkElement_) {
		if (checked) {
			exa.dom.setTextContent(this.checkElement_, '\u2713');
		} else {
			exa.dom.setTextContent(this.checkElement_, '');
		}
	}
};

exa.ui.CheckBoxMenuItem.prototype.handleMouseUp = function (e) {
	this.setValue(!this.checked);	
	exa.ui.CheckBoxMenuItem.superClass_.handleMouseUp.call(this, e);
	return false;
};
