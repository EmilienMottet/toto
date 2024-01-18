
TableWidget = function (id, data, options) {
	var table = new exa.ui.AdvancedTable(options);
    table.render(document.getElementById(id));
    table.setData(data);
   
    this.options = options;
    this.table = table;  
};

TableWidget.prototype.enableSaveButton = function (isUserConnected, localStorageKey, cookieName, onlyFormatters) {
	var table = this.table,
		self = this,
		saveButton = new exa.ui.Button(exa.dom.createDom('div','advanced-table-save-btn'));
	
    saveButton.setEnabled(false);
    table.toolbar.setVisible(true);
    table.toolbar.addChild(saveButton, true);
    table.bind('configurationChanged', function () {
		saveButton.setEnabled(true);
	});
    saveButton.bind('mouseup', function () {
    	self.hideSaveError();
		saveButton.setEnabled(false);	    
		var data = {
   			formatters : table.getFormatters()
		};
		if (!onlyFormatters) {
			data.columns = table.getColumnIds();
		}
		if (isUserConnected && localStorageKey.length > 0) {
			new StorageClient('user').set(localStorageKey, $.toJSON(data), function (e) {}, function () { self.displaySaveError(); });
		} else {
			$.cookie(cookieName, $.toJSON(data));
		}
    });
};

TableWidget.prototype.enablePermalink = function (wuid, onlyFormatters) {
	var self = this,
		table = this.table,
		permalinkButton = new exa.ui.Button(exa.dom.createDom('div','advanced-table-permalink-btn'));
	
	table.toolbar.setVisible(true);
    table.toolbar.addChild(permalinkButton, true);
		                
    var permalinkValue = new exa.ui.Input('text', mashupI18N.get('advancedTable', 'permalink')+':');
    permalinkValue.enableDelete = false;
    permalinkValue.addClass('advanced-table-permalink');
		table.toolbar.addChild(permalinkValue, true);
		permalinkValue.setVisible(false);
		
		table.bind('configurationChanged', function () {
			permalinkValue.setVisible(false);
			permalinkButton.get$element().fadeOut().fadeIn();
		});
    permalinkButton.bind('mouseup', function () {
		self.hideSaveError();
    	permalinkValue.setVisible(false);
    	var sc = new StorageClient('shared'),
    		data = {
       			formatters : table.getFormatters()
   			};
    	if (!onlyFormatters) {
    		data.columns = table.getColumnIds();
    	}
   		sc.put('AdvancedTableConfigurations[]', $.toJSON(data), function (e) {
   			if (e.length > 0) {
				var url = new BuildUrl(window.location.href),
					split;
				split = e[0].key.split('|');
				url.addParameter(wuid+'_strgkey', split[1], true);
       			permalinkValue.setValue(url.toString());
       			permalinkValue.setVisible(true);
       			permalinkValue.getInput().select();
   			}
    	}, function () { self.displaySaveError();});
    });
};


TableWidget.prototype.loadConfigurationString = function (configurationString) {
	var configuration = $.evalJSON(configurationString);
	if (configuration) {
		this.loadConfiguration(configuration);
	}	
};

TableWidget.prototype.loadConfiguration = function (configuration) {

	if (configuration) {
        if (configuration.formatters) {
        	this.table.setFormatters(configuration.formatters);
        }				
		if (configuration.columns) {
			this.table.setColumnIds(configuration.columns);
		}
		return true;
	}
	return false;
};

TableWidget.prototype.displaySaveError = function () {
	if (!this.errorDiv) {
		this.errorDiv = $('<span class="advancedtable-storage-error">'+mashupI18N.get('advancedTable','save_error')+'</span>');
	 	this.table.toolbar.get$element().append(errorDiv);	                	 	
	}
	this.errorDiv.show();
};

TableWidget.prototype.hideSaveError = function () {
	if (this.errorDiv) {
		this.errorDiv.hide();
	}
};

TableWidget.prototype.bindRedrawFunction = function (showPreview, showThumbnail) {
	var redrawFunc = function () {
		if (showThumbnail) {
			$('img.productThumbnail').smallPreview({ showPreviewLink: false });
		}
		if (showPreview) {
			var containers = [];
			$('a.openPreview').each(function() {
				containers.push($(this).closest('.wuid').get(0));
			});
			$(jQuery.unique(containers)).each(function() {
				$(this).find('a.openPreview').preview();
			});
		}
	};
	this.table.table.bind('redraw', redrawFunc);
	redrawFunc();
};