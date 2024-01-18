exa.provide('exa.ui.AdvancedTable');

exa.require('exa.dom');
exa.require('exa.ui.Component');
exa.require('exa.data.DataView');
exa.require('exa.ui.Table');
exa.require('exa.ui.PopupMenu');
exa.require('exa.ui.CheckBoxMenuItem');
exa.require('exa.ui.FormatterForm');
exa.require('exa.ui.Formatter');
exa.require('exa.ui.FormatterLegend');

exa.ui.AdvancedTable = function (options) {
	this.options = options;
	this.currentForm_ = null;
};

exa.inherit(exa.ui.AdvancedTable, exa.ui.Component);

exa.ui.AdvancedTable.prototype.setData = function (data) {
	this.data = data;
	this.table.setData(new exa.data.DataView(data));		
	if (this.options.columnFilter && this.getElement()) {
		this.createColumnList();
	}
};

exa.ui.AdvancedTable.prototype.getView = function () {
	return this.table.getData();
};

exa.ui.AdvancedTable.prototype.createDom = function () {
	exa.ui.AdvancedTable.superClass_.createDom.call(this);	
	this.addClass('exa-advancedtable');
	
	this.toolbar = new exa.ui.Component();
	this.toolbar.setVisible(false);
	this.toolbar.addClass('exa-toolbar');
	this.addChild(this.toolbar, true);
	
	this.legend = new exa.ui.FormatterLegend();
	this.addChild(this.legend, true);
	
	this.table = new exa.ui.Table(this.options);
	this.addChild(this.table, true);
		
	/* Column filter */
	if (this.options.columnFilter) {
		this.toolbar.setVisible(true);
		this.columnFilterButton_ = new exa.ui.Button(exa.dom.createDom('div','exa-toolbar-filter-btn'));	
		this.toolbar.addChild(this.columnFilterButton_, true);
		this.columnFilterMenu_ = new exa.ui.PopupMenu();
		this.columnFilterMenu_.bind('action', this.filterColumns, this);
		this.columnFilterMenu_.render();
		if (this.data) {
			this.createColumnList();
		}
	}
	
	/* Formatter */
	if (this.options.formatter) {
		this.toolbar.setVisible(true);
		this.formatterButton_ = new exa.ui.Button(exa.dom.createDom('div','exa-toolbar-save-btn'));
		this.toolbar.addChild(this.formatterButton_, true);
	}
};

exa.ui.AdvancedTable.prototype.enterDocument = function () {
	exa.ui.AdvancedTable.superClass_.enterDocument.call(this);
	if (this.formatterButton_) {
		this.formatterButton_.bind('mouseup', this.toggleFormatterForm, this);
	}
	if (this.columnFilterMenu_) {
		this.columnFilterMenu_.bindToButton(this.columnFilterButton_);		
	}
	this.table.bind('columnsChanged', this.triggerChanged_, this);
};

exa.ui.AdvancedTable.prototype.toggleFormatterForm = function () {
	var form = this.getFormatterForm();
	form.setVisible(!form.isVisible());
};

exa.ui.AdvancedTable.prototype.getFormatterForm = function () {
	if (!this.formatterForm_) {
		this.formatterForm_ = new exa.ui.FormatterForm(this.data);
		this.formatterForm_.setVisible(false);
		this.addChildAt(this.formatterForm_, 1, true);
		this.formatterForm_.bind('formatterChanged', this.onFormatterChanged_, this);		
	}
	return this.formatterForm_;
};

exa.ui.AdvancedTable.prototype.triggerChanged_ = function () {
	this.trigger('configurationChanged');
};

exa.ui.AdvancedTable.prototype.onFormatterChanged_ = function (e, rules) {
	this.formatData(rules);
	this.triggerChanged_();
};

exa.ui.AdvancedTable.prototype.formatData = function (rules) {
	this.resetFormattedData();	
	var formatter = new exa.ui.Formatter(this.data);	
	for (var i = 0; i < rules.length; i ++) {
		formatter.format(rules[i]);
	}
	this.table.refresh();
	this.legend.setValue(rules);
};

