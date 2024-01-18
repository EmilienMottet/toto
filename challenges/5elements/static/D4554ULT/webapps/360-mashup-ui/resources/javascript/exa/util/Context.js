exa.provide("exa.util.Context");

exa.util.Context = function (context) {
	this.ctx_ = context;
};

exa.util.Context.prototype.f = function (func) {
	var ctx = this.ctx_;
	return function () {
		return func.apply(ctx, arguments);
	};
};
