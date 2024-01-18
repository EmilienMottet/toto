function Dashboard(dashboardId, chartsConfigs, options, messages) {
	this.dashboardId = dashboardId;
	this.chartsConfigs = chartsConfigs;
	this.$chart = $('#chart_' + this.dashboardId);
	this.$popup = $('#popup_' + this.dashboardId);
	this.$popupOverlay = $('#popupOverlay_' + this.dashboardId);
	this.$spinner = this.$chart.parent().parent();

	this.userPrefs = [];
	this.baseUrl = options.baseUrl || '/';
	this.isUserConnected = options.isUserConnected || false;
	this.storageType = options.storageType || 'cookie';
	this.nbCategories = options.nbCategories || null;
	this.displayOthers = true;
	this.chartHeight = options.chartHeight;

	this.messages = messages;

	/* FIXME: should be dynamic */
	this.defaultChartId = 'pieChart';

	/* precalculate various chart width */
	var marginSize = 5;
	var borderSize = 2;
	this.chartWidth = {};
	this.nbColumns = options.nbColumns || 1;
	for (var i = 1; i <= this.nbColumns; i++) {
		var totalWidth = options.chartWidth != '' ? options.chartWidth : this.$chart.width();
		totalWidth = totalWidth - marginSize * (this.nbColumns - 1) - 1; /* minus margin */
		this.chartWidth[i] = i * (parseInt(totalWidth / this.nbColumns) - borderSize) + (i - 1) * marginSize;
	}
	this.buildPopup();
}

/*
 * Events
 */

Dashboard.prototype.onFacetChange = function(e) {
	e.data._this.$popup.find('input[name=chartTitle]').val($(this).val());
};

Dashboard.prototype.doEditChart = function(e) {
	var _this = e.data._this;
	var $li = e.data.$li;

	var validate = _this.validatePopup();
	if (validate.isValid == true) {
		var idx = _this.$chart.find('> li').index($li);
		if (idx != -1) {
			_this.userPrefs[idx] = validate.values;
			_this.saveUserPrefs();
			_this.editChart(validate.values, $li);
			_this.doClosePopup(e);
		}
	}
};

Dashboard.prototype.doRemoveChart = function(e) {
	var _this = e.data._this;
	var $li = e.data.$li;

	var idx = _this.$chart.find('> li').index($li);
	if (idx != -1) {
		_this.userPrefs.splice(idx, 1);
		_this.saveUserPrefs();

		if (_this.userPrefs.length == 0) {
			_this.showEmpty();
		} else {
			$li.parent().find('li.chart').each(function(i, elem) {
				$(elem).data('chartId', i + 1);
			});
		}
	}
	$li.remove();
	_this.doClosePopup(e);
};

Dashboard.prototype.doAddNewChart = function(e) {
	var _this = e.data._this;

	var validate = _this.validatePopup();
	if (validate.isValid == true) {
		_this.userPrefs.push(validate.values);
		_this.saveUserPrefs();
		_this.createChart(_this.userPrefs.length, validate.values);
		_this.doClosePopup(e);

		if (_this.userPrefs.length == 1) {
			_this.removeEmpty();
		}
	}
};

/*
 * Dashboard Init
 */

Dashboard.prototype.construct = function() {
	if (this.storageType == 'cookie') {
		this.userPrefs = $.evalJSON($.cookie('dashboard_userPrefs_' + this.dashboardId) || '[]');
		this._construct();
	} else if (this.storageType == 'storage') {
		if (this.isUserConnected == true) {
			if (this.storageClient == null) {
				this.storageClient = new StorageClient('user', this.baseUrl + 'storage');
			}
			this.$spinner.showSpinner({overlay: true});
			var _this = this;
			this.storageClient.get('dashboard', function(data) {
				if (data != null && data.length > 0) {
					_this.userPrefs = $.evalJSON(data[0].value);
				}
				_this.$spinner.hideSpinner(false);
				_this._construct();
			}, function() {
				_this.$spinner.hideSpinner(false);
				_this._construct();
			});
		} else {
			this.showMessage('mustBeConnected');
			this._construct();
		}
	} else {
		this.showMessage('configurationIncorrect');
		this._construct();
	}
};

