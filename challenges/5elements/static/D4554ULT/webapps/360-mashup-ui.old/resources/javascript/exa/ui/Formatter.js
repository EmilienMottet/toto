exa.provide('exa.ui.Formatter');

exa.require('exa.ui.colors');
exa.require('exa.ui.GradientFormatter');


exa.ui.Formatter = function (data) {
	this.data = data;
};
exa.ui.Formatter.prototype.format = function (rule) {
	switch (rule.mode) {
	case 'gradient':
		this.formatGradient(rule);
		break;
	case 'color':
		this.formatColor(rule);
		break;
	}
};

exa.ui.Formatter.prototype.formatGradient = function (rule) {
	var gradientFormatter = new exa.ui.GradientFormatter(rule.firstColor, rule.secondColor),
		columnIndex = this.data.getColumnIndex(rule.columnId);
	if (columnIndex != -1) {
		gradientFormatter.format(this.data, columnIndex);
	}
};

exa.ui.Formatter.prototype.formatColor = function (rule) {
	var i,
		rowIndex,
		columnIndex = this.data.getColumnIndex(rule.columnId),
		data = this.data,
		numberOfRows = data.getNumberOfRows(),
		style = 'background-color:'+rule.firstColor+';color:'+exa.ui.colors.colorFromBg(rule.firstColor)+';',
		apply,
		conditions = rule.conditions,
		numberOfConditions = conditions.length;

	for (rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
		apply = true;
		for (i = 0; i < numberOfConditions; i ++) {
			apply &= this.evalCondition(rowIndex, conditions[i]);
		}
		if (apply) {
			if (columnIndex > -1) {
				data.setProperty(rowIndex, columnIndex, 'style', style);
			} else {
				data.setRowProperty(rowIndex, 'style', style);
			}
		}
	}
};

exa.ui.Formatter.prototype.evalCondition = function (rowIndex, condition) {
	var value = this.data.getValue(rowIndex, this.data.getColumnIndex(condition.columnId));
	if(condition.targetValue != null && condition.targetValue == "label"){
		
		value = this.data.getLabel(rowIndex, this.data.getColumnIndex(condition.columnId)) != null 
					? this.data.getLabel(rowIndex, this.data.getColumnIndex(condition.columnId)) : this.data.getValue(rowIndex, this.data.getColumnIndex(condition.columnId));
	}
	switch (condition.condition) {
		case 'between':
			return value >= condition.firstValue && value <= condition.secondValue;
		case 'eq':
			return value == condition.firstValue;
		case 'lt':
			return value < condition.firstValue;
		case 'lte':
			return value <= condition.firstValue;
		case 'gt':
			return value > condition.firstValue;
		case 'gte':
			return value >= condition.firstValue;
		case 'contains':
			return value.indexOf(condition.firstValue) != -1;
		case 'startsWith':
			return value.indexOf(condition.firstValue) == 0;
		case 'endsWith':
			return value.lastIndexOf(condition.firstValue) == value.length - condition.firstValue.length;
		case 'dateafter':
			return value >= new Date(condition.firstValue);
		case 'datebefore':
			return value < new Date(condition.firstValue);
		case 'datebetween':
			return value >= new Date(condition.firstValue) && value < new Date(condition.secondValue);
	}
	return false;	 
};
