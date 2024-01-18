var refinesWidget = {
	state : [],
	initI18N : function(i18n) {
		refinesWidget.i18n = i18n;
	},
	initCheckboxes: function($widget) {
		$widget.bind('click', { _this: this }, function(e) {
			var target = e.data._this.getEventTarget(e);
			if (target != null) {
				if (target.attr('data-url') != null) {
					exa.redirect(target.attr('data-url'));
					return false;
				}
			}
		});
	},
	getEventTarget: function(e) {
		var target = null;
		try {
			if (!e) var e = window.event;
			if (e.target) target = e.target;
			else if (e.srcElement) target = e.srcElement;
			if (target.nodeType == 3) // defeat Safari bug
				target = targ.parentNode;
			// target = $(e.originalTarget || e.target)
			return $(target);
		} catch (e) {
		}
		return null;
	},
	initToggle: function($widget) {
		refinesWidget.loadState($widget);

		$widget.find('h3').bind('click', function(e) {
			var $this = $(this);
			$this.toggleClass('collapsed');
			var $table = $this.find('+table.facet');
			$table.toggleClass('collapsed');
			var value = $this.attr('name');
			if ($table.hasClass('collapsed')) {
				$.cookie('refine-' + value, 'collapsed');
			} else {
				$.cookie('refine-' + value, '');
			}
			refinesWidget.showRefinementsInfo($table);
		});
	},
	loadState : function ($widget) {
		$widget.find('h3').each(function() {
			var $this = $(this);
			var value = $this.attr('name');
			var cookieValue = $.cookie('refine-' + value);
			if (cookieValue != null && cookieValue == 'collapsed') {
				refinesWidget.showRefinementsInfo($this.find('+table.facet'));
			}
		});
	},
	showRefinementsInfo : function($table) {
		if ($table.hasClass('collapsed')) {
			var nbRefinements = $table.find('.refined,.excluded').length;
			var $infos = $table.prev('h3').find('> span.infos');
			if (nbRefinements == 0) {
				$infos.hide();
			} else if (nbRefinements == 1) {
				$infos.show();
				$infos.html(nbRefinements + ' ' + refinesWidget.i18n.singular);
			} else {
				$infos.show();
				$infos.html(nbRefinements + ' ' + refinesWidget.i18n.plural);
			}
		} else {
			var $infos = $table.prev('h3').find('> span.infos');
			$infos.hide();
		}
	}
};