CategoryResponse = function () {
  this.pathToCell = [];
};

// Please keep synced with java
CategoryResponse.prototype.jsonDeserialize = function (d) {
	var i;

  this.title = d[0];
  this.path = d[1];
  this.nbLeaves = d[2];
  this.nbSpaces = d[3];

  return this;
};

CategoryResponse.prototype.jsonSerialize = function () {
	var d = [], i;

  d[0] = this.title;
  d[1] = this.path;
  d[2] = this.nbLeaves;
  d[3] = this.nbSpaces;

	return d;
};