Dashboard.prototype._construct = function() {

	var nbUserPrefs = this.userPrefs.length;
	if (nbUserPrefs > 0) {
		for (var i = 0; i < nbUserPrefs; i++) {
			this.createChart(i + 1, this.userPrefs[i]);
		}
	} else {
		this.showEmpty();
	}

	$('#options_' + this.dashboardId).bind('click', {
		_this: this,
		popupTitle: this.messages.popupTitleDashboard,
		chartFacetPath: null,
		chartId: this.defaultChartId,
		chartTitle: null,
		chartWidth: null,
		nbCategories: this.nbCategories,
		displayOthers: this.displayOthers
	}, this.openPopup);

	var _this = this;
	this.$chart.sortable({
		placeholder: 'chartShadow',
		forcePlaceholderSize: true,
		handle: 'div.widgetHeader',
		containment: this.$chart,
		start: function(event, ui) {
			var $item = $(ui.item[0]);
			var $placeholder = $(this).find('.chartShadow');
			$placeholder.css('width', $item.css('width'));
			$placeholder.css('height', $item.css('height'));
		},
		update: function(event, ui) {
			var newPrefs = [];
			$(this).find('li.chart').each(function(i, elem) {
				newPrefs.push(_this.userPrefs[$(elem).data('chartId') - 1]);
				$(elem).data('chartId', i + 1);
			});
			_this.userPrefs = newPrefs;
			_this.saveUserPrefs();
		}
	}).disableSelection();
};

/*
 * User Preferences
 */

Dashboard.prototype.saveUserPrefs = function() {
	if (this.storageType == 'cookie') {
		$.cookie('dashboard_userPrefs_' + this.dashboardId, $.toJSON(this.userPrefs));
	} else if (this.storageType == 'storage' && this.isUserConnected == true) {
		var _this = this;
		this.$spinner.showSpinner();
		this.storageClient.set('dashboard', $.toJSON(this.userPrefs), function(data) {
			_this.$spinner.hideSpinner(false);
		}, function() {
			_this.$spinner.hideSpinner(false);
		});
	}
};

/*
 * Popup management
 */

Dashboard.prototype.buildPopup = function() {
	var first = true;
	var $selectChartFacetPath = this.$popup.find('select[name=chartFacetPath]');
	for (var catego in this.chartsConfigs) {
		if (this.chartsConfigs.hasOwnProperty(catego)) {
			if (first) {
				var $tableChartIds = this.$popup.find('.chartIds');
				for (var chartId in this.chartsConfigs[catego]) {
					if (this.chartsConfigs[catego].hasOwnProperty(chartId)) {
						var chartConfig = this.chartsConfigs[catego][chartId];
						$tableChartIds.append('' +
							'<tr>' +
								'<td>' + '<input type="radio" id="radio_' + this.dashboardId + '_' + chartId + '" name="chartId" value="' + chartConfig.opts.chartName + '" ' + (first ? "checked=checked" : "") + ' />' + '</td>' +
								'<td>' + '<img src="' + chartConfig.opts.chartImage + '" />' + '</td>' +
								'<td><label for="radio_' + this.dashboardId + '_' + chartId + '">' + chartConfig.opts.chartDisplayName + '</label></td>' +
							'</tr>');
					}
				}
				first = false;
			}
			$selectChartFacetPath.append('<option>' + catego + '</option>');
		}
	}

	var $chartWidth = this.$popup.find('select[name=chartWidth]');
	if (this.nbColumns > 1) {
		for (var i = 1; i <= this.nbColumns; i++) {
			$chartWidth.append('<option value="' + i + '">' + i + ' column' + (i > 1 ? 's' : '') + '</option>');
		}
	} else {
		$chartWidth.parent().hide();
	}

};

