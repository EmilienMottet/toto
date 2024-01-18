
var AlertingModel = function (baseUrl) {
	this.baseUrl = baseUrl;
	this.state = AlertingModel.State.NEW;  
};

exa.inherit(AlertingModel, exa.util.KVOObject);
exa.util.KVOObject.addProperty(AlertingModel, 'groups');
exa.util.KVOObject.addProperty(AlertingModel, 'alerts');
exa.util.KVOObject.addProperty(AlertingModel, 'state');

AlertingModel.State = {
	NEW:0,
	LOADING:1,
	OK:2,
	ERROR:3
};

AlertingModel.getInstance = function (baseUrl) {
	if (!AlertingModel.instance_) {
		AlertingModel.instance_ = new AlertingModel(baseUrl);
	}
	return AlertingModel.instance_;
};

AlertingModel.prototype.init = function () {
	if (this.getState() == AlertingModel.State.NEW) {
		this.sendGetAlerts();
	}
};

AlertingModel.prototype.sendGetAlerts = function (success, error) {
	this.setState(AlertingModel.State.LOADING);
	var self = this;
	$.ajax({
		url : this.baseUrl+'alerting/get',
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
			self.setGroups(data.groups);
			self.setAlerts(data.alerts);
			self.setState(AlertingModel.State.OK);
			if (typeof success == 'function') {
				success();
			}
		},
		error: function () {
			self.setState(AlertingModel.State.ERROR);
			if (typeof error == 'function') {
				error();
			}
		},
		type: "GET",
		cache:false
	});
};

AlertingModel.prototype.sendAddAlert = function (alert, success, error) {
	var self = this;
	$.ajax({
		url : this.baseUrl+'alerting/add',
		dataType : "json",
		success: function () {
			 self.sendGetAlerts();
			 if (typeof success == 'function') {
			 	success();
			 }
		},
		error: error,
		dataFilter: function(data, type){
			// check if data is empty and create blank object if needed
			// MercuryRefs:#27688
			if(!$.trim(data)){
				data = "{}";
			}
			return data;
		},
		type : "POST",
		data:alert
	});
};

AlertingModel.prototype.sendEditAlert = function (alert, success, error) {
	var self = this;
	$.ajax({
		url : this.baseUrl+'alerting/edit',
		dataType : "json",
		success: function () {
			 self.sendGetAlerts();
			 if (typeof success == 'function') {
			 	success();
			 }
		},
		error: error,
		dataFilter: function(data, type){
			// check if data is empty and create blank object if needed
			// MercuryRefs:#27688
			if(!$.trim(data)){
				data = "{}";
			}
			return data;
		},
		type : "POST",
		data:alert
	});
};

AlertingModel.prototype.sendDeleteAlert = function (key, success, error) {
	var self = this;
	$.ajax({
		url : this.baseUrl+'alerting/delete',
		dataType : "json",
		success: function () {
			 self.sendGetAlerts();
			 if (typeof success == 'function') {
			 	success();
			 }
		},
		error: error,
		dataFilter: function(data, type){
			// check if data is empty and create blank object if needed
			// MercuryRefs:#27688
			if(!$.trim(data)){
				data = "{}";
			}
			return data;
		},
		type : "GET",
		data : "key="+key
	});
};