exa.provide('exa.ui.Pagination');

exa.require('exa.dom');
exa.require('exa.ui.Component');
exa.require('exa.ui.Button');

exa.ui.Pagination = function (options) {
	if (options.pageSize) {
		this.pageSize_ = options.pageSize;
	}
};

exa.inherit(exa.ui.Pagination, exa.ui.Component);

exa.ui.Pagination.prototype.pageSize_ = 10;
exa.ui.Pagination.prototype.currentPage_ = 0;
exa.ui.Pagination.prototype.numberOfRows_ = 0;


exa.ui.Pagination.prototype.createDom = function () {
	this.element_ = exa.dom.createDom('div', 'exa-pagination');
	var pagination = this.element_,
		next = new exa.ui.Button('\u25BA'),
		previous = new exa.ui.Button('\u25C4'),
		summary = exa.dom.createDom('span', 'exa-pagination-summary');
	
	previous.addClass('exa-rounded-left');
	next.addClass('exa-rounded-right');
	
	pagination.appendChild(summary);
	this.addChild(previous, true);
	this.addChild(next, true);
	
	this.previousPageEl_ = previous;
	this.nextPageEl_ = next;
	this.summary_ = summary;	
};

exa.ui.Pagination.prototype.enterDocument = function () {
	exa.ui.Pagination.superClass_.enterDocument.call(this);
	
	this.previousPageEl_.bind('mouseup', function () {
		if (this.currentPage_ > 0) {
			this.trigger('previous');
		}
	}, this);
	
	this.nextPageEl_.bind('mouseup', function () {
		if ((this.currentPage_+1) * this.pageSize_ < this.numberOfRows_) {			
			this.trigger('next');
		}
	}, this);
};

exa.ui.Pagination.prototype.setNumberOfRows = function (numberOfRows) {
	this.numberOfRows_ = numberOfRows;
};

exa.ui.Pagination.prototype.setPage = function (page) {
	this.currentPage_ = page;
};

exa.ui.Pagination.prototype.refresh = function () {
	var summary = this.summary_,
		numberOfRows = this.numberOfRows_,
		pageSize = this.pageSize_,
		page = this.currentPage_,
		startIndex = pageSize * page;	
	
	summary.innerHTML = (1+startIndex) + '-' + Math.min(startIndex + pageSize, numberOfRows) + ' of ' + numberOfRows;
	this.previousPageEl_.setEnabled(page != 0);
	this.nextPageEl_.setEnabled(startIndex + pageSize < numberOfRows);
};