Dashboard.prototype.openPopup = function(e) {
	var _this = e.data._this;
	var $window = $(window);

	if ($('body').hasClass('ie6')) {
		_this.$popupOverlay.css('position', 'absolute');
		_this.$popupOverlay.css('top', $window.scrollTop());
	}
	_this.$popupOverlay.css('height', $window.height());
	_this.$popupOverlay.css('width', $window.width());
	_this.$popupOverlay.show();

	_this.$popup.find('h3.popupTitle').html(e.data.popupTitle || '');
	if (e.data.chartFacetPath) {
		_this.$popup.find('select[name=chartFacetPath]').val(e.data.chartFacetPath);
	}
	_this.$popup.find('input[name=chartId]').attr('checked', '');
	_this.$popup.find('input[name=chartId][value=' + e.data.chartId + ']').attr('checked', 'checked');
	_this.$popup.find('input[name=chartTitle]').val(e.data.chartTitle || _this.$popup.find('select[name=chartFacetPath]').val());
	_this.$popup.find('input[name=chartCategories]').val(e.data.nbCategories || '');
	_this.$popup.find('input[name=chartOthers]').attr('checked', e.data.displayOthers ? 'checked' : '');
	_this.$popup.find('select[name=chartWidth]').val(e.data.chartWidth || 1);
	_this.$popup.find('div.wrapper').removeClass('error');

	_this.$popup.show();

	if (e.data.edit) {
		_this.$popup.find('button.doEditChart').show().bind('click', { _this: _this, $li: $(this).closest('li') }, _this.doEditChart);
		_this.$popup.find('button.doRemoveChart').show().bind('click', { _this: _this, $li: $(this).closest('li') }, _this.doRemoveChart);
		_this.$popup.find('button.doAddNewChart').hide();
	} else {
		_this.$popup.find('button.doEditChart').hide();
		_this.$popup.find('button.doRemoveChart').hide();
		_this.$popup.find('button.doAddNewChart').show().bind('click', { _this: _this }, _this.doAddNewChart);
	}

	_this.$popup.find('button.doClosePopup').bind('click', { _this: _this }, _this.doClosePopup);
	_this.$popup.find('select[name=chartFacetPath]').bind('change', { _this: _this }, _this.onFacetChange);

	return false;
};

Dashboard.prototype.doClosePopup = function(e) {
	var _this = e.data._this;

	_this.$popup.find('button.doEditChart').unbind('click', _this.doEditChart);
	_this.$popup.find('button.doRemoveChart').unbind('click', _this.doRemoveChart);
	_this.$popup.find('button.doAddNewChart').unbind('click', _this.doAddNewChart);
	_this.$popup.find('button.doClosePopup').unbind('click', _this.doClosePopup);
	_this.$popup.find('select[name=chartFacetPath]').unbind('change', _this.onFacetChange);
	_this.$popup.hide();

	_this.$popupOverlay.hide();
};

Dashboard.prototype.validatePopup = function() {

	/* get inputs */
	var chartFacetPath = this.$popup.find('select[name=chartFacetPath]');
	var chartId = this.$popup.find('input[name=chartId]:checked');
	var chartTitle = this.$popup.find('input[name=chartTitle]');
	var chartCategories = this.$popup.find('input[name=chartCategories]');
	var chartOthers = this.$popup.find('input[name=chartOthers]');
	var chartWidth = this.$popup.find('select[name=chartWidth]');

	/* validate */
	var isValid = true;
	if (chartTitle.val() == undefined || chartTitle.val() == '') {
		chartTitle.parent().addClass('error');
		isValid = false;
	} else {
		chartTitle.parent().removeClass('error');
	}

	if (chartCategories.val() != undefined && chartCategories.val() != '' && isNaN(parseInt(chartCategories.val()))) {
		chartCategories.parent().addClass('error');
		isValid = false;
	} else {
		chartCategories.parent().removeClass('error');
	}

	return {
		isValid: isValid,
		values: {
			path: chartFacetPath.val(),
			chartId: chartId.val(),
			title: chartTitle.val(),
			width: chartWidth.val(),
			nbCategories: chartCategories.val(),
			displayOthers: chartOthers.is(':checked')
		}
	};
};

/*
 * Charts management
 */

