exa.provide('exa.ui.Input');

exa.require('exa.ui.Component');

exa.ui.Input = function (type, opt_label, opt_defaultValue) {
	this.type_ = type || 'text';
	this.label_ = opt_label;		
	if (exa.isDef(opt_defaultValue)) {
		this.setDefaultValue(opt_defaultValue);
	}
};

exa.inherit(exa.ui.Input, exa.ui.Component);

exa.ui.Input.prototype.enabled_ = true;
exa.ui.Input.prototype.enableDelete = true;
exa.ui.Input.prototype.defaultValue_ = '';

exa.ui.Input.prototype.setEnabled = function(enable) {
	if (enable != this.enabled_) {
		this.enabled_ = enable;		
		if (this.isInDocument()) {
			if (enable) {
				this.inputEl_.disabled = '';
			} else {
				this.inputEl_.disabled = 'disabled';
			}
		}		
	}	
};

exa.ui.Input.prototype.setDefaultValue = function (defaultValue) {
	this.defaultValue_ = defaultValue;
	if (!exa.isDef(this.value_)) {
		this.value_ = defaultValue;
	}
};

exa.ui.Input.prototype.createDom = function () {
	exa.ui.Input.superClass_.createDom.call(this);
	
	var labelEl,
		input = exa.dom.createDom('input', {
			type :this.type_
		}),
		deleteButton = null;
	
	this.element_.className = 'exa-input';
	
	/* This sux but I hope it will change someday... */
	input.className = 'decorate';
	
	
	if (this.label_) {
		labelEl = document.createElement('span');
		exa.dom.setTextContent(labelEl, this.label_);
		this.element_.appendChild(labelEl);
	}
	this.element_.appendChild(input);
	
	if (this.enableDelete) {
		deleteButton = exa.dom.createDom('span', 'exa-input-delete');
		exa.dom.setTextContent(deleteButton, 'x');
		this.element_.appendChild(deleteButton);
		this.deleteButton_ = deleteButton;
	}
	
	if (exa.isDef(this.value_)) {
		input.value = this.value_;
	} else if (this.enableDelete) {
		deleteButton.style.display = 'none';
	}
	
	if (!this.enabled_) {
		input.disabled = 'disabled';
	}
	
	this.input_ = input;
};

exa.ui.Input.prototype.enterDocument = function () {
	exa.ui.Input.superClass_.enterDocument.call(this);
	$(this.input_).change($.proxy(this.onChange_, this));
	$(this.input_).keyup($.proxy(function () {
		if (this.enableDelete) {
			if (this.input_.value.length == 0) {
				$(this.deleteButton_).hide();
			} else {
				$(this.deleteButton_).show();
			}
		}
		this.trigger('keyup', arguments);
	}, this));
	
	if (this.enableDelete) {
		$(this.deleteButton_).click($.proxy(function () {
			this.reset();
			$(this.input_).focus();
		}, this));
	}
};

exa.ui.Input.prototype.setValue = function(value) {
	if (!exa.isDef(value)) {
		value = '';
	}
	if (!value && this.enableDelete) {
		$(this.deleteButton_).hide();
	}
	this.value_ = value;
	if (this.isInDocument()) {
		this.input_.value = value;
	}
	this.trigger('changed', value);
};

exa.ui.Input.prototype.getValue = function() {
	/* Because perhaps onchange is not triggered yet */
	this.value_ = this.input_.value;
	return this.value_;
};

exa.ui.Input.prototype.getInput = function() {
	return this.input_;
};

exa.ui.Input.prototype.reset = function() {
	this.setValue(this.defaultValue_);
};

exa.ui.Input.prototype.onChange_ = function () {
	this.value_ = this.input_.value;
	this.trigger('changed', this.value_);
};