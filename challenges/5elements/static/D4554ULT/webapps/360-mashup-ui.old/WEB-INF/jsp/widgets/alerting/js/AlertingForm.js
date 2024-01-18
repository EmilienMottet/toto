var AlertingForm = function (id, model) {
	this.id = id;	
	this.model = model;
	this.ctx_ = new exa.util.Context(this);
	this.defaultGroups = [];
};

AlertingForm.prototype.observeValueForKey = function (key, obj) {
	switch (key) {
	case 'groups':
		var groups = obj.getGroups(),
			$li,
			groupName,
			groupDescription;
		this.$formGroups.empty();
		
		if (groups.length == 0) {
			this.$errorGroups.show();
		} else {
			this.$errorGroups.hide();
			this.defaultGroups.length = 0;
			for (var i = 0; i < groups.length; i++) {
				groupName = groups[i].name;
				groupDescription = groups[i].description;
				$li = $('<li><input type="checkbox" name="groups" value="'+groupName+'"/>'+groupName+'</li>');
				if (groupDescription && groupDescription.length > 0) {
					AlertingTooltip.create($li, groupDescription);
				}
				this.$formGroups.append($li);
				if (groups[i].isUseAsDefault) {
					this.defaultGroups.push(groupName);
				}
			}
		}
		break;
	case 'state':
		if (obj.getState() == AlertingModel.State.ERROR) {
			this.$errorGroups.show();
		}
	}
};

AlertingForm.prototype.setOnCloseListener = function (listener) {
	this.onCloseListener_ = listener;
};

AlertingForm.prototype.triggerOnClose_ = function () {
	if (typeof this.onCloseListener_ == 'function') {
		this.onCloseListener_(this);
	}
};

AlertingForm.prototype.decorate = function () {
	this.$durtyHiddenLayer = $('#alerting-form-layer-'+this.id);
	this.$form = $('#alerting-form-'+this.id);
	this.$formGroups = $('#alerting-form-groups-'+this.id);
	this.$errorSave = $('#alerting-form-error-save-'+this.id);
	this.$errorGroups = $('#alerting-form-error-groups-'+this.id);
	
	this.$form.submit(this.ctx_.f(this.onSubmit));
	
	$(this.$form[0].cancel).click(this.ctx_.f(this.onCancel));
	
	// prevent the form to auto close when clicking in it on IE
	this.$form.click(function (e) { e.stopPropagation(); });
	// close the form when you click outside
	this.$durtyHiddenLayer.click(this.ctx_.f(this.onCancel));
	
	this.model.addObserverForKey(this, 'groups');
	this.model.addObserverForKey(this, 'state');
};

AlertingForm.prototype.open = function(extraCss, alert) {
	if (extraCss) {
		this.$form.css(extraCss);
	}
	
	var form = this.$form[0];
	alert = alert || {
		groups : this.defaultGroups
	};
	if (form.key) {
		form.key.value = alert.key || '';
	}
	
	form.name.value = alert.name || '';
	form.description.value = alert.description || '';
	
	var groupInputs = [];
	// Get 'groups' inputs from the form so we test if there are no 'groups', 1 'groups' or many 'groups'
	if (form.groups) {
		if (form.groups.length) {
			for (var i = 0; i < form.groups.length; i ++) {
				groupInputs.push(form.groups[i]);
				form.groups[i].checked = false;
			}
		}
		else {
			groupInputs.push(form.groups);
			form.groups.checked = false;
		}
	}
	var alertGroups = alert.groups;
	if (alertGroups && alertGroups.length) {
		for (var i = 0; i < groupInputs.length; i ++) {
			for (var j = 0; j < alertGroups.length; j ++) {
				if (groupInputs[i].value == alertGroups[j]) {
					groupInputs[i].checked = true;
					break;
				}
			}
		}
	}
	// remove error classes
	$(form.elements.name).removeClass('formError');
	this.$formGroups.removeClass('formError');
	this.$errorSave.hide();
	this.$durtyHiddenLayer.show();
	this.$form.show();
};

