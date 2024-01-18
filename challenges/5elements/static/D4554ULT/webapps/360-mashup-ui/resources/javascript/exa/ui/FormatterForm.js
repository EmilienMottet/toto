exa.provide('exa.ui.FormatterForm');

exa.require('exa.dom');
exa.require('exa.ui.ColorPicker');
exa.require('exa.ui.RadioGroup');
exa.require('exa.ui.Radio');
exa.require('exa.ui.Button');
exa.require('exa.ui.Input');
exa.require('exa.ui.Select');
exa.require('exa.ui.ColorInput');

exa.ui.FormatterForm = function (data) {
	this.data = data;
};
exa.inherit(exa.ui.FormatterForm, exa.ui.Component);

exa.ui.FormatterForm.NO_COLUMN_SELECTED = {
	text:mashupI18N.get('advancedTable', 'select_column'),
	value:-1 	
};
exa.ui.FormatterForm.ALL_COLUMNS_SELECTED = {
	text:mashupI18N.get('advancedTable', 'complete_row'),
	value:-1
};

exa.ui.FormatterForm.getColumnChoices = function (data, firstChoice) {
	var choices = [],
		i,
		label;
	if (firstChoice) {
		choices.push(firstChoice);
	}
	
	for (i = 0; i < data.getNumberOfColumns(); i ++) {
		label = data.getColumnLabel(i);
		if (label) {
			choices.push({
				value:i,
				text:label
			});
		}
	}
	return choices;
};

exa.ui.FormatterForm.getFieldTargets = function (data, firstTarget) {
	var targets = [],
		i,
		label;
	if (firstTarget) {
		targets.push(firstTarget);
	}
	
	for (i = 0; i < data.getNumberOfColumns(); i ++) {
		label = data.getColumnLabel(i);
		if (label) {
			targets.push({
				value:i,
				text:label
			});
		}
	}
	return targets;
};

exa.ui.FormatterForm.getNumberColumnChoices = function (data) {
	var choices = [],
		i;
	choices.push(exa.ui.FormatterForm.NO_COLUMN_SELECTED);
	for (i = 0; i < data.getNumberOfColumns(); i ++) {
		if (data.getColumnType(i) == 'number') {
			choices.push({
				value:i,
				text:data.getColumnLabel(i)
			});
		}
	}
	return choices;
};

exa.ui.FormatterForm.prototype.createDom = function () {
	var rules,
		submit,
		cancel,
		addRule;
	
	this.element_ = exa.dom.createDom('div', 'exa-formatterform');
		
	rules = new exa.ui.Component();
	rules.addChild(new exa.ui.FormatterForm.Rule(this.data), true);
	
	addRule = new exa.ui.Button(mashupI18N.get('advancedTable', 'new_rule'));
	submit = new exa.ui.Button(mashupI18N.get('advancedTable', 'apply'));
	submit.addClass('exa-button-middle');
	cancel = new exa.ui.Button(mashupI18N.get('advancedTable', 'cancel'));
	
	
	this.addChild(rules, true);
	this.addChild(addRule, true);
	this.addChild(submit, true);
	this.addChild(cancel, true);
	
	this.submit_ = submit;
	this.cancel_ = cancel;
	this.addRule_ = addRule;
	this.rules_ = rules;
};

exa.ui.FormatterForm.prototype.enterDocument = function () {
	exa.ui.FormatterForm.superClass_.enterDocument.call(this);
	this.submit_.bind('mouseup', this.onApply_, this);
	this.cancel_.bind('mouseup', this.onCancel_, this);
	this.addRule_.bind('mouseup', this.createNewRule_, this);
};

exa.ui.FormatterForm.prototype.createNewRule_ = function () {
	if (this.rules_.getChildAt(this.rules_.getChildCount()-1).isValid()) {
		this.rules_.addChild(new exa.ui.FormatterForm.Rule(this.data), true);
	}
};

exa.ui.FormatterForm.prototype.clear = function () {
	while (this.rules_.getChildCount() > 1) {
		this.rules_.removeChild(this.rules_.getChildAt(0));
	}
	this.rules_.getChildAt(0).clear();
};

exa.ui.FormatterForm.prototype.onApply_ = function () {
	this.value_ = this.computeValue();
	this.trigger('formatterChanged', [this.value_]);
};

