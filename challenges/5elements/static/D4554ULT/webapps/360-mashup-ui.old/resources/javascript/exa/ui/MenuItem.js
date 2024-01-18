exa.provide('exa.ui.MenuItem');

exa.require('exa.dom');
exa.require('exa.ui.Component');

exa.ui.MenuItem = function (content, opt_data) {	
	this.content_ = content;
	this.data_ = opt_data;
};

exa.inherit(exa.ui.MenuItem, exa.ui.Component);

exa.ui.MenuItem.prototype.createDom = function() {
	exa.ui.MenuItem.superClass_.createDom.call(this);
	var element = this.element_,
		content;
	
	element.className = 'exa-menuitem';
	element.id = this.getId();
	
	content = exa.dom.createDom('div', 'exa-menuitem-content');
	content.innerHTML = this.content_;
//	exa.dom.setTextContent(content, this.content_);
	element.appendChild(content);
};

exa.ui.MenuItem.prototype.getContent = function () {
	return this.content_;
};

exa.ui.MenuItem.prototype.getData = function () {
	return this.data_;
};

exa.ui.MenuItem.prototype.enterDocument = function() {
	exa.ui.MenuItem.superClass_.enterDocument.call(this);
	var $element = this.get$element();
	$element.mouseup($.proxy(this.handleMouseUp, this));
	$element.mouseenter($.proxy(this.handleMouseEnter, this));
	$element.mouseleave($.proxy(this.handleMouseLeave, this));
};

exa.ui.MenuItem.prototype.handleMouseUp = function (e) {
	this.parent_.trigger('action', this);
};

exa.ui.MenuItem.prototype.handleMouseEnter = function (e) {
	this.addClass('exa-menuitem-hover');
};

exa.ui.MenuItem.prototype.handleMouseLeave = function (e) {
	this.removeClass('exa-menuitem-hover');
};

