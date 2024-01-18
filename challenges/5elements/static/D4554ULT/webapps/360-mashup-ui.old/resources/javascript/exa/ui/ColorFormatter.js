exa.provide('exa.ui.ColorFormater');

exa.ui.ColorFormater = function () {
	this.ranges = [];
};

exa.ui.ColorFormater.prototype.addRange = function(from, to, color, bgcolor) {
	this.ranges.push({
		from : from,
		to : to,
		color : color,
		bgcolor : bgcolor
	});	
};

exa.ui.ColorFormater.prototype.format = function(dataTable, columnIndex) {
	var ranges = this.ranges,
		sb = new exa.string.StringBuilder();
	
	for (var rowIndex = 0; rowIndex < dataTable.getNumberOfRows(); rowIndex++) {
		var v = dataTable.getValue(rowIndex, columnIndex);
		for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
			var range = ranges[rangeIndex];
			if (v >= range.from && v <= range.to) {
				sb.set(dataTable.getProperty(rowIndex, columnIndex, 'style'));
				if (range.color) {
					sb.append('color:').append(range.color).append(';');
				}
				if (range.bgcolor) {
					sb.append(' background-color:').append(range.bgcolor).append(';');
				}
				if (sb.getLength() > 0) {
					dataTable.setProperty(rowIndex, columnIndex, 'style', sb.toString());
				}
				break;
			}
		}
	}
};

