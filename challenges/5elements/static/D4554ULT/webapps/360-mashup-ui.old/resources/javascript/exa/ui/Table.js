exa.provide('exa.ui.Table');

exa.require('exa.dom');
exa.require('exa.ui.Component');
exa.require('exa.data.DataTable');
exa.require('exa.data.DataView');
exa.require('exa.ui.Button');
exa.require('exa.ui.Pagination');


exa.ui.Table = function (options) {
	options = options || {};	
	exa.ui.Table.initialize_(options, 'sortColumn', -1);
	exa.ui.Table.initialize_(options, 'page', 'disable');
	exa.ui.Table.initialize_(options, 'pageSize', 10);
	exa.ui.Table.initialize_(options, 'startPage', 0);
	exa.ui.Table.initialize_(options, 'sortAscending', true);
	exa.ui.Table.initialize_(options, 'showRowNumber', false);
	exa.ui.Table.initialize_(options, 'draggableColumn', false);
	exa.ui.Table.initialize_(options, 'sort', options.enableSort ? 'enable':'disable');
	exa.ui.Table.initialize_(options, 'alternatingRowStyle', false);
	exa.ui.Table.initialize_(options, 'cssClassNames', {});	
	exa.ui.Table.initialize_(options.cssClassNames, 'table', 'exa-table');
	exa.ui.Table.initialize_(options.cssClassNames, 'tableCell', 'exa-table-td');
	exa.ui.Table.initialize_(options.cssClassNames, 'headerCell', 'exa-table-th');
	exa.ui.Table.initialize_(options.cssClassNames, 'sortableHeaderCell', 'exa-table-th-sortable');
	exa.ui.Table.initialize_(options.cssClassNames, 'oddTableRow', 'exa-table-row-odd');
	this.currentPage = options.startPage;
	this.options = options;
};

exa.inherit(exa.ui.Table, exa.ui.Component);

exa.ui.Table.prototype.currentPage = 0;
exa.ui.Table.prototype.validColumnDrag_ = false;
exa.ui.Table.prototype.data = null;

exa.ui.Table.prototype.setData = function (data) {
	if (this.options.draggableColumn && data instanceof exa.data.DataTable) {
		data = new exa.ui.DataView(data);
	}
	this.data = data;
	if (this.getElement()) {
		this.refresh();
	}
};

exa.ui.Table.prototype.getData = function (data) {
	return this.data;
};

exa.ui.Table.initialize_ = function (obj, key, defaultValue) {
	if (!exa.isDef(obj[key])) {
		obj[key] = defaultValue;
	}
};

exa.ui.Table.prototype.getPagination = function () {
	if (!this.pagination_) {
		this.pagination_ = new exa.ui.Pagination(this.options);
		this.addChild(this.pagination_, true);
	}
	return this.pagination_;
};

exa.ui.Table.prototype.enterDocument = function () {
	exa.ui.Table.superClass_.enterDocument.call(this);
	// Bind events
	if (this.options.sort === 'enable') {
		$(this.thead_).click($.proxy(this.onClickHeaderSort_, this));
	} else if (this.options.sort === 'event') {
		$(this.thead_).click($.proxy(this.onClickHeaderEvent_, this));
	}
	if (this.options.draggableColumn) {
		$(this.thead_).mousedown($.proxy(this.onMouseDownHeaderEvent_, this));
	}
	
	if (this.options.page == 'enable') {
		this.getPagination().bind('previous', this.previousPage_, this);
		this.getPagination().bind('next', this.nextPage_, this);
	}
};

exa.ui.Table.prototype.previousPage_ = function () {
	this.currentPage--; 
	this.refresh();
};

exa.ui.Table.prototype.nextPage_ = function () {
	this.currentPage++;
	this.refresh();
};

exa.ui.Table.prototype.getColumnIndexFromEvent = function (e) {
	var target = e.target,
		columnIndex = -1;	
	while (!exa.isDef(target.cellIndex)) {
		target = target.parentNode;
	}
	columnIndex = target.cellIndex;
	if (this.options.showRowNumber) {
		if (columnIndex == 0) {
			return -1;
		}
		columnIndex--;
	}
	
	return columnIndex;
};

exa.ui.Table.prototype.getColumnIndexFromClientX = function (clientX) {
	var currentHeader = this.thead_.firstChild.firstChild,
		currentIndex = 0;
		
	if (this.options.showRowNumber) {
		currentHeader = currentHeader.nextSibling;
	}
	
	while((currentHeader = currentHeader.nextSibling)) {
		if (clientX < $(currentHeader).offset().left) {
			return currentIndex;
		}
		currentIndex++;
	}
	
	return currentIndex;
};