AlertingForm.prototype.close = function () {
	this.$durtyHiddenLayer.hide();
	this.$form.hide();
	this.triggerOnClose_();	
};

AlertingForm.prototype.onCancel = function () {
	this.close();
};

AlertingForm.prototype.onSubmit = function (e) {
	var form = this.$form[0],
		groupList = [],
		validated = true;
	
	// Get 'groups' inputs from the form so we test if there are no 'groups', 1 'groups' or many 'groups'
	var groups = exa.ui.forms.getValue(form, 'groups');
	
	if (groups) {
		groupList = typeof groups == 'string' ? [groups] : groups;    
	}
	
	var key = exa.ui.forms.getValue(form, 'key');
	var alert = {
		name:exa.ui.forms.getValue(form, 'name'),
		description:exa.ui.forms.getValue(form, 'description'),
		groups:groupList.join(',')
	};
	
	if (alert.name.length == 0) {
		validated = false;
		$(form.elements.name).addClass('formError');
	} else {
		$(form.elements.name).removeClass('formError');
	}
	
	if (alert.groups.length == 0) {
		validated = false;
		this.$formGroups.addClass('formError');
	} else {
		this.$formGroups.removeClass('formError');
	}
	
	if (validated) {		
		if (key == null) {
			alert.uiLevelQueryArgs = exa.ui.forms.getValue(form, 'uiLevelQueryArgs');
			alert.page = exa.ui.forms.getValue(form, 'page');
			this.sendAddAlert(alert);
		} else {
			alert.key = key;
			this.sendEditAlert(alert);
		}
	}
	
	e.preventDefault();
	e.stopPropagation();	
	return false;
};

AlertingForm.prototype.sendAddAlert = function (alert) {
	this.model.sendAddAlert(alert, this.ctx_.f(this.onAlertChangedSuccess), this.ctx_.f(this.onAlertChangedError));
};

AlertingForm.prototype.sendEditAlert = function (alert) {
	this.model.sendEditAlert(alert, this.ctx_.f(this.onAlertChangedSuccess), this.ctx_.f(this.onAlertChangedError));
};

AlertingForm.prototype.onAlertChangedSuccess = function (data, textStatus, jqXHR) {
	this.close();
};

AlertingForm.prototype.onAlertChangedError = function (jqXHR, textStatus, errorThrown) {
	this.$errorSave.show();
};

var AlertingTooltip = function () {
	this.$container = $('<div>');
	this.$container.css('position', 'absolute');
	this.$container.css('zIndex', '100');	
	this.$container.addClass('alerting-form-groups-tooltip');
	this.currentContent_ = null;
};

AlertingTooltip.prototype.open = function (event, content) {
	this.close(this.currentContent_);
	
	this.$container.html(content);	
	$(document.body).append(this.$container);	
	this.currentContent_ = content;
	
	this.move(event, content);
};

AlertingTooltip.prototype.move = function (event, content) {
	if (content == this.currentContent_) {
		this.$container.css({
			left : event.pageX + 10,
			top : event.pageY + 10
		});
	}
};

AlertingTooltip.prototype.close = function (content) {
	if (content == this.currentContent_) {
		this.$container.remove();
	}
};

AlertingTooltip.prototype.create = function (element, content) {
	var $element = $(element);
	var self = this;
	$element.mouseenter(function (e) {	
		self.open(e, content);		
		$element.mousemove(function (e) {	
			self.move(e, content);
		});
	});
	
	$element.mouseleave(function () {
		self.close(content);		
		$element.unbind('mousemove');
	});
};


AlertingTooltip.getInstance = function ()  {
	if(!AlertingTooltip.instance_) {
		AlertingTooltip.instance_ = new AlertingTooltip();
	}
	return AlertingTooltip.instance_;
};

AlertingTooltip.create = function (element, content) {
	AlertingTooltip.getInstance().create(element, content);
};