exa.provide('exa.data.DataView');

exa.data.DataView = function (dataTable) {
	this.dataTable = dataTable;
	this.cols = [];
	this.rows = [];
	this.fakeCols = [];
	
	var i;
	for (i = 0; i < dataTable.getNumberOfColumns(); i ++) {
		this.cols[i] = i;
	}
	for (i = 0; i < dataTable.getNumberOfRows(); i ++) {
		this.rows[i] = i;
	}
};

exa.data.DataView.prototype.addColumn = function(columnIndex) {
	if (!exa.isNumber(columnIndex)) {
		var col = columnIndex, 
			i = this.cols.length;
		if (!col.type) {
			throw 'type must be defined';
		}
		if (!col.label) {
			col.label = '';
		}
		if (!col.id) {
			col.id = '';
		}
		this.fakeCols[i] = this.generateFakeColumn_(i, col.type, col.calc);		
	}
	
	this.cols.push(columnIndex);
};

exa.data.DataView.prototype.setColumns = function(columnIndexes) {
	if (exa.isNumber(columnIndexes)) {
		columnIndexes =  [columnIndexes];
	}

	for (var i = 0; i < columnIndexes.length; i ++) {
		var col = columnIndexes[i];
		if (!exa.isNumber(col) && exa.isFunction(col.calc)) {
			if (!col.type) {
				throw 'type must be defined';
			}
			if (!col.label) {
				col.label = '';
			}
			if (!col.id) {
				col.id = '';
			}
			if (!col.formattedLabel) {
				col.formattedLabel = col.label;
			}
			this.fakeCols[i] = this.generateFakeColumn_(i, col.type, col.calc);
		} else {
			delete this.fakeCols[i];
		}
		
	}
	
	this.cols = columnIndexes;
	
};

exa.data.DataView.prototype.generateFakeColumn_ = function (columnIndex, type, calc) {
	var fakeColumn = [],
		v;
	
	for (var i = 0; i < this.dataTable.getNumberOfRows(); i ++) {
		v = calc(i, this);		
		if (typeof v != type) {
			throw '"calc" function of column '+columnIndex+ ' must return values with typeof == ' + type + ' and not ' + typeof v;
		}
		
		fakeColumn[i] = {
			v: v,
			f: null,
			p: null
		};
	}
	return fakeColumn;
};

exa.data.DataView.prototype.getViewColumns = function () {
	return this.cols;
};

exa.data.DataView.prototype.getTableColumnIndex = function (viewColumnIndex) {
	return this.cols[viewColumnIndex];
};

exa.data.DataView.prototype.setRows = function(rowIndexes, max) {
	if (exa.isNumber(rowIndexes)) {
		var min = rowIndexes;
		rowIndexes = [];
		var cpt = 0;
		for (var i = min; i < max; i ++) {
			rowIndexes[cpt++] = i;
		}
	}
	this.rows = rowIndexes;
};

exa.data.DataView.prototype.getViewRows = function () {
	return this.rows;
};

exa.data.DataView.prototype.getTableRowIndex = function (viewRowIndex) {
	return this.rows[viewRowIndex];
};


/** GETTERS **/
exa.data.DataView.prototype.getNumberOfColumns = function () {
	return this.cols.length;
};

exa.data.DataView.prototype.getNumberOfRows = function () {
	return this.rows.length;
};

exa.data.DataView.prototype.getColumnLabel = function (columnIndex) {
	var tableColumnIndex = this.getTableColumnIndex(columnIndex);
	if (exa.isNumber(tableColumnIndex)) {
		return this.dataTable.getColumnLabel(tableColumnIndex);
	} else {
		return tableColumnIndex.label;
	}
};

exa.data.DataView.prototype.getColumnFormattedLabel = function (columnIndex) {
	var tableColumnIndex = this.getTableColumnIndex(columnIndex);
	if (exa.isNumber(tableColumnIndex)) {
		return this.dataTable.getColumnFormattedLabel(tableColumnIndex);
	} else {
		return tableColumnIndex.formattedLabel;
	}
};

exa.data.DataView.prototype.getColumnId = function (columnIndex) {
	var tableColumnIndex = this.getTableColumnIndex(columnIndex);
	if (exa.isNumber(tableColumnIndex)) {
		return this.dataTable.getColumnId(tableColumnIndex);
	} else {
		return tableColumnIndex.id;
	}
};

