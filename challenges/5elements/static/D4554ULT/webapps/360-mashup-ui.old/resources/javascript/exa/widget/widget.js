exa.provide('exa.widget');

exa.widget.getUcssId = function (widget) {
	// dependency with UCssId.java
	var match;
	if (widget.className && (match = widget.className.match(/[^_\ ]{8}_(?:[0-9]+_[^\ ]+)?/gi)) != null) {
		return match[0];
	}
	return null;
};

exa.widget.getParentWidget = function (widget) {
	var $widget = $(widget);
	if ($widget.hasClass('wuid')) {
		return $widget.parent().closest('.wuid')[0] || null;
	} else {
		return $widget.closest('.wuid')[0] || null;
	}
};

exa.widget.getPath = function (widget) {
	var parent;
	if ((parent = exa.widget.getParentWidget(widget)) != null) {
		return exa.widget.getPath(parent) + ':' + exa.widget.getUcssId(widget);
	}
	return exa.widget.getUcssId(widget);
};
