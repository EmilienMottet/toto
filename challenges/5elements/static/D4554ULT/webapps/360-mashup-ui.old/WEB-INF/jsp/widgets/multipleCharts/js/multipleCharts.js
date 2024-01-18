var MultipleCharts = {
	load: function(args) {
		if(args.$chartContainer_ucssid == null){
			throw '$chartContainer ucssid cannot be null';
		}
		if (args.$widget == null) {
			throw '$widget cannot be null';
		}
		if (args.$chartContainer == null) {
			throw '$chartContainer cannot be null';
		}
		if (args.charts == null) {
			throw 'charts cannot be null';
		}
		if (args.charts.length == 0) {
			return;
		}

		/*
		  keep support of old options 'defaultChartName' that
		  can't work with multiple time the same chart
		*/

		var defaultChartIdx = 0;
		if (args.defaultChartName != null) {
		    var idx = args.charts.length;
		    while (--idx) {
		        if (args.charts[idx].opts.chartName == args.defaultChartName) {
		            defaultChartIdx = idx;
		            break;
		        }
		    }
		}
		if (args.defaultChartIdx != null) {
		    defaultChartIdx = args.defaultChartIdx;
		}

		if (defaultChartIdx < 0 || defaultChartIdx > args.charts.length) {
			defaultChartIdx = 0;
        }

		var $divMenu = $('<div class="menu"></div>');
		var $select = $('<select class="select7"></select>');

		$select.bind('change', {
			$chartContainer_ucssid: args.$chartContainer_ucssid,
			$widget:args.$widget,
			$chartContainer:args.$chartContainer
		}, MultipleCharts.redraw);
		
		var states = loadStates();
		
		
		for (var i = 0 ; i < args.charts.length; i++) {
			var chart = args.charts[i];

			var chartDisplayName = chart.opts.chartDisplayName;
			if (chart.opts.chartTitle != undefined && chart.opts.chartTitle.length > 0) {
				chartDisplayName = chart.opts.chartTitle + ' (' + chartDisplayName  + ')';
			}

			var $option = $('<option data-icon="'+chart.opts.chartImage+'" value="' + chart.opts.chartName + '_' + i + '">' + chartDisplayName + '</option>');
			$option.data('chart', chart);
			$option.attr('title', chart.opts.chartImage);
			var name = args.$chartContainer_ucssid;
			if (states != null && states[name] != undefined) {
				if(i == states[name]){
					$option.attr('selected', 'selected');
					defaultChartIdx = i;
				}
				
			}else{
				if (i == defaultChartIdx) {
				    $option.attr('selected', 'selected');
				}
			}
			$option.appendTo($select);
		}

		$select.appendTo($divMenu);
		args.$chartContainer.closest('.widgetContent').prepend($divMenu);

		$select.select7();
		
		highCharts.create({
			$widget: args.$widget,
			$chartContainer: args.$chartContainer,
			opts: args.charts[defaultChartIdx].opts,
			$insertRefinementsAfter: args.$widget.find('div.menu')
		});
	},

	redraw: function(e) {
		var option_selected = $(this).find('option:selected');
		var option_position = option_selected.index();
		var chart = option_selected.data('chart');
		
		highCharts.create({
			$widget: e.data.$widget,
			$chartContainer: e.data.$chartContainer,
			opts: chart.opts,
			$insertRefinementsAfter: e.data.$widget.find('div.menu')
		});
		var name = e.data.$chartContainer_ucssid;
		saveState(name,option_position);
	}
};

var getCookiePath =  function() {
    var metas = document.getElementsByTagName('meta'); 
    for (i=0; i<metas.length; i++) { 
       if (metas[i].getAttribute('name') == 'baseurl') { 
          return metas[i].getAttribute('content'); 
       } 
    } 
    return '/';
};


var loadStates = function() {
	var value = $.cookie('widget-chartswitcher');
	if (value != undefined) {
		var ret = {};
		var values = value.split('|');
		for (var i = 0; i < values.length; i++) {
			var tmp = values[i].split(';');
			ret[tmp[0]] = tmp[1];
		}
		return ret;
	}
	return null;
};

var saveState = function(key, value) {
	var data = loadStates();
	if (data == null) {
		data = {};
	}

	data[key] = value;

	var tmp = [];
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			tmp.push(key + ';' + data[key]);
		}
	}

	$.cookie('widget-chartswitcher', tmp.join('|'), { expires: 1, path: getCookiePath() });
};