exa.data.DataView.prototype.getColumnIndex = function (id) {
	var curId;
	for (var columnIndex = 0, l = this.cols.length; columnIndex < l; columnIndex ++) {
		if (exa.isNumber(this.cols[columnIndex])) {
			curId = this.dataTable.getColumnId(this.cols[columnIndex]);
		} else {
			curId = this.cols[columnIndex].id;
		}
		if (curId == id) {
			return columnIndex;
		}
	}
	return -1;
};

exa.data.DataView.prototype.getColumnType = function (columnIndex) {
	var tableColumnIndex = this.getTableColumnIndex(columnIndex);
	if (exa.isNumber(tableColumnIndex)) {
		return this.dataTable.getColumnType(tableColumnIndex);
	} else {
		return tableColumnIndex.type;
	}
};

exa.data.DataView.prototype.getValue = function (rowIndex, columnIndex) {
	var tableColumnIndex = this.getTableColumnIndex(columnIndex),
		tableRowIndex = this.getTableRowIndex(rowIndex);
	
	if (exa.isNumber(tableColumnIndex)) {
		return this.dataTable.getValue(tableRowIndex, tableColumnIndex);
	} else {
		return this.fakeCols[columnIndex][tableRowIndex].v;
	}	
};

exa.data.DataView.prototype.getFormattedValue = function (rowIndex, columnIndex) {
	var tableColumnIndex = this.getTableColumnIndex(columnIndex),
		tableRowIndex = this.getTableRowIndex(rowIndex);
	
	if (exa.isNumber(tableColumnIndex)) {
		return this.dataTable.getFormattedValue(tableRowIndex, tableColumnIndex);
	} else {
		return this.fakeCols[columnIndex][tableRowIndex].f;
	}
};

exa.data.DataView.prototype.setProperty = function (rowIndex, columnIndex, name, value) {
	var tableColumnIndex = this.getTableColumnIndex(columnIndex),
		tableRowIndex = this.getTableRowIndex(rowIndex);
	if (exa.isNumber(tableColumnIndex)) {
		this.dataTable.setProperty(this.getTableRowIndex(rowIndex), tableColumnIndex, name, value);
	} else {
		if (!this.fakeCols[columnIndex][tableRowIndex].p) {
			this.fakeCols[columnIndex][tableRowIndex].p = {};
		}
		this.fakeCols[columnIndex][tableRowIndex].p[name] = value;
	}
};

exa.data.DataView.prototype.getProperty = function (rowIndex, columnIndex, name, value) {
	var tableColumnIndex = this.getTableColumnIndex(columnIndex),
		tableRowIndex = this.getTableRowIndex(rowIndex);
	if (exa.isNumber(tableColumnIndex)) {
		return this.dataTable.getProperty(this.getTableRowIndex(rowIndex), tableColumnIndex, name);
	} else {
		return this.fakeCols[columnIndex][tableRowIndex].p && this.fakeCols[columnIndex][tableRowIndex].p[name];
	}
};

exa.data.DataView.prototype.getRowProperty = function (rowIndex, name) {
	return this.dataTable.getRowProperty(rowIndex, name);
};

exa.data.DataView.prototype.setRowProperty = function (rowIndex, name, value) {
	this.dataTable.setRowProperty(rowIndex, name, value);
};

exa.data.DataView.prototype.getColumnProperty = function (columnIndex, name) {
	return this.dataTable.getColumnProperty(this.getTableColumnIndex(columnIndex), name);
};

exa.data.DataView.prototype.setColumnProperty = function (columnIndex, name, value) {
	this.dataTable.setColumnProperty(this.getTableColumnIndex(columnIndex), name, value);	
};

exa.data.DataView.prototype.getSortedRows = function (sortColumns) {	
	var tmpRows = this.rows;
	for (var i = 0; i < this.dataTable.getNumberOfRows(); i ++) {
		this.rows[i] = i;
	}
	var sortedRows = exa.data.DataTable.prototype.getSortedRows.call(this, sortColumns);
	this.rows = tmpRows;
	return sortedRows;
};