exa.ui.Table.prototype.onClickHeaderSort_ = function (e) {
	if (!this.validColumnDrag_) {
		var columnIndex = this.getColumnIndexFromEvent(e);
		if (columnIndex != -1) {
			if (this.sortColumn == columnIndex) {
				this.sortAscending = !this.sortAscending;
			} else {
				this.sortColumn = columnIndex;
				this.sortAscending = true;
			}
			this.currentPage = this.options.startPage;
			this.refresh();
		}
	}
};

exa.ui.Table.prototype.onClickHeaderEvent_ = function (e) {
	if (!this.validColumnDrag_) {
	/** TODO: custom events */
		
	}	
};


/* Manage drag&drop of columns */
exa.ui.Table.prototype.onMouseDownHeaderEvent_ = function (e) {
	var columnIndexFromEvent = this.getColumnIndexFromEvent(e);
	if (columnIndexFromEvent > -1) {
		var target = e.target;
		while (!exa.isDef(target.cellIndex)) {
			target = target.parentNode;
		}
		this.dragTarget_ = target.firstChild;
		this.dragStartClientX_ = e.clientX;
		this.currentDraggedColumn_ = columnIndexFromEvent;	
		this.validColumnDrag_ = false;
	
		$(document.body).bind('mousemove', $.proxy(this.onMouseMoveHeaderEvent_, this));
		$(document).one('mouseup', $.proxy(this.onMouseUpHeaderEvent_, this));
		e.preventDefault();
		return true;
	}
};

exa.ui.Table.prototype.onMouseMoveHeaderEvent_ = function (e) {
	this.validColumnDrag_ = true;
	this.dragTarget_.style.left = (e.clientX - this.dragStartClientX_) + 'px';
	this.dragTarget_.style.zIndex = '1000';
};

exa.ui.Table.prototype.onMouseUpHeaderEvent_ = function (e) {
	var cols,
		movedColumnIndex,
		targetColumnIndex,
		currentDraggedColumn = this.currentDraggedColumn_;
	
	this.currentDraggedColumn_ = -1;
	this.dragTarget_.style.left = '';
	this.dragTarget_.style.zIndex = '';
	this.dragTarget_ = null;
	
	$(document.body).unbind('mousemove', this.onMouseMoveHeaderEvent_);
	if (this.validColumnDrag_) {	
		if (currentDraggedColumn != -1) {
			targetColumnIndex = this.getColumnIndexFromClientX(e.clientX);
			cols = this.data.getViewColumns();
			if (currentDraggedColumn != targetColumnIndex) {
				movedColumnIndex = cols[currentDraggedColumn];
				cols.splice(currentDraggedColumn, 1);
				cols.splice(targetColumnIndex, 0, movedColumnIndex);
				
				/* Make sure you keep the good sorted column */
				if (currentDraggedColumn == this.sortColumn) {
					this.sortColumn = targetColumnIndex;
				} else if (currentDraggedColumn < this.sortColumn && targetColumnIndex >= this.sortColumn) {
					this.sortColumn--;
				} else  if (currentDraggedColumn > this.sortColumn && targetColumnIndex <= this.sortColumn) {
					this.sortColumn++;
				}
				
				this.data.setColumns(cols);
				this.refresh();
				this.trigger('columnsChanged');
			}
		}
		return false;
	}
};

exa.ui.Table.prototype.refresh = function () {
	var data = this.data, 
		numberOfRows,
		sortEnabled = false,
		sortedRows = null,
		paginationEnabled,
		showPagination =false,
		startIndex = 0,
		endIndex,
		thead = this.thead_,
		tbody = this.tbody_,
		pagination;
	
	$(thead).empty();
	thead.appendChild(this.createColumns_(data));
	
	numberOfRows = data.getNumberOfRows();
	endIndex = numberOfRows;
	
	// handle pagination
	paginationEnabled = this.options.page === 'enable';
	showPagination = numberOfRows > this.options.pageSize;
	
	if (paginationEnabled && showPagination) {
		startIndex = this.currentPage * this.options.pageSize;
		if (startIndex + this.options.pageSize < numberOfRows) {
			endIndex = startIndex + this.options.pageSize;
		}
	}
	
	// handle sort
	if (exa.isNumber(this.sortColumn) && this.sortColumn < data.getNumberOfColumns()) {
		sortedRows = data.getSortedRows({
			column: this.sortColumn,
			desc: !this.sortAscending
		});
		sortEnabled = true;
	}
	
	$(tbody).empty();
	for (var i = startIndex; i < endIndex; i ++) {		
		tbody.appendChild(this.createRow_(data, i, sortEnabled ? sortedRows[i] : i));
	}
	
	// display pagination
	if (paginationEnabled) {
		pagination = this.getPagination();
		pagination.setNumberOfRows(numberOfRows);
		pagination.setPage(this.currentPage);
		pagination.refresh();
		pagination.setVisible(showPagination);
	}
	
	this.trigger('redraw', this);
};

