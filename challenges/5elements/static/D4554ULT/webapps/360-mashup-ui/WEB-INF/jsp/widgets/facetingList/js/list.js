
var FacetingList = function (data, options) {
	this.data = data;
	options = options || {};
	if (exa.isDef(options.enablePagination)) {
		this.paginationEnabled = options.enablePagination;
	}
	if (exa.isDef(options.paginationSize)) {
		this.paginationSize = options.paginationSize;
	}
	if (exa.isDef(options.enableFiltering)) {
		this.enableFiltering = options.enableFiltering;
	}
};
exa.inherit(FacetingList, exa.ui.Component);

FacetingList.prototype.paginationEnabled = true;
FacetingList.prototype.paginationSize = 10;
FacetingList.prototype.currentPage = 0;
	
FacetingList.prototype.createDom = function () {
	FacetingList.superClass_.createDom.call(this);
	
	var input,
		list = exa.dom.createDom('ul'),
		pagination;
	
	if (this.enableFiltering) {
		input = new exa.ui.Input('text');
		input.addClass('exa-faceting-list-input');	
		this.addChild(input, this);
		this.input_ = input;
	}
	
	this.element_.appendChild(list);
	
	if (this.paginationEnabled) {
		pagination = new exa.ui.Pagination({ pageSize: this.paginationSize });
		pagination.setVisible(false);
		this.addChild(pagination, true);
		this.pagination_ = pagination;
	}
	this.list_ = list;
	
	this.refresh();
};

FacetingList.prototype.enterDocument = function () {
	FacetingList.superClass_.enterDocument.call(this);
	if (this.enableFiltering) {
		this.input_.bind('keyup', this.onkeyup_, this);
		this.input_.bind('changed', this.onchanged_, this);
	}
	if (this.paginationEnabled) {
		this.pagination_.bind('previous', this.previousPage_, this);
		this.pagination_.bind('next', this.nextPage_, this);
	}
};

FacetingList.prototype.previousPage_ = function () {
	this.currentPage--;
	this.refresh();
};

FacetingList.prototype.nextPage_ = function () {
	this.currentPage++;
	this.refresh();
};

FacetingList.prototype.onkeyup_ = function () {
	clearTimeout(this.filterTimeout_);
	this.filterTimeout_ = setTimeout($.proxy(function () {
		this.onchanged_();
	}, this), 100);
};

FacetingList.prototype.onchanged_ = function () {
	var filtering = this.input_.getValue();
	if (this.filtering != filtering) {
		this.filtering = filtering;
		this.currentPage = 0;
		this.refresh();
	}
};

FacetingList.prototype.iterate = function (data, cat, regExp, depth) {
	var curLength = data.length;
	for (var i = 0; i < cat.children.length ; i ++) {
		this.iterate(data, cat.children[i], regExp, depth+1);		
	}
	cat.depth = depth;
	regExp.lastIndex = 0;
	if (regExp.test(cat.label.toLowerCase()) || curLength < data.length) {
		data.splice(curLength, 0, cat);
	} 
};

FacetingList.prototype.refresh = function () {
	var data = this.data,
		flattenedData = [],
		filteringRegExp,
		paginationEnabled = this.paginationEnabled;
	
	if (this.enableFiltering && this.filtering) {
		filteringRegExp = new RegExp(this.filtering.toLowerCase());
	} else {
		filteringRegExp = /.*/g;
		if (this.enableFiltering) {
			if (data.length == 0) {
				this.input_.setVisible(false);
			} else {
				this.input_.setVisible(true);
			}
		}
	}
	
	for (var i = 0; i < data.length; i ++) {
		this.iterate(flattenedData, data[i], filteringRegExp, 0);
	}
	var startIndex = paginationEnabled ? this.currentPage * this.paginationSize : 0,
		endIndex = paginationEnabled ? Math.min(flattenedData.length, startIndex+this.paginationSize) : flattenedData.length,
		list = this.list_;
	
	exa.dom.removeChildren(list);
	for (var i = startIndex; i < endIndex; i ++) {		
		list.appendChild(this.createLi_(flattenedData[i]));
	}
	if (paginationEnabled) {
		if (flattenedData.length > this.paginationSize) {
			this.pagination_.setNumberOfRows(flattenedData.length);
			this.pagination_.setPage(this.currentPage);
			this.pagination_.setVisible(true);
			this.pagination_.refresh();
		} else {
			this.pagination_.setVisible(false);
		}
	}
};

FacetingList.prototype.createLi_ = function (element) {
	var li = exa.dom.createDom('li', 'exa-faceting-list-li'),
		aggregation = exa.dom.createDom('span', 'exa-faceting-list-li-aggr');

	var a;
	if (element.url) {
		a = exa.dom.createDom('a', 'exa-faceting-list-li-a');
		a.href = element.url;
	} else {
		a = exa.dom.createDom('span', 'exa-faceting-list-li-a');
	}
	
	if (element.refined) {
		exa.dom.addClass(li, 'exa-faceting-list-li-refined');
	}
	a.style.cssText = 'padding-left:' + element.depth*5+ 'px;';
	exa.dom.setTextContent(a, element.label);
	exa.dom.setTextContent(aggregation, element.aggregation);
	
	li.appendChild(aggregation);
	li.appendChild(a);
	return li;
};