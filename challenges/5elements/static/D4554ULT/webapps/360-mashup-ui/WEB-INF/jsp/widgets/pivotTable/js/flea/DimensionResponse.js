DimensionResponse = function () {
  this.categories = [];
};

// Please keep synced with java
DimensionResponse.prototype.jsonDeserialize = function (d) {
	var i;

  this.id = d[0];
  this.categories = [];
  for (i = 0; i < d[1].length; i ++) {
      this.categories[i] = new CategoryResponse().jsonDeserialize(d[1][i]);
  }

  return this;
};

DimensionResponse.prototype.jsonSerialize = function () {
	var d = [], i;

  d[0] = this.id;
  d[1] = [];
  for (i = 0; i < this.categories.length; i ++) {
      d[1][i] = this.categories[i].jsonSerialize();
  }

	return d;
};