exa.ui.Table.prototype.createDom = function () {
	exa.ui.Table.superClass_.createDom.call(this);	
	var	mainWrapper = this.element_,
		tableWrapper = document.createElement('div'),
		table = document.createElement('table'),
		thead = document.createElement('thead'),
		tbody = document.createElement('tbody'),
		tfoot = document.createElement('tfoot');
	
	tableWrapper.style.overflowX = 'auto';
	
	if (this.options.cssClassNames.table) {
		table.className = this.options.cssClassNames.table;
	}
	
	table.appendChild(thead);
	table.appendChild(tbody);
	table.appendChild(tfoot);
	
	tableWrapper.appendChild(table);	
	mainWrapper.appendChild(tableWrapper);
	
	this.table_ = table;
	this.thead_ = thead;
	this.tbody_ = tbody;
	this.tfoot_ = tfoot;
	
	if (this.data) {
		this.refresh();
	}
};

exa.ui.Table.prototype.createRow_ = function (data, rowIndex, sortedRowIndex) {
	var style = data.getRowProperty(sortedRowIndex, 'style'),
		options = this.options,
		tableCellClassName = options.cssClassNames.tableCell,
		row = document.createElement('tr'),
		cell;

	exa.dom.addClass(row, data.getRowProperty(sortedRowIndex, 'className'));
	if (style) {
		row.style.cssText = style;
	}
	
	if (options.alternatingRowStyle && rowIndex%2 == 1) {
		exa.dom.addClass(row, options.cssClassNames.oddTableRow);
	}
	
	if (options.showRowNumber) {
		cell = document.createElement('th');
		exa.dom.addClass(cell, tableCellClassName);		
		exa.dom.setTextContent(cell, rowIndex+1);
		row.appendChild(cell);
	}
	
	for(var columnIndex = 0; columnIndex < data.getNumberOfColumns(); columnIndex ++) {
		style = data.getProperty(sortedRowIndex, columnIndex, 'style');
		
		cell = document.createElement('td');
		
		exa.dom.addClass(cell, data.getProperty(sortedRowIndex, columnIndex, 'className'));
		exa.dom.addClass(cell, tableCellClassName);
				
		if (style) {
			cell.style.cssText = style;
		}
		this.getFormattedRowCell(cell, data, sortedRowIndex, columnIndex);
		row.appendChild(cell);
	}
	
	return row;
};

exa.ui.Table.prototype.createColumns_ = function (data) {
	var options = this.options,
		row = document.createElement('tr'),
		cell,
		cellWrapper,
		className,
		columnClassName,
		sorteEnabled = options.sort == 'enable' || options.sort == 'event';
	
	if (options.cssClassNames.headerRow) {
		row.className = options.cssClassNames.headerRow;
	}
		
	if (options.showRowNumber) {
		cell = document.createElement('th');
		cell.className = options.cssClassNames.headerCell;
		row.appendChild(cell);
	}
	
	for(var columnIndex = 0; columnIndex < data.getNumberOfColumns(); columnIndex ++) {
		cell = document.createElement('th');
		cellWrapper = document.createElement('div');
		cellWrapper.style.cssText = 'position:relative;';
		cell.appendChild(cellWrapper);
		className = options.cssClassNames.headerCell;
		if (sorteEnabled) {
			className += ' ' + options.cssClassNames.sortableHeaderCell;
		}		
		columnClassName = data.getColumnProperty(columnIndex, 'className');
		if (columnClassName) {
			className += ' ' + columnClassName;
		}
		cell.className = className;
		this.getFormattedColumnCell(cellWrapper, data, columnIndex);
		row.appendChild(cell);
	}
	return row;
};

exa.ui.Table.prototype.getFormattedColumnCell = function (cell, data, columnIndex) {
	var arrow;	
	cell.innerHTML = data.getColumnFormattedLabel(columnIndex);	
//	exa.dom.setTextContent(cell, data.getColumnLabel(columnIndex));
	if (this.sortColumn == columnIndex) {
		arrow = document.createElement('span');
		if (this.sortAscending)  {
			exa.dom.setTextContent(arrow, '\u25B2');
		} else {
			exa.dom.setTextContent(arrow, '\u25BC');			
		}
		cell.appendChild(arrow);
	}
};

exa.ui.Table.prototype.getFormattedRowCell = function (cell, data, rowIndex, columnIndex) {
	var formattedValue = data.getFormattedValue(rowIndex, columnIndex),
		type,
		value;
	if (exa.isDefAndNotNull(formattedValue)) {
		cell.innerHTML = formattedValue;
//		exa.dom.setTextContent(cell, formattedValue);
	} else {
		type = data.getColumnType(columnIndex);
		value = data.getValue(rowIndex, columnIndex);
		if (type === 'number' || type === 'string' || type === 'date' || type == 'url') {
			cell.innerHTML = value;
//			exa.dom.setTextContent(cell, value);
		} else if (type === 'boolean') {
			exa.dom.setTextContent(cell, value ? '\u2714' : '\u2718');
		}
	}
};

