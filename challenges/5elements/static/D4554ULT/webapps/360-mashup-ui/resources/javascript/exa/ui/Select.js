exa.provide('exa.ui.Select');

exa.require('exa.ui.Component');

exa.ui.Select = function (label, choices, opt_defaultValue) {
	this.label_ = label;
	this.choices_ = choices;	
	if (exa.isDef(opt_defaultValue)) {
		this.setDefaultValue(opt_defaultValue);
	}
};

exa.inherit(exa.ui.Select, exa.ui.Component);

exa.ui.Select.prototype.enabled_ = true;

exa.ui.Select.prototype.setEnabled = function(enable) {
	if (enable != this.enabled_) {
		this.enabled_ = enable;		
		if (this.isInDocument()) {
			if (enable) {
				this.selectEl_.disabled = '';
			} else {
				this.selectEl_.disabled = 'disabled';
			}
		}
		
	}	
};

exa.ui.Select.prototype.setChoices = function(choices) {
	this.choices_ = choices;	
	if (this.element_) {
		this.populateSelect_();
	}
};

exa.ui.Select.prototype.populateSelect_ = function () {
	var i,
		choices = this.choices_,
		option,
		select = this.selectEl_;
	exa.dom.removeChildren(select);
	if (choices) {
		l = choices.length;
		for (i = 0; i < l; i ++) {
			option = exa.dom.createDom('option', {
				value: choices[i].value
			});
			exa.dom.setTextContent(option, choices[i].text);
			select.appendChild(option);
		}
	}
};

exa.ui.Select.prototype.setDefaultValue = function (defaultValue) {
	this.defaultValue_ = defaultValue;
	if (!exa.isDef(this.value_)) {
		this.value_ = defaultValue;
	}
};

exa.ui.Select.prototype.createDom = function () {
	exa.ui.Select.superClass_.createDom.call(this);
	
	var labelEl,
		select = document.createElement('select');
	
	/* This sux but I hope it will change someday... */
	select.className = 'decorate';
	this.selectEl_ = select;
	
	if (this.label_) {
		labelEl = document.createElement('span');
		exa.dom.setTextContent(labelEl, this.label_);
		this.element_.appendChild(labelEl);
	}
	this.element_.appendChild(select);
	
	if (this.choices_) {
		this.populateSelect_();
	}
	
	if (exa.isDef(this.value_)) {
		select.value = this.value_;
	}
	
	if (!this.enabled_) {
		select.disabled = 'disabled';
	}
};

exa.ui.Select.prototype.enterDocument = function () {
	exa.ui.Select.superClass_.enterDocument.call(this);
	$(this.selectEl_).change($.proxy(this.onChange_, this));
};

exa.ui.Select.prototype.setValue = function(value) {
	this.value_ = value;
	if (this.isInDocument()) {
		this.selectEl_.value = value;
	}
	this.trigger('changed', value);
};

exa.ui.Select.prototype.getValue = function() {
	return this.value_;
};

exa.ui.Select.prototype.reset = function() {
	this.setValue(this.defaultValue_);
};

exa.ui.Select.prototype.onChange_ = function () {
	this.value_ = this.selectEl_.value;
	this.trigger('changed', this.value_);
};