exa.provide('exa.ui.Radio');
exa.provide('exa.ui.RadioGroup');

exa.require('exa.dom');
exa.require('exa.ui.Component');

exa.ui.RadioGroup = function (label) {
	this.label_ = label;
};
exa.inherit(exa.ui.RadioGroup, exa.ui.Component);

exa.ui.RadioGroup.prototype.createDom = function () {
	exa.ui.RadioGroup.superClass_.createDom.call(this);
	var labelEl;
	if (this.label_) {
		labelEl = exa.dom.createDom('span');
		exa.dom.setTextContent(labelEl, this.label_);
		this.element_.appendChild(labelEl);
	}
};

exa.ui.RadioGroup.prototype.getValue = function () {
	return this.selectedItem_ && this.selectedItem_.getValue();
};

exa.ui.RadioGroup.prototype.setValue = function (value) {
	this.forEachChild(function (child) {
		if (child.getValue() == value) {
			this.setCheckedItem(child);
		}
	});
};

exa.ui.RadioGroup.prototype.setCheckedIndex = function (index) {
	this.setCheckedItem(this.getChildAt(index));
};

exa.ui.RadioGroup.prototype.setCheckedItem = function (checkedItem) {
	if (checkedItem != this.selectedItem_) {
		this.forEachChild(function (child, index) {
			child.setChecked(checkedItem == child);
		});
		this.selectedItem_ = checkedItem;
		this.trigger('changed', checkedItem.getValue());
	}
};

exa.ui.Radio = function (label, value) {
	this.label_ = label;
	this.value_ = value;
};	
exa.inherit(exa.ui.Radio, exa.ui.Component);

exa.ui.Radio.prototype.checked_ = false;

exa.ui.Radio.prototype.getValue = function() {
	return this.value_;
};

exa.ui.Radio.prototype.setChecked = function(checked) {
	if (checked != this.checked_) {
		this.checked_ = checked;
		if (this.element_) {
			this.element_.firstChild.checked = checked;
		}
		if (checked && this.getParent()) {
			this.getParent().setCheckedItem(this);
		}
	}
};

exa.ui.Radio.prototype.isChecked = function() {
	return this.checked_;
};

exa.ui.Radio.prototype.createDom = function() {
	var wrapper = exa.dom.createDom('div'),
		radio;
	wrapper.style.cssText = 'cursor:pointer;';
	this.element_ = wrapper;
	
	radio = exa.dom.createDom('input', {
		type:'radio',
		value: this.value_
	});
	wrapper.appendChild(radio);
	wrapper.appendChild(document.createTextNode(this.label_));
	
	if (this.checked_) {
		radio.checked = true;
	}
};

exa.ui.Radio.prototype.enterDocument = function() {
	exa.ui.Radio.superClass_.enterDocument.call(this);	
	this.get$element().click($.proxy(this.onClick_, this));
	/* Because IE SUX */
	this.element_.firstChild.checked = this.checked_;
};

exa.ui.Radio.prototype.onClick_ = function (e) {
	this.setChecked(true);
};