exa.ui.AdvancedTable.prototype.setFormatters = function (rules) {
	this.formatData(rules);
	if (this.options.formatter) {
		this.getFormatterForm().setValue(rules);
	}
};

exa.ui.AdvancedTable.prototype.getFormatters = function () {
	var ret; 
	if (this.formatterForm_) {
		ret = this.formatterForm_.getValue();
	} else {
		ret = [];
	}
	return ret;
};

exa.ui.AdvancedTable.prototype.setColumnIds = function (columns) {
	var viewColumns = [],
		columnIndex;
	for (var i = 0, l = columns.length; i < l; i ++) {
		columnIndex = this.data.getColumnIndex(columns[i]);
		if (columnIndex != -1) {
			viewColumns.push(columnIndex);
		}
	}
	this.table.getData().setColumns(viewColumns);
	this.table.refresh();
	if (this.options.columnFilter) {
		this.updateColumnList();
	}
	this.triggerChanged_();
};

exa.ui.AdvancedTable.prototype.getColumnIds = function () {
	var data = this.data, 
		viewColumns = this.table.getData().getViewColumns(),
		columnId,		
		columnIds = [];
	
	for (var i = 0, l = viewColumns.length; i < l;i ++) {
		columnId = data.getColumnId(viewColumns[i]);
		if (columnId) {
			columnIds.push(columnId);
		}
	}	
	return columnIds;
};

exa.ui.AdvancedTable.prototype.resetFormattedData = function () {
	var data = this.data,
		columnIndex,		
		rowIndex,
		numberOfColumns = data.getNumberOfColumns(),
		numberOfRows = data.getNumberOfRows();
	
	for (rowIndex = 0; rowIndex < numberOfRows; rowIndex ++) {
		data.setRowProperty(rowIndex, 'style', '');
		for (columnIndex = 0; columnIndex < numberOfColumns; columnIndex ++) {		
//			data.setProperty(rowIndex, columnIndex, 'className', '');
			data.setProperty(rowIndex, columnIndex, 'style', '');
		}		
	}
};

exa.ui.AdvancedTable.prototype.createColumnList = function () {
	var data = this.data,
		numberOfColumns = data.getNumberOfColumns(),
		checkBoxMenuItem,
		columnFilterMenuItem = this.columnFilterMenu_,
		label;
	
	for (var columnIndex = 0; columnIndex < numberOfColumns; columnIndex ++) {
		label = data.getColumnLabel(columnIndex);
		if (label) {
			checkBoxMenuItem = new exa.ui.CheckBoxMenuItem(data.getColumnLabel(columnIndex), columnIndex);
			columnFilterMenuItem.addItem(checkBoxMenuItem);
		}
	}
	this.updateColumnList();
};

exa.ui.AdvancedTable.prototype.updateColumnList = function () {
	var checkBoxMenuItem,
		columnFilterMenuItem = this.columnFilterMenu_,
		currentColumns = this.table.getData().getViewColumns();
	for (var i = 0,l = columnFilterMenuItem.getChildCount(); i < l; i ++) {
		checkBoxMenuItem = columnFilterMenuItem.getChildAt(i);
		checkBoxMenuItem.setValue(currentColumns.indexOf(checkBoxMenuItem.getData()) != -1);
	}
};

exa.ui.AdvancedTable.prototype.filterColumns = function (e, child) {
	var data = child.getData(),
		cols = this.table.getData().getViewColumns(),
		columnIndex;
	columnIndex = cols.indexOf(data);
	if (columnIndex == -1) {
		columnIndex = exa.isNumber(data) ? data : this.table.getData().getNumberOfColumns();
		cols.splice(columnIndex, 0, data);
	} else {
		cols.splice(columnIndex, 1);
	}
	this.table.getData().setColumns(cols);
	this.table.refresh();
	this.triggerChanged_();
};