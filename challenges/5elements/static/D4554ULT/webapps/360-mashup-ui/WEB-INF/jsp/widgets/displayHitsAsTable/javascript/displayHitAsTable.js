var displayHitsAsTable = {
	showMore: function(span) {
		var tdWrap = $(span).closest('div.tdWrapper');
		tdWrap.addClass('notAbstract');
		var expand = $('div.expand', tdWrap);
		var td = $(tdWrap).parent();
		expand.css('position', 'absolute');
		expand.css('top', (td.position().top) + "px");
		expand.css('left', (td.position().left) + "px");
		expand.css('min-height', td.height() + 1);
		var width = td.width();
		while(td.next().length > 0) {
			width += td.next().outerWidth();
			if (width > 400) {
				break;
			}
		}
		expand.css('width', (width + 1) + 'px');

		var _this = this;
		expand.bind('mouseleave', function(e) {
			_this.showLess(expand)
		});
	},
	showLess: function(span) {
		// console.log("Showless");
		var td = $(span).closest('div.tdWrapper');
		td.removeClass('notAbstract');
		var expand = $('div.expand', td);
	}
};