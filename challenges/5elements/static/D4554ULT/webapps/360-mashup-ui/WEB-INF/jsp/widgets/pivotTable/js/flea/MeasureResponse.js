MeasureResponse = function () {
  this.longData = [];
  this.doubleData = [];
};

// Please keep synced with java
MeasureResponse.prototype.jsonDeserialize = function (d) {
	var i;

  this.name = d[0];
  this.type = d[1];
  this.decimals = d[2];
  this.longData = d[3];
  this.doubleData = d[4];

  return this;
};

MeasureResponse.prototype.jsonSerialize = function () {
	var d = [], i;

  d[0] = this.name;
  d[1] = this.type;
  d[2] = this.decimals;
  d[3] = this.longData;
  d[4] = this.doubleData;

	return d;
};
