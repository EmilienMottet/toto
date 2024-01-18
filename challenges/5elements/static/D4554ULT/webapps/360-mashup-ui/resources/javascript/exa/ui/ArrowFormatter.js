exa.provide('exa.ui.ArrowFormater');

exa.ui.ArrowFormater = function (base) {
	this.base = base;
};

exa.ui.ArrowFormater.prototype.format = function(dataTable, columnIndex) {
	var style,
		v;
	
	for (var rowIndex = 0; rowIndex < dataTable.getNumberOfRows(); rowIndex++) {
		v = dataTable.getValue(rowIndex, columnIndex);
		if (v > this.base) {
			style = dataTable.getProperty(rowIndex, columnIndex, 'className');
			dataTable.setProperty(rowIndex, columnIndex, 'className', style+' up');
		} else if (v < this.base){
			style = dataTable.getProperty(rowIndex, columnIndex, 'className');
			dataTable.setProperty(rowIndex, columnIndex, 'className', style+' down');
		}
	}
};