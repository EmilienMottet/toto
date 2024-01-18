exa.provide('exa.ui.SubMenu');

exa.require('exa.ui.Menu');
exa.require('exa.ui.MenuItem');

exa.ui.SubMenu = function (content, opt_data) {	
	exa.ui.MenuItem.call(this, content ,opt_data);	
};

exa.inherit(exa.ui.SubMenu, exa.ui.MenuItem);

exa.ui.SubMenu.prototype.getMenu = function() {
	if (!this.submenu_) {
		this.submenu_ = new exa.ui.Menu();
		this.submenu_.setVisible(false);
		this.addChild(this.submenu_, true);		
	}
	return this.submenu_;
};

exa.ui.SubMenu.prototype.addItem = function (item) {
	this.getMenu().addChild(item, true);
};

exa.ui.SubMenu.prototype.createDom = function() {
	exa.ui.SubMenu.superClass_.createDom.call(this);
	var span = exa.dom.createDom('span', 'exa-submenu');
	exa.dom.setTextContent(span, '\u25BA');
	this.element_.firstChild.appendChild(span);
};

exa.ui.SubMenu.prototype.handleMouseEnter = function (e) {	
	exa.ui.SubMenu.superClass_.handleMouseEnter.call(this, e);
	
	var $el = $(this.element_),
		left = $el.outerWidth(true),
		menu = this.getMenu();
	
	menu.setPosition(left, 0);	
	menu.setVisible(true);	
};

exa.ui.SubMenu.prototype.handleMouseLeave = function (e) {
	exa.ui.SubMenu.superClass_.handleMouseLeave.call(this, e);
	this.getMenu().setVisible(false);	
};