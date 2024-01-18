exa.provide('exa.data.DataTable');

exa.data.DataTable = function (opt_data) {
	this.cols = [];
	this.rows = [];
	
	if (typeof opt_data == 'object') {
		var i;
		if (opt_data.cols && opt_data.cols.length > 0) {
			for (i = 0; i < opt_data.cols.length; i ++) {
				this.addColumn(opt_data.cols[i]);
			}
		}
		if (opt_data.rows && opt_data.rows.length > 0) {
			for (i = 0; i < opt_data.rows.length; i ++) {
				this.addRow(opt_data.rows[i]);
			}
		}
	}
};

exa.data.DataTable.types = ['string', 'number', 'boolean', 'date', 'datetime', 'url'];

exa.data.DataTable.prototype.addColumn = function(type, opt_label, opt_id, opt_formattedLabel) {
	var col, idx;
	if (exa.isUrl(type)) {
		col = {
			id : type.id || '',
			label : type.label || '',
			type: type.type || 'string',
			formattedLabel :  type.formattedLabel || type.label || ''
		};
		
	} else if (exa.isString(type)) {
		col = {
			id : opt_id || '',
			label : opt_label || '',
			type: type || 'string',
			formattedLabel :  opt_formattedLabel || opt_label || ''
		};
	} else {
		col = {
			id : type.id || '',
			label : type.label || '',
			type: type.type || 'string',
			formattedLabel :  type.formattedLabel || type.label || ''
		};
	}
	idx = this.cols.length;
	this.cols.push(col);
	return idx;
};

exa.data.DataTable.prototype.addRow = function (opt_cellArray) {
	if (!opt_cellArray || opt_cellArray.length !== this.cols.length) {
		return;
	}

	var row = [],
		cell,
		p,
		f,
		v,
		l,
		cols = this.cols,
		type;
	
	for(var i = 0; i < opt_cellArray.length; i ++) {
		cell = opt_cellArray[i];
		if (typeof cell === 'object' && !(cell instanceof Date)) {
			f = cell.f;
			p = cell.p;
			v = cell.v;
			l = cell.l;
		} else {
			f = null;
			p = null;
			v = cell;
			l = null;
		}
		
		if (exa.isNumber(v)) {
			type = 'number';
		} else if (exa.isUrl(v)) {
			type = 'url';
		} else if (exa.isString(v)) {
			type = 'string';
		} else if (exa.isBoolean(v)) {
			type = 'boolean';
		// Only "date" can be null
		} else if (v instanceof Date || v == null) {
			type = 'date';
		} else {
			throw 'Type of "' + v + '" is not supported';
		}
		
		if (type != cols[i].type) {
			console.warn('Type detected is : ' + type);
			console.warn('Type in configuration is : ' + cols[i].type);
			console.warn('cells of column '+i+ ' should be typeof ' + type + ' and not ' + cols[i].type);
		}
				
		row[i] = {
			f:f,
			p:p,
			v:v,
			l:l
		};
	}
	this.rows.push(row);
};

exa.data.DataTable.prototype.setProperty = function (rowIndex, columnIndex, name, value) {
	if (!this.rows[rowIndex][columnIndex].p) {
		this.rows[rowIndex][columnIndex].p = {};
	}
	this.rows[rowIndex][columnIndex].p[name] = value;
};

exa.data.DataTable.prototype.getProperty = function (rowIndex, columnIndex, name) {
	return this.rows[rowIndex][columnIndex].p && this.rows[rowIndex][columnIndex].p[name];
};

exa.data.DataTable.prototype.setRowProperty = function (rowIndex, name, value) {
	if (!this.rowProperties) {
		this.rowProperties = [];
	} 
	if (!this.rowProperties[rowIndex]) {
		this.rowProperties[rowIndex] = {};
	}
	this.rowProperties[rowIndex][name] = value;
};

exa.data.DataTable.prototype.getRowProperty = function (rowIndex, name) {
	return this.rowProperties && this.rowProperties[rowIndex] && this.rowProperties[rowIndex][name];
};

exa.data.DataTable.prototype.setColumnProperty = function (columnIndex, name, value) {
	if (!this.columnProperties) {
		this.columnProperties = [];
	} 
	if (!this.columnProperties[columnIndex]) {
		this.columnProperties[columnIndex] = {};
	}
	this.columnProperties[columnIndex][name] = value;
};

exa.data.DataTable.prototype.getColumnProperty = function (columnIndex, name) {
	return this.columnProperties && this.columnProperties[columnIndex] && this.columnProperties[columnIndex][name];
};

/** GETTERS **/
exa.data.DataTable.prototype.getNumberOfColumns = function () {
	return this.cols.length;
};

exa.data.DataTable.prototype.getNumberOfRows = function () {
	return this.rows.length;
};

exa.data.DataTable.prototype.getColumnLabel = function (columnIndex) {
	return this.cols[columnIndex].label;
};

exa.data.DataTable.prototype.getColumnFormattedLabel = function (columnIndex) {
	return this.cols[columnIndex].formattedLabel;
};

exa.data.DataTable.prototype.getColumnId = function (columnIndex) {
	return this.cols[columnIndex].id;
};

exa.data.DataTable.prototype.getColumnIndex = function (id) {
	for (var columnIndex = 0, l = this.cols.length; columnIndex < l; columnIndex ++) {
		if (this.cols[columnIndex].id == id) {
			return columnIndex;
		}
	}
	return -1;
};

exa.data.DataTable.prototype.getColumnType = function (columnIndex) {
	return this.cols[columnIndex].type;
};

exa.data.DataTable.prototype.getValue = function (rowIndex, columnIndex) {
	return this.rows[rowIndex][columnIndex].v;
};

exa.data.DataTable.prototype.getLabel = function (rowIndex, columnIndex) {
	return this.rows[rowIndex][columnIndex].l;
};

exa.data.DataTable.prototype.getFormattedValue = function (rowIndex, columnIndex) {
	return this.rows[rowIndex][columnIndex].f;
};

exa.data.DataTable.prototype.getSortedRows = function (sortColumns) {
	var i;
	
	if (!exa.isArray(sortColumns)) {
		sortColumns = [sortColumns];
	}
	
	for (i = 0; i < sortColumns.length; i ++) {
		if (exa.isNumber(sortColumns[i])) {
			sortColumns[i] = {
				column:sortColumns[i],
				desc:false
			};
		}
	}
	
	var sortedRows = [],
		dataTable = this;
	
	for (i = 0; i < this.getNumberOfRows(); i ++) {
		sortedRows[i] = i;
	}
	
	var compare = function (a, b) {
		var v1, v2, vtmp, col, columnType;
		for(var i = 0; i < sortColumns.length; i++) {
			col = sortColumns[i];
			columnType = dataTable.getColumnType(col.column);
			v1 = dataTable.getValue(a, col.column);
			v2 = dataTable.getValue(b, col.column);
			if (col.desc) {
				vtmp = v1;
				v1 = v2;
				v2 = vtmp;
			}
			if (columnType == 'number' && isNaN(v1)) {
				return -1;
			} else if (columnType == 'number' && isNaN(v2)) {
				return 1;
			} else if (v1 > v2) {
				return 1;
			} else if (v1 < v2) {
				return -1;
			}
		}
		return 0;
	};
	return sortedRows.sort(compare);
};
