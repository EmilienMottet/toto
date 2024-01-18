(function($) {

	$.fn.dataTableExt.oSort['formatted-number-asc'] = function(a,b) {

		/* Remove any commas (assumes that if present all strings will have a fixed number of d.p) */
		var x = a == "-" ? 0 : a.replace( /,|\s|\./g, "" );
		var y = b == "-" ? 0 : b.replace( /,|\s|\./g, "" );

		/* Parse and return */
		x = parseFloat( x );
		y = parseFloat( y );
		return x - y;
	};

	$.fn.dataTableExt.oSort['formatted-number-desc'] = function(a,b) {

		/* Remove any commas (assumes that if present all strings will have a fixed number of d.p) */
		var x = a == "-" ? 0 : a.replace( /,|\s|\./g, "" );
		var y = b == "-" ? 0 : b.replace( /,|\s|\./g, "" );

		/* Parse and return */
		x = parseFloat( x );
		y = parseFloat( y );
		return y - x;
	};

	$.fn.dataTableForJson = function(tableAsJson, translation) {
		this.dataTable({
			"aaSorting": tableAsJson.sort,
			"aaData": tableAsJson.data,
			"aoColumns": tableAsJson.columns,
			"asStripClasses": ["odd hit hover", "even hit hover"],
			"bFilter": tableAsJson.config.bFilter,
			"bSortClasses": false,
			"bLengthChange": false,
			"iDisplayLength": tableAsJson.config.iDisplayLength,
			"sPaginationType": "full_numbers",
			"bAutoWidth": false,
			"oLanguage": translation,
			"sDom": 'ft<"tableFooter"i' + (tableAsJson.config.iDisplayLength >= tableAsJson.data.length ? '' : 'p') + '>',
			"fnRowCallback": function(nRow, aData, iDisplayIndex) {
				/* apply the class of the link to the tr */
				var linkClass = $(nRow).children().first().children().attr("class");
				if (!$(nRow).hasClass(linkClass)) $(nRow).addClass(linkClass);
				return nRow;
			},
			"fnInitComplete": function(oSettings) {
				if (tableAsJson.config.bTitle == false) {
					$(oSettings.nTHead).remove();
				}
				if (tableAsJson.config.bTotal == true) {
					var dataFooter = tableAsJson.footer;
					for (var i = 0; i < dataFooter.length; ++i) {
						var nTh = i == 0 ? document.createElement('th') : document.createElement('td');
						nTh.innerHTML = dataFooter[i];
						if (oSettings.aoColumns[i].sClass !== null) {
							nTh.className = oSettings.aoColumns[i].sClass;
						}
						oSettings.nTFoot.getElementsByTagName('tr')[0].appendChild(nTh);
					}
				}
			}
		});
	};
})(jQuery);