exa.ui.FormatterForm.prototype.onCancel_ = function () { 
	if (this.value_) {
		this.setValue(this.value_);
	} else {
		this.clear();
	}
	this.setVisible(false);
};

exa.ui.FormatterForm.prototype.getValue = function () {
	return this.value_;
};

exa.ui.FormatterForm.prototype.computeValue = function () {
	var rules = [];
	this.rules_.forEachChild(function (rule) {
		if (rule.isValid()) {
			rules.push(rule.getValue());
		}
	});
	return rules;
};

exa.ui.FormatterForm.prototype.setValue = function (rules) {
	var i,
		rule;
	this.clear();	
	for (i = 0; i < rules.length; i ++) {
		rule = this.rules_.getChildAt(i);
		if (!rule) {
			rule = new exa.ui.FormatterForm.Rule(this.data);
			this.rules_.addChild(rule, true);
		}
		rule.setValue(rules[i]);		
	}
	this.value_ = rules;
};

/* class Rule */
exa.ui.FormatterForm.Rule = function (data) {
	this.data = data;
};

exa.inherit(exa.ui.FormatterForm.Rule, exa.ui.Component);

exa.ui.FormatterForm.Rule.prototype.createDom = function () {
	var wrapper = this.element_ = exa.dom.createDom('div', 'exa-formatterform-rule'),
		removeEl,
		radioGroupMode,
		legend,
		selectColumns,
		conditionsWrapper,
		conditions,
		addConditionButton,
		colorWrapper,
		firstColor,
		secondColor,
		radioItem,
		label,
		clearfix;
			
	radioGroupMode = new exa.ui.RadioGroup(mashupI18N.get('advancedTable', 'mode')+':');
	
	radioItem = new exa.ui.Radio(mashupI18N.get('advancedTable', 'color'), 'color');
	radioItem.addClass('exa-inline-block');	
	radioGroupMode.addChild(radioItem, true);
	
	radioItem = new exa.ui.Radio(mashupI18N.get('advancedTable', 'gradient'), 'gradient');
	radioItem.addClass('exa-inline-block');
	
	radioGroupMode.addChild(radioItem, true);	
	radioGroupMode.setCheckedIndex(0);
	radioGroupMode.addClass('exa-formatterform-block');
	this.addChild(radioGroupMode, true);
	
	selectColumns = new exa.ui.Select(mashupI18N.get('advancedTable', 'column')+':',
										exa.ui.FormatterForm.getColumnChoices(
											this.data,
											exa.ui.FormatterForm.ALL_COLUMNS_SELECTED),
										exa.ui.FormatterForm.ALL_COLUMNS_SELECTED.value);
	selectColumns.addClass('exa-formatterform-block');
	this.addChild(selectColumns, true);
	
	this.colorPicker_ = new exa.ui.ColorPicker();
	this.colorPicker_.render();
	
	colorWrapper = new exa.ui.Component();	
	colorWrapper.addClass('exa-formatterform-block');
	this.addChild(colorWrapper, true);
	label = exa.dom.createDom('span');
	exa.dom.setTextContent(label, mashupI18N.get('advancedTable', 'colors')+':');
	colorWrapper.getElement().appendChild(label);
	
	firstColor = new exa.ui.ColorInput('1', false, this.colorPicker_);
	colorWrapper.addChild(firstColor, true);
	secondColor = new exa.ui.ColorInput('2', false, this.colorPicker_);
	secondColor.setVisible(false);
	colorWrapper.addChild(secondColor, true);
	
	legend  = new exa.ui.Input('text', mashupI18N.get('advancedTable', 'legend')+':');
	legend.addClass('exa-formatterform-block');
	this.addChild(legend, true);	
	
	removeEl = exa.dom.createDom('div', 'exa-formatterform-remove');
	wrapper.appendChild(exa.dom.createDom('div', 'exa-formatterform-block', removeEl));
	
	/* Clear float blocks */
	clearfix = exa.dom.createDom('div');
	clearfix.style.cssText = 'clear:both';
	wrapper.appendChild(clearfix);
	
	conditionsWrapper = new exa.ui.Component();
	conditionsWrapper.addClass('exa-formatterform-conditions-block');
	this.addChild(conditionsWrapper, true);
	
	label = exa.dom.createDom('span');
	label.className= 'exa-formatterform-conditions-label';
	exa.dom.setTextContent(label, mashupI18N.get('advancedTable', 'conditions')+':');
	conditionsWrapper.getElement().appendChild(label);
	
	conditions = new exa.ui.Component();
	conditionsWrapper.addChild(conditions, true);
	
	conditions.addChild(new exa.ui.FormatterForm.Condition(this.data), true);
	
	addConditionButton = new exa.ui.Button(mashupI18N.get('advancedTable', 'new_condition'));	
	conditionsWrapper.addChild(addConditionButton, true);
			
	this.removeEl_ = removeEl;
	this.radioGroupMode_ = radioGroupMode;
	this.conditionsWrapper_ = conditionsWrapper;
	this.conditions_ = conditions;
	this.addConditionButton_ = addConditionButton;
	this.selectColumns_ = selectColumns;
	this.firstColor_ = firstColor;
	this.legend_ = legend;
	this.secondColor_ = secondColor;	
};

