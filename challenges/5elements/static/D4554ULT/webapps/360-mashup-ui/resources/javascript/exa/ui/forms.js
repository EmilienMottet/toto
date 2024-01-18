exa.provide('exa.ui.forms');

exa.ui.forms.getValue = function (form, name) {
	var inputEl = form.elements[name];	
	if (!inputEl) {
		return null;
	}
	if (inputEl.length) {
		var values = [];
		for (var i = 0; i < inputEl.length; i ++) {
			var val = exa.ui.forms.getInputValue(inputEl[i]);
			if (val != null) {
				values.push(val);
			}
		}
		return values;
	} else {
		return exa.ui.forms.getInputValue(inputEl);
	}
};

exa.ui.forms.getInputValue = function (el) {
	if (!el.type) {
		return null;
	}
	switch (el.type.toLowerCase()) {
	case 'checkbox':
    	return el.checked ? el.value : null;
	default:
		return el.value; 
	}
};