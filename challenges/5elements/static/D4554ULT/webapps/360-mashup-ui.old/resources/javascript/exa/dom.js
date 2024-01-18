exa.provide('exa.dom');


exa.dom.setTextContent = function (element, text) {
	if (element.textContent) {
		element.textContent = text;
	} else if (element.firstChild && element.firstChild.nodeType == 3) {
		while(element.firstChild != element.lastChild) {
			element.removeChild(element.lastChild);
		}
		element.firstChild.data = text;
	} else {
		exa.dom.removeChildren(element);
		element.appendChild(document.createTextNode(text));
	}
};

exa.dom.removeChildren = function (element) {
	var child;
	while ((child = element.firstChild)) {
		element.removeChild(child);
	}
};

exa.dom.createDom = function (tagName, opt_parameters, children) {
	var elem = document.createElement(tagName);
	if (exa.isString(opt_parameters)) {
		elem.className = opt_parameters;
	} else if (exa.isArray(opt_parameters)) {
		exa.className = opt_parameters.join(' ');
	} else {
		for (var prop in opt_parameters) {
			if (opt_parameters.hasOwnProperty(prop)) {
				elem[prop] = opt_parameters[prop];
			}
		}
	}	
	for (var i = 2; i < arguments.length; i ++) {
		elem.appendChild(arguments[i]);
	}
	
	return elem;
};

exa.dom.reSpace_ = /\s+/;
exa.dom.addClass = function (el, className) {
	var spacedClassName,
		classNames,
		i, l;
	
	if (className) {
		classNames = className.split(exa.dom.reSpace_); 
		if (!el.className && classNames.length === 1) {
			el.className = className;
		} else {
			spacedClassName = ' ' + el.className + ' ';
			for (i = 0, l = classNames.length; i < l; i ++) { 
				if (spacedClassName.indexOf(classNames[i]) == -1) {
					spacedClassName += classNames[i] + ' ';
				}
			}
			el.className = spacedClassName.trim();
		}
	}
};

exa.dom.removeClass = function (el, className) {
	var spacedClassName,
		classNames,
		i, l;
	
	if (!el.className) {
		return;
	}
	if (className) {					
		classNames = className.split(exa.dom.reSpace_);
		if (classNames.length === 1 && el.className == className) {
			el.className = '';
		} else {
			spacedClassName = ' ' + el.className + ' ';
			for (i = 0, l = classNames.length; i < l; i ++) {
				spacedClassName = spacedClassName.replace(classNames[i]+' ', '');
			}
			el.className = spacedClassName.trim();
		}
	}
};