exa.ui.FormatterForm.Rule.prototype.enterDocument = function () {
	exa.ui.FormatterForm.Rule.superClass_.enterDocument.call(this);	
	$(this.removeEl_).click($.proxy(this.remove_, this));
	
	this.radioGroupMode_.bind('changed', this.modeChanged_, this);	
	this.addConditionButton_.bind('mouseup', this.createNewCondition_, this);
};

exa.ui.FormatterForm.Rule.prototype.modeChanged_ = function (e, mode) {
	this.setMode(mode);
};

exa.ui.FormatterForm.Rule.prototype.setMode = function (mode) {
	this.clear();
	this.radioGroupMode_.setValue(mode);
	switch (mode) {
	case 'color':
		this.selectColumns_.setChoices(exa.ui.FormatterForm.getColumnChoices(this.data, exa.ui.FormatterForm.ALL_COLUMNS_SELECTED));
		this.secondColor_.setVisible(false);
		this.conditionsWrapper_.setVisible(true);
		break;
	case 'gradient':
		this.selectColumns_.setChoices(exa.ui.FormatterForm.getNumberColumnChoices(this.data));
		this.secondColor_.setVisible(true);
		this.conditionsWrapper_.setVisible(false);
		break;
	}
};

exa.ui.FormatterForm.Rule.prototype.colorChosen_ = function (e, color, target) {
	if (target == this.firstColor_) {
		this.firstColor_.value = color;
	} else if (target == this.secondColor_) {
		this.secondColor_.value = color;
	}	
};

exa.ui.FormatterForm.Rule.prototype.createNewCondition_ = function () {
	if (this.conditions_.getChildAt(this.conditions_.getChildCount()-1).isValid()) {
		this.conditions_.addChild(new exa.ui.FormatterForm.Condition(this.data), true);
	}
};

exa.ui.FormatterForm.Rule.prototype.remove_ = function () {
	var parent = this.parent_;
	if (parent && parent.getChildCount() > 1) {
		parent.removeChild(this);
	} else {
		this.clear();
	}
};

exa.ui.FormatterForm.Rule.prototype.isValid = function () {
	var ret = true,
		i;	
	this.selectColumns_.removeClass('exa-formatterform-error');
	
	if (this.radioGroupMode_.getValue() == 'color') {
		ret = false;
		for (i = 0; i < this.conditions_.getChildCount(); i ++) {
			if (this.conditions_.getChildAt(i).isValid()) {
				ret = true;
			}
		}
	} else if (this.selectColumns_.getValue() == exa.ui.FormatterForm.NO_COLUMN_SELECTED.value) {
		this.selectColumns_.addClass('exa-formatterform-error');
		ret = false;
	}
	return ret;
};

exa.ui.FormatterForm.Rule.prototype.getValue = function () {
	var conditions = [],
		i,
		columnId = this.selectColumns_.getValue();
	if (columnId != -1) {
		columnId = this.data.getColumnId(columnId);
	}
	for (i = 0; i < this.conditions_.getChildCount(); i ++) {
		if (this.conditions_.getChildAt(i).isValid()) {
			conditions.push(this.conditions_.getChildAt(i).getValue());
		}
	}
	
	return {
		mode:this.radioGroupMode_.getValue(),
		columnId: columnId,
		firstColor: this.firstColor_.getValue(),
		secondColor: this.secondColor_.getValue(),
		legend: this.legend_.getValue(),
		conditions: conditions
	};
};

