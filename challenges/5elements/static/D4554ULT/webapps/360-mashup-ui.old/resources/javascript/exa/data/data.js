exa.provide('exa.data');

exa.data.domTableToDataTable = function (dom) {
	var $dom = $(dom);
	
	var data = new exa.data.DataTable();
	$dom.find('tr').each(function (iTr, tr) {
		if (iTr == 0) {
			$(tr).find('th').each(function(iTd, td) {
				data.addColumn('string', td.innerHTML);
			});
		} else {
			var row = [];
			$(tr).find('td').each(function(iTd, td) {
				row.push(td.innerHTML);
			});
			data.addRow(row);
		}
	});
	
	return data;
};
