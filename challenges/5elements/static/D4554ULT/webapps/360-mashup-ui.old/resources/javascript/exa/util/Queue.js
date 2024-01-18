exa.provide('exa.util.Queue');

exa.util.Queue = function () {
	this.elements_ = [];
};

exa.util.Queue.prototype.head_ = 0;
exa.util.Queue.prototype.tail_ = 0;

exa.util.Queue.prototype.enqueue = function (element) {
	 this.elements_[this.tail_++] = element;
};

exa.util.Queue.prototype.dequeue = function() {
	if (this.head_ == this.tail_) {
		return null;
	}
	var result = this.elements_[this.head_];
	delete this.elements_[this.head_];
	this.head_++;
	return result;
};

exa.util.Queue.prototype.peek = function() {
	if (this.head_ == this.tail_) {
		return null;
	}
	return this.elements_[this.head_];
};

exa.util.Queue.prototype.getCount = function () {
	return this.tail_ - this.head_;
};

exa.util.Queue.prototype.clear = function() {
	this.elements_.length = 0;
	this.head_ = 0;
	this.tail_ = 0;
};