exa.ui.FormatterForm.Rule.prototype.setValue = function (value) {
	var condition,
		conditions = value.conditions,
		i;
	this.setMode(value.mode);
	this.selectColumns_.setValue(this.data.getColumnIndex(value.columnId));
	this.firstColor_.setValue(value.firstColor);
	this.secondColor_.setValue(value.secondColor);
	this.legend_.setValue(value.legend);
	for (i = 0; i < conditions.length; i ++) {
		condition = this.conditions_.getChildAt(i);
		if (!condition) {
			condition = new exa.ui.FormatterForm.Condition(this.data);
			this.conditions_.addChild(condition, true);
		}
		condition.setValue(conditions[i]);		
	}
};

exa.ui.FormatterForm.Rule.prototype.clear = function () {
	this.selectColumns_.reset();
	var conditions = this.conditions_;
	while (conditions.getChildCount() > 1) {
		conditions.removeChild(conditions.getChildAt(0));
	}
	conditions.getChildAt(0).clear();
};

/* class Condition */
exa.ui.FormatterForm.Condition = function (data) {
	this.data = data;
};
exa.inherit(exa.ui.FormatterForm.Condition, exa.ui.Component);

exa.ui.FormatterForm.Condition.UNKNOWN_CHOICE = {
	value : -1, 
	text:mashupI18N.get('advancedTable', 'select_condition')
};

exa.ui.FormatterForm.Condition.UNKNOWN_CHOICES = [
	exa.ui.FormatterForm.Condition.UNKNOWN_CHOICE
];

exa.ui.FormatterForm.Condition.UNKNOWN_TARGET = {
	value : -1, 
	text:mashupI18N.get('advancedTable', 'select_target')
};

exa.ui.FormatterForm.Condition.UNKNOWN_TARGETS = [
	exa.ui.FormatterForm.Condition.UNKNOWN_TARGET
];

exa.ui.FormatterForm.Condition.TARGETS = [
  	exa.ui.FormatterForm.Condition.UNKNOWN_TARGET,
  	{
  		value : 'value', 
  		text: mashupI18N.get('advancedTable', 'value')
  	},
  	{
  		value : 'label', 
  		text: mashupI18N.get('advancedTable', 'label')
  	}
];

exa.ui.FormatterForm.Condition.NUMBER_CHOICES = [
	exa.ui.FormatterForm.Condition.UNKNOWN_CHOICE,
	{
		value : 'between', 
		text: mashupI18N.get('advancedTable', 'between')
	},
	{
		value : 'lt', 
		text: mashupI18N.get('advancedTable', 'lt')
	},
	{
		value : 'gt', 
		text: mashupI18N.get('advancedTable', 'gt')
	},
	{
		value : 'lte', 
		text: mashupI18N.get('advancedTable', 'lte')
	},
	{
		value : 'gte', 
		text: mashupI18N.get('advancedTable', 'gte')
	},
	{
		value : 'eq', 
		text: mashupI18N.get('advancedTable', 'eq')
	}
];

exa.ui.FormatterForm.Condition.STRING_CHOICES = [
	exa.ui.FormatterForm.Condition.UNKNOWN_CHOICE,
	{
		value : 'contains', 
		text: mashupI18N.get('advancedTable', 'contains')
	},
	{
		value : 'startsWith', 
		text: mashupI18N.get('advancedTable', 'starts_with')
	},
	{
		value : 'endsWith', 
		text: mashupI18N.get('advancedTable', 'ends_with')
	},
	{
		value : 'eq',
		text: mashupI18N.get('advancedTable', 'eq')
	}
];

exa.ui.FormatterForm.Condition.BOOLEAN_CHOICES = [
 	{
 		value : 'eq',
 		text: mashupI18N.get('advancedTable', 'eq')
 	}
];

exa.ui.FormatterForm.Condition.DATE_CHOICES = [
  	exa.ui.FormatterForm.Condition.UNKNOWN_CHOICE,
  	{
  		value : 'datebetween', 
  		text: mashupI18N.get('advancedTable', 'between')
  	},
  	{
  		value : 'datebefore', 
  		text: mashupI18N.get('advancedTable', 'before')
  	},
  	{
  		value : 'dateafter', 
  		text: mashupI18N.get('advancedTable', 'after')
  	}
];

