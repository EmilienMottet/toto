exa.provide('exa.ui.ColorPicker');

exa.require('exa.dom');
exa.require('exa.ui.Component');

exa.ui.ColorPicker = function () {
	this.setVisible(false);
};

exa.inherit(exa.ui.ColorPicker, exa.ui.Component);

exa.ui.ColorPicker.prototype.createDom = function () {
	exa.ui.ColorPicker.superClass_.createDom.call(this);
	
	var element = this.element_,
		input = exa.dom.createDom('input'),
		validate = new exa.ui.Button('Ok'),
		table = exa.dom.createDom('table'),
		tbody = document.createElement('tbody'),
		row,
		cell,
		i,
		j,
		colorIndex,
		grid = exa.ui.ColorPicker.GRID_COLORS,
		gridWidth = exa.ui.ColorPicker.COLUMN_NUMBER,
		numberOfRows = parseInt(grid.length / gridWidth, 10);
	 
	input.className = 'decorate';
	element.className = 'exa-colorpicker';
	for (i = 0; i < numberOfRows; i ++) {
		row = document.createElement('tr');
		for (j = 0; j < gridWidth; j++) {
			cell = document.createElement('td');
			colorIndex = gridWidth*i + j;
			if (colorIndex < grid.length) {
				cell.style.backgroundColor = exa.ui.ColorPicker.GRID_COLORS[colorIndex];
			}
			row.appendChild(cell);
		}
		tbody.appendChild(row);
	}
	
	table.appendChild(tbody);
	
	element.appendChild(table);
	element.appendChild(input);
	
	
	this.addChild(validate, true);
	
	this.validateButton_ = validate;
	this.table_ = table;
	this.input_ = input;
};

exa.ui.ColorPicker.prototype.enterDocument = function () {
	exa.ui.ColorPicker.superClass_.enterDocument.call(this);	
	$(this.table_).mousedown($.proxy(this.handleCellMouseDown_, this));
	this.validateButton_.bind('mousedown', this.validate_, this);
};

exa.ui.ColorPicker.prototype.validate_ = function () {
	var value = this.input_.value;
	if (exa.ui.colors.isColor(value)) {		
		exa.dom.removeClass(this.input_, 'formError');
		this.trigger('color', [value, this.currentTarget_]);
		this.close_();
	} else {
		exa.dom.addClass(this.input_, 'formError');
	}
	
	return false;
};

exa.ui.ColorPicker.prototype.handleCellMouseDown_ = function (e) {
	var row,
		column;	
	if (exa.isDef(e.target.cellIndex)) {
		column = e.target.cellIndex;
		row = e.target.parentElement.rowIndex;	
		this.input_.value = exa.ui.ColorPicker.GRID_COLORS[row * exa.ui.ColorPicker.COLUMN_NUMBER + column];
		this.validate_();
	}
	e.stopPropagation();
	return false;
};

exa.ui.ColorPicker.prototype.close_ = function() {
	this.currentTarget_ = null;
	this.setVisible(false);
};

exa.ui.ColorPicker.prototype.open = function(target, color) {
	if (target != this.currentTarget) {
		var $target = $(target),
			offset = $target.offset(),
			height = $target.outerHeight();
		this.currentTarget_ = target;
		this.setPosition(offset.left, height + offset.top - 1);
		if (color) {
			this.input_.value = color;
		}
		this.setVisible(true);
		$(document).one('mousedown', $.proxy(this.handleDocumentMouseDown_, this));
	}
};
exa.ui.ColorPicker.prototype.handleDocumentMouseDown_ = function (e) {
	var parent = e.target; 
	while (parent) {
		if (parent == this.element_) {
			$(document).one('mousedown', $.proxy(this.handleDocumentMouseDown_, this));
			return; 
		}
		parent = parent.parentNode;
	}
	
	this.close_();		
};

exa.ui.ColorPicker.prototype.setPosition = function (left, top) {
	if (this.element_) {
		this.element_.style.top = top + 'px';
		this.element_.style.left = left + 'px';
	}
};

exa.ui.ColorPicker.COLUMN_NUMBER = 7;

exa.ui.ColorPicker.GRID_COLORS = [
  '#000000', '#555555', '#0055CC', '#2F96B4', '#BD362F', '#F89406','#51A351',
  '#FFFFFF', '#CCCCCC', '#0088CC', '#5BC0DE', '#EE5F5B', '#FBB450', '#62C462'
];