Dashboard.prototype.createChart = function(chartId, chartConfig) {
	var $li = $('' +
		'<li class="chart" style="width:' + this._getChartWidth(chartConfig) + 'px;">' +
			'<div class="widgetHeader secondary">' +
				'<div class="options">' +
					'<a href="#" name="switchDisplay">' + this.messages.showData + '</a>' +
					'<a href="#" name="editChart">' + this.messages.edit + '</a>' +
				'</div>' +
				'<h3></h3>' +
			'</div>' +
			'<div class="widgetContent not-top">' +
				'<div class="chart" style="height:' + this.chartHeight + 'px;"></div>' +
			'</div>' +
		'</li>');

	$li.data('chartId', chartId);
	this.$chart.append($li);
	this.drawChart(chartConfig, $li);

	$li.find('a[name=editChart]').bind('click', {
		_this: this,
		edit: true,
		popupTitle: this.messages.popupTitleChart,
		chartFacetPath: chartConfig.path,
		chartId: chartConfig.chartId,
		chartTitle: chartConfig.title,
		chartWidth: chartConfig.width,
		nbCategories: chartConfig.nbCategories || this.nbCategories,
		displayOthers: chartConfig.displayOthers
	}, this.openPopup);

	$li.find('a[name=switchDisplay]')
		.bind('click', { _this: this, $li: $li }, this.switchDisplay)
		.toggle(chartConfig.chartId != 'tableChart');
};

Dashboard.prototype.editChart = function(chartConfig, $li) {
	this.drawChart(chartConfig, $li);

	$li.find('a[name=editChart]').bind('click', {
		_this: this,
		edit: true,
		popupTitle: this.messages.popupTitleChart,
		chartFacetPath: chartConfig.path,
		chartId: chartConfig.chartId,
		chartTitle: chartConfig.title,
		chartWidth: chartConfig.width,
		nbCategories: chartConfig.nbCategories || this.nbCategories,
		displayOthers: chartConfig.displayOthers
	}, this.openPopup);

	$li.find('a[name=switchDisplay]')
		.toggle(chartConfig.chartId != 'tableChart')
		.html(this.messages.showData)
		.removeData('previous');
};

Dashboard.prototype.drawChart = function(chartConfig, $li) {

	/* DOM update */
	$li.find('h3').html(chartConfig.title);
	$li.css('width', this._getChartWidth(chartConfig));

	/* Graph update */

	var $chart = $li.find('div.chart');
	if (this.chartsConfigs[chartConfig.path] != null) {
		var chartOptions = this.chartsConfigs[chartConfig.path][chartConfig.chartId] || this.chartsConfigs[chartConfig.path][this.defaultChartId];

		chartOptions.opts.chart.renderTo = $chart.get(0);
		chartOptions.opts.chart.width = $chart.width();
		chartOptions.opts.nbMaxCategories = chartConfig.nbCategories;
		chartOptions.opts.displayOthers = chartConfig.displayOthers;

		highCharts.create({
			$widget: $li,
			$chartContainer: $li,
			opts: chartOptions.opts,
			$insertRefinementsBefore: $li.find('div.chart')
		});
	} else {
		$chart.html('<div class="no-data">' + this.messages.noData + '</div>');
	}
};

Dashboard.prototype.switchDisplay = function(e) {
	var _this = e.data._this;
	var $li = e.data.$li;

	var idx = _this.$chart.find('> li').index($li);
	if (idx != -1) {
		var $link = $(this);
		if ($link.data('previous') == null) {
			_this.drawChart($.extend({}, _this.userPrefs[idx], { chartId: 'tableChart' }), $li);
			$link.data('previous', true).html(_this.messages.showChart);
		} else {
			_this.drawChart(_this.userPrefs[idx], $li);
			$link.removeData('previous').html(_this.messages.showData);
		}
	}

	return false;
};

Dashboard.prototype._getChartWidth = function(chartConfig) {
	var chartWidth = chartConfig.width || 1;
	if (this.chartWidth[chartWidth] != undefined) {
		return this.chartWidth[chartWidth];
	}
	return this.chartWidth[1];
};

/* Message display */

Dashboard.prototype.showMessage = function(msg) {
	this.$chart.closest('.widgetContent').prepend('' +
		'<div class="message">' + this.messages[msg] + '</div>'
	);
};

Dashboard.prototype.showEmpty = function() {
	this.$chart.parent().prepend('<div class="no-data">' + this.messages.noGraph + '</div>');
};

Dashboard.prototype.removeEmpty = function() {
	this.$chart.parent().find(' > .no-data').remove();
};