exa.ui.FormatterForm.Condition.prototype.createDom = function () {
	var wrapper = this.element_ = exa.dom.createDom('div', 'exa-formatterform-condition'),
		removeEl,
		selectColumns,
		selectCondition,
		targetField,
		firstValue,
		secondValue;
	
	removeEl = exa.dom.createDom('div', 'exa-formatterform-remove');
	wrapper.appendChild(exa.dom.createDom('div', 'exa-formatterform-block exa-formatterform-condition-block', removeEl));
			
	selectColumns = new exa.ui.Select(mashupI18N.get('advancedTable', 'column')+':', exa.ui.FormatterForm.getColumnChoices(this.data, exa.ui.FormatterForm.NO_COLUMN_SELECTED), exa.ui.FormatterForm.NO_COLUMN_SELECTED.value);
	selectColumns.addClass('exa-formatterform-block');
	selectColumns.addClass('exa-formatterform-condition-block');
	this.addChild(selectColumns, true);
	
	targetField = new exa.ui.Select(mashupI18N.get('advancedTable', 'target')+':', exa.ui.FormatterForm.Condition.UNKNOWN_TARGETS, exa.ui.FormatterForm.Condition.UNKNOWN_TARGET.value);
	targetField.setEnabled(false);
	targetField.addClass('exa-formatterform-block');
	targetField.addClass('exa-formatterform-condition-block');
	targetField.setVisible(false);
	this.addChild(targetField, true);
	
	selectCondition = new exa.ui.Select(mashupI18N.get('advancedTable', 'condition')+':', exa.ui.FormatterForm.Condition.UNKNOWN_CHOICES, exa.ui.FormatterForm.Condition.UNKNOWN_CHOICE.value);
	selectCondition.setEnabled(false);
	selectCondition.addClass('exa-formatterform-block');
	selectCondition.addClass('exa-formatterform-condition-block');
	this.addChild(selectCondition, true);
	
	firstValue = new exa.ui.Input();
	firstValue.addClass('exa-formatterform-block');
	firstValue.addClass('exa-formatterform-condition-block');
	firstValue.setVisible(false);
	this.addChild(firstValue, true);
	
	secondValue = new exa.ui.Input();
	secondValue.addClass('exa-formatterform-block');
	secondValue.addClass('exa-formatterform-condition-block');
	secondValue.setVisible(false);
	this.addChild(secondValue, true);
	
	this.removeEl_ = removeEl;
	this.selectColumns_ = selectColumns;
	this.selectCondition_ = selectCondition;
	this.targetField_ = targetField;
	this.firstValue_ = firstValue;
	this.secondValue_ = secondValue;
};

exa.ui.FormatterForm.Condition.prototype.enterDocument = function () {
	exa.ui.FormatterForm.Condition.superClass_.enterDocument.call(this);
	$(this.removeEl_).click($.proxy(this.remove_, this));
	this.selectColumns_.bind('changed', this.columnChanged_, this);
	this.selectCondition_.bind('changed', this.conditionChanged_, this);
};

exa.ui.FormatterForm.Condition.prototype.columnChanged_ = function (e, columnIndex) {
	this.firstValue_.setVisible(false);
	this.secondValue_.setVisible(false);
	this.targetField_.setVisible(false);
	this.targetField_.setEnabled(false);
	if (columnIndex > -1) {
		switch (this.data.getColumnType(columnIndex)) {
		case 'number':
			this.selectCondition_.setChoices(exa.ui.FormatterForm.Condition.NUMBER_CHOICES);			
			this.selectCondition_.setEnabled(true);	
			break;
		case 'string':
			this.selectCondition_.setChoices(exa.ui.FormatterForm.Condition.STRING_CHOICES);			
			this.selectCondition_.setEnabled(true);
			break;
		case 'boolean':
			this.selectCondition_.setChoices(exa.ui.FormatterForm.Condition.BOOLEAN_CHOICES);			
			this.selectCondition_.setEnabled(true);
			this.selectCondition_.setValue('eq');
			break;
		case 'date':
			this.selectCondition_.setChoices(exa.ui.FormatterForm.Condition.DATE_CHOICES);			
			this.selectCondition_.setEnabled(true);
			break;
		case 'url':
			this.targetField_.setChoices(exa.ui.FormatterForm.Condition.TARGETS);
			this.targetField_.setEnabled(true);
			this.targetField_.setVisible(true);
			this.selectCondition_.setChoices(exa.ui.FormatterForm.Condition.STRING_CHOICES);			
			this.selectCondition_.setEnabled(true);
			break;
		default:
			this.targetField_.setVisible(false);
			this.targetField_.setEnabled(false);
			this.selectCondition_.setEnabled(false);
			break;
		}
	} else {
		this.targetField_.reset();
		this.targetField_.setEnabled(false);
		this.targetField_.setVisible(false);
		this.selectCondition_.reset();
		this.selectCondition_.setEnabled(false);
	}
};

