

function AlertingManagerWidget(ucssid, model, form, i18n) {
	this.id = ucssid;
	this.model = model;
	this.form = form;
	this.i18n = i18n;
	this.ctx_ = new exa.util.Context(this);	
}

AlertingManagerWidget.prototype.observeValueForKey = function (key, obj) {
	switch (key) {
	case 'alerts':
		this.$list.empty();	
		var alerts = obj.getAlerts();
		for (var i = 0; i < alerts.length; i++) {
			this.appendAlert(alerts[i]);		
		}
		break;
	case 'state':
		switch (obj.getState()) {
		case AlertingModel.State.LOADING:
			this.$list.hide();
			this.$content.addClass('alerting-loading');
			this.$error.hide();
			break;
		case AlertingModel.State.OK:
			this.$content.removeClass('alerting-loading');
			this.$error.hide();
			this.$list.show();			
			break;
		case AlertingModel.State.ERROR:			
			this.$content.removeClass('alerting-loading');
			this.$list.hide();
			this.$error.show();
			break;			
		}	
		break;
	}
};

AlertingManagerWidget.prototype.decorate = function () {
	this.$content = $('#alerting-content-'+this.id);
	this.$list = $('#alerting-list-'+this.id);
	this.$error = $('#alerting-error-'+this.id);	
	this.$error.hide();
	this.form.setOnCloseListener(function () {
		$('.alerting-editing').removeClass('alerting-editing');
	});
	this.model.addObserverForKey(this, 'alerts');
	this.model.addObserverForKey(this, 'state');
};


AlertingManagerWidget.alertItemTemplate = '<li><a title="{{tooltipGoTo}}" href="{{gotoUrl}}"><div class="alerting-name">{{name}}</div><div class="alerting-description">{{description}}</div></a><a class="alerting-delete" title="{{tooltipDelete}}" href="#delete"></a><a class="alerting-edit" title="{{tooltipEdit}}" href="#edit"></a></li>';

AlertingManagerWidget.prototype.appendAlert = function(alert) {
	var data = {
		name : alert.name.escapeHTML(),
		description: alert.description ? alert.description.escapeHTML() : '',
		gotoUrl : this.model.baseUrl + 'page/'+alert.page+'?'+alert.uiLevelQueryArgs,
		tooltipGoTo: this.i18n.goTo,
		tooltipEdit: this.i18n.editAlert,
		tooltipDelete: this.i18n.deleteAlert
	};
	var $li = $(exa.util.renderTemplate(AlertingManagerWidget.alertItemTemplate, data));
	$li.find('a').click(this.ctx_.f(function (e) {
		switch (e.currentTarget.className) {
		case 'alerting-edit':
			$(e.currentTarget).addClass('alerting-editing');
			this.editAlert(alert, e.currentTarget);
			return false;
		case 'alerting-delete':
			this.sendDeleteAlert(alert.key);
			return false;
		}
	}));
	
	this.$list.append($li);
};

AlertingManagerWidget.prototype.sendGetAlerts = function () {
	this.model.sendGetAlerts();
};

AlertingManagerWidget.prototype.editAlert = function (alert, target) {
	var parent = $(target).parent();
	var parentOffset = parent.offset();
	
	this.form.open({
		top:parentOffset.top + parent.outerHeight(),
		left:parentOffset.left + parent.outerWidth(true) - 312, // width + padding + border - extrapadding = 300 + 20 + 2 - 10 = 312
		width:300
	}, alert);
	return false;
};

AlertingManagerWidget.prototype.sendDeleteAlert = function (key) {
	this.model.sendDeleteAlert(key);
	return false;
};