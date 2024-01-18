exa.provide('exa.ui.Component');

exa.ui.Component = function () {};

exa.ui.Component.nextId_ = 0;

exa.ui.Component.getNextUniqueId = function () {
	return 'exa' + (exa.ui.Component.nextId_++).toString(36);
};

exa.ui.Component.prototype.inDocument_ = false;
exa.ui.Component.prototype.id_ = null;
exa.ui.Component.prototype.element_ = null;
exa.ui.Component.prototype.visible_ = true;
exa.ui.Component.prototype.extraClasses_ = null;

exa.ui.Component.prototype.setId = function (id) {
	this.id_ = id;
};

exa.ui.Component.prototype.getId = function () {
	return this.id_ || (this.id_ = exa.ui.Component.getNextUniqueId());
};

exa.ui.Component.prototype.getElement = function () {
	return this.element_;
};

exa.ui.Component.prototype.setElementInternal = function (element) {
	if (this.element_) {
		throw Error('Element already created');
	}
	this.element_ = element;
};

exa.ui.Component.prototype.getParent = function () {
	return this.parent_;
};

exa.ui.Component.prototype.setParent = function (parent) {
	this.parent_ = parent;
};

exa.ui.Component.prototype.render = function (opt_parentElement, opt_beforeElement) {
	if (this.inDocument_) {
		throw Error('Already rendered');
	}
	
	if (!this.element_) {
		this.createDom();
	}
	
	if (opt_parentElement) {
		opt_parentElement.insertBefore(this.element_, opt_beforeElement || null);
	} else {
		document.body.appendChild(this.element_);
	}
	
	if (!this.parent_ || this.parent_.isInDocument()) {
		this.enterDocument();
	}
};

exa.ui.Component.prototype.createDom = function () {
	this.element_ = document.createElement('div');
};

exa.ui.Component.prototype.isInDocument = function () {
	return this.inDocument_;
};

exa.ui.Component.prototype.enterDocument = function () {
	 this.inDocument_ = true;
	 if (!this.visible_) {
			this.get$element().hide();
	 }
	 this.forEachChild(function (child) {
		 if (!child.isInDocument()) {
			 child.enterDocument();
		 }
	 });
	 
	 if (this.extraClasses_) {
		 for (var i = 0; i < this.extraClasses_.length; i ++) {
			 this.get$element().addClass(this.extraClasses_[i]);
		 }
	 }
};

exa.ui.Component.prototype.exitDocument = function() {
	this.forEachChild(function(child) {
		if (child.isInDocument()) {
			child.exitDocument();
		}
	});
	this.inDocument_ = false;
};

exa.ui.Component.prototype.hasChild = function () {
	return !!this.children_ && this.children_.length != 0; 	
};

exa.ui.Component.prototype.getChildCount = function () {
	return this.children_ ? this.children_.length : 0; 
};

exa.ui.Component.prototype.getChildAt = function(index) {
	return this.children_ ? this.children_[index] || null : null;
};

exa.ui.Component.prototype.forEachChild = function (func) {
	var i,
		length,
		children;
	if (this.children_) {
		children = this.children_; 
		for (i = 0, length = children.length; i < length; i ++) {
			func.call(this, children[i], i);		
		}
	}
};

exa.ui.Component.prototype.addChild = function (child, opt_render) {
	this.addChildAt(child, this.getChildCount(), opt_render);
};

exa.ui.Component.prototype.addChildAt = function (child, index, opt_render) {
	if (!this.children_) {
		this.children_ = [];
	}
	
	child.setParent(this);	
	this.children_.splice(index, 0, child);
	
	if (!this.element_) {
		this.createDom();
	}
	if (opt_render) {
		var sibling = this.getChildAt(index+1);
		child.render(this.element_, sibling ? sibling.element_ : null);
	} else {
		if (this.inDocument_ && !child.inDocument_ && child.element_) {
			child.enterDocument();
		}
	}
};

exa.ui.Component.prototype.removeChild = function (child) {
	var index = this.children_.indexOf(child);
	if (index >= 0) {
		this.children_.splice(index, 1);
		if (child.element_) {
			child.exitDocument();
			child.get$element().remove();
		}
		child.setParent(null);
	}	
};

exa.ui.Component.prototype.removeChildAt = function (index) {
	this.removeChild(this.getChildAt(index));
};

exa.ui.Component.prototype.removeChildren = function () {
	while (this.hasChild()) {
		this.removeChildAt(0);
	}
};

/* jQuery part */

exa.ui.Component.prototype.isVisible = function () {
	return this.visible_;	
};

exa.ui.Component.prototype.setVisible = function (visible) {
	if (this.visible_ != visible) {
		this.visible_ = visible;
		if (this.element_) {
			if (visible) {
				this.get$element().show();
			} else {
				this.get$element().hide();
			}
		}
	}
};

exa.ui.Component.prototype.addClass = function (className) {
	if (!this.extraClasses_) {
		this.extraClasses_ = [];
	}
	var index = this.extraClasses_.indexOf(className);
	if (index == -1) {
		this.extraClasses_.push(className);
		if (this.element_) {
			this.get$element().addClass(className);
		}
	}
};

exa.ui.Component.prototype.removeClass = function (className) {
	if (this.extraClasses_) {
		var index = this.extraClasses_.indexOf(className);
		if (index >= 0) {
			this.extraClasses_.splice(index, 1);
		}
		if (this.element_) {
			this.get$element().removeClass(className);
		}
	}
};

exa.ui.Component.prototype.get$ = function () {
	if (!this.$_) {
		this.$_ = $(this);
	}
	return this.$_; 
};

exa.ui.Component.prototype.get$element = function () {
	if (this.element_) {		
		if (!this.$element_) {
			this.$element_ = $(this.element_);
		}
	}
	return this.$element_; 
};

exa.ui.Component.prototype.bind = function (eventType, handler, opt_context) {
	if (opt_context) {
		handler = $.proxy(handler, opt_context);
	}
	this.get$().bind(eventType, handler);
};

exa.ui.Component.prototype.unbind = function (eventType, handler) {
	this.get$().unbind(eventType, handler);
};

exa.ui.Component.prototype.trigger = function (eventType, extraParameters) {	
	return this.get$().trigger(eventType, extraParameters);
};