exa.ui.FormatterForm.Condition.prototype.conditionChanged_ = function (e, conditionValue) {
	this.firstValue_.reset();
	this.secondValue_.reset();
	//$(this.firstValue_.getInput()).datepicker("option", "disabled", true);
	//$(this.secondValue_.getInput()).datepicker("option", "disabled", true);
	switch (conditionValue) {
	case 'between':
		$(this.firstValue_.getInput()).datepicker("destroy");
        $(this.secondValue_.getInput()).datepicker("destroy");
		this.firstValue_.setVisible(true);
		this.secondValue_.setVisible(true);
		break;
	case 'lt':
	case 'gt':
	case 'lte':
	case 'gte':
	case 'eq':
	case 'contains':
	case 'startsWith':
	case 'endsWith':
		$(this.firstValue_.getInput()).datepicker("destroy");
		$(this.secondValue_.getInput()).datepicker("destroy");
		this.firstValue_.setVisible(true);
		this.secondValue_.setVisible(false);
		break;
	case 'dateafter':
	case 'datebefore':
		this.firstValue_.setVisible(true);
		$(this.firstValue_.getInput()).datepicker();
		this.secondValue_.setVisible(false);
		break;
	case 'datebetween':
		this.firstValue_.setVisible(true);
		this.secondValue_.setVisible(true);		
		$(this.secondValue_.getInput()).datepicker();
		$(this.firstValue_.getInput()).datepicker();
		break;
	default:
		this.firstValue_.setVisible(false);
		this.secondValue_.setVisible(false);
		break;
	}
};


exa.ui.FormatterForm.Condition.prototype.remove_ = function () {
	var parent = this.parent_;
	if (parent && parent.getChildCount() > 1) {
		parent.removeChild(this);
	} else {
		this.clear();
	}
};

exa.ui.FormatterForm.Condition.prototype.clear = function () {
	this.selectColumns_.reset();
};

exa.ui.FormatterForm.Condition.prototype.isValid = function () {
	this.selectColumns_.removeClass('exa-formatterform-error');
	this.selectCondition_.removeClass('exa-formatterform-error');
	var ret = true;
	if (this.selectColumns_.getValue() == exa.ui.FormatterForm.NO_COLUMN_SELECTED.value) {
		ret = false;
		this.selectColumns_.addClass('exa-formatterform-error');
	}
	if (this.selectCondition_.getValue() == -1) {
		ret = false;
		this.selectCondition_.addClass('exa-formatterform-error');
	} 
	return ret;
};

exa.ui.FormatterForm.Condition.prototype.getValue = function () {
	var columnIndex = Number(this.selectColumns_.getValue()),
		firstValue = this.firstValue_.getValue(),
		secondValue = this.secondValue_.getValue(),
		targetValue = '';
	
	switch (this.data.getColumnType(columnIndex)) {
		case 'number':
			firstValue = Number(firstValue);
			secondValue = Number(secondValue);
		break;
		case 'boolean':
			firstValue = firstValue == 'true';
			secondValue = secondValue == 'true';
		break;
		case 'url':
			targetValue = this.targetField_.getValue();
		break;
	}
	return {
		columnId : this.data.getColumnId(columnIndex),
		condition : this.selectCondition_.getValue(),
		firstValue : firstValue,
		secondValue : secondValue,
		targetValue : targetValue 
	};
};

exa.ui.FormatterForm.Condition.prototype.setValue = function (value) {
	this.selectColumns_.setValue(this.data.getColumnIndex(value.columnId));
	this.selectCondition_.setValue(value.condition);
	this.targetField_.setValue(value.targetValue);
	this.firstValue_.setValue(value.firstValue);
	this.secondValue_.setValue(value.secondValue);
};
