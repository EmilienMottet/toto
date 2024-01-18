exa.provide('exa.ui.SelectMenu');

exa.require('exa.ui.Button');
exa.require('exa.ui.PopupMenu');

exa.ui.SelectMenu = function (label, isMultiple, opt_className) {
	exa.ui.SelectMenu.superClass_.constructor.call(this, label, opt_className);
	this.label = label;
	this.isMultiple = !!isMultiple;
	this.selections_ = this.isMultiple ? [] : null;
};

exa.inherit(exa.ui.SelectMenu, exa.ui.Button);

exa.ui.SelectMenu.prototype.enterDocument = function () {
	exa.ui.SelectMenu.superClass_.enterDocument.call(this);
	if (this.menu_) {
		this.bindMenu_();		
	}
};

exa.ui.SelectMenu.prototype.getMenu = function () {
	if (!this.menu_) {
		this.menu_ = new exa.ui.PopupMenu();
		this.menu_.render();
		if (this.isInDocument()) {
			this.bindMenu_();
		}
	}
	return this.menu_;
};

exa.ui.SelectMenu.prototype.bindMenu_ = function () {
	this.menu_.bindToButton(this);
	this.menu_.bind('action', this.selectionChanged_, this);
};

exa.ui.SelectMenu.prototype.setSelected = function (child) {
	if (this.isMultiple) {
		var index = this.selections_.indexOf(child),
			labels = [];
		if (index == -1) {
			this.selections_.push(child);
		} else {
			this.selections_.splice(index, 1);
		}
		for (var i = 0; i < this.selections_.length; i++) {
			labels.push(this.selections_[i].getContent());
		}
		this.setContent(this.label+ labels.join(', '));
		this.trigger('action', child);
	} else {
		if (child != this.selections_) {
			this.setContent(this.label+ child.getContent());
			this.trigger('action', child);
		}		
	}
};

exa.ui.SelectMenu.prototype.selectionChanged_ = function (e, child) {
	this.setSelected(child);
};

exa.ui.SelectMenu.prototype.addItem = function(item) {
	this.getMenu().addChild(item, true);
};

