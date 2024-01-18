exa.provide('exa.ui.FormatterLegend');

exa.require('exa.dom');
exa.require('exa.ui.Component');

exa.ui.FormatterLegend = function () {
	
};
exa.inherit(exa.ui.FormatterLegend, exa.ui.Component);


exa.ui.FormatterLegend.prototype.createDom = function () {
	exa.ui.FormatterLegend.superClass_.createDom.call(this);
	this.addClass('exa-formatterlegend');
	this.get$element().hide();
};

exa.ui.FormatterLegend.prototype.setValue = function (rules) {
	var $el = this.get$element(),
		i,
		rule,
		display = false;
	$el.empty();
	for (i = 0; i < rules.length; i ++) {
		rule = rules[i];
		if (rule.legend) {
			if (rule.mode == 'color') {
				display = true;
				$el.append(exa.ui.FormatterLegend.getSimpleLegendElement_(rule.firstColor, rule.legend));
			} else if (rule.mode == 'gradient') {
				display = true;
				$el.append(exa.ui.FormatterLegend.getGradientLegendElement_(rule.firstColor, rule.secondColor, rule.legend));				
			}
		}
	}
	if (display) {
		$el.show();
	} else {
		$el.hide();
	}
};

exa.ui.FormatterLegend.getSimpleLegendElement_ = function (color, legend) {
	var legendEl = exa.dom.createDom('span', 'exa-formatterlegend-element'),
		colorEl = exa.dom.createDom('div');
	exa.dom.setTextContent(legendEl, legend);
	legendEl.insertBefore(colorEl, legendEl.firstChild);
	colorEl.style.backgroundColor = color;	
	return legendEl;
};

exa.ui.FormatterLegend.getGradientLegendElement_ = function (color1, color2, legend) {
	var legendEl = exa.dom.createDom('span', 'exa-formatterlegend-element'),
		color1El = exa.dom.createDom('div'),
		color2El = exa.dom.createDom('div');
	exa.dom.setTextContent(legendEl, legend);
	
	color1El.style.backgroundColor = color1;
	color2El.style.backgroundColor = color2;
	
	if ($.browser.webkit) {
		color1El.style.background = '-webkit-gradient(linear, left top, right top, from('+color1+'), to(#FFF))';
		color2El.style.background = '-webkit-gradient(linear, left top, right top, from(#FFF), to('+color2+'))';
	} else if ($.browser.msie) {
		color1El.style.background = '-ms-linear-gradient(left, '+color1+', #FFF)';
		color2El.style.background = '-ms-linear-gradient(left, #FFF, '+color2+')';
	} else if ($.browser.mozilla) {
		color1El.style.background = '-moz-linear-gradient(to right, '+color1+', #FFF)';
		color2El.style.background = '-moz-linear-gradient(to right, #FFF, '+color2+')';
	} else if ($.browser.opera) {
		color1El.style.background = '-o-linear-gradient(left, '+color1+', #FFF)';
		color2El.style.background = '-o-linear-gradient(left, #FFF, '+color2+')';
	}
	
	legendEl.insertBefore(color2El, legendEl.firstChild);
	legendEl.insertBefore(color1El, legendEl.firstChild);
		
	return legendEl;
};