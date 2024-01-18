Response = function () {
  this.columns = [];
  this.rows = [];
  this.measures = [];
  this.query = "#all";
  this.feedName = "";
  this.pendingRefines = "";
};

// Please keep synced with java
Response.prototype.jsonDeserialize = function (d) {
	var i;

  this.columns = [];
  for (i = 0; i < d[0].length; i ++) {
    this.columns[i] = new DimensionResponse().jsonDeserialize(d[0][i]);
  }

  this.rows = [];
  for (i = 0; i < d[1].length; i ++) {
    this.rows[i] = new DimensionResponse().jsonDeserialize(d[1][i]);
  }

  this.measures = [];
  for (i = 0; i < d[2].length; i ++) {
    this.measures[i] = new MeasureResponse().jsonDeserialize(d[2][i]);
  }

  this.query = d[3];
  this.feedName = d[4];
  this.pendingRefines = d[5];

  return this;
};

Response.prototype.jsonSerialize = function () {
	var d = [], i;

  d[0] = [];
  for (i = 0; i < this.columns.length; i ++) {
      d[0][i] = this.columns[i].jsonSerialize();
  }
  d[1] = [];
  for (i = 0; i < this.rows.length; i ++) {
      d[1][i] = this.rows[i].jsonSerialize();
  }
  d[2] = [];
  for (i = 0; i < this.measures.length; i ++) {
      d[2][i] = this.measures[i].jsonSerialize();
  }

	return d;
};
