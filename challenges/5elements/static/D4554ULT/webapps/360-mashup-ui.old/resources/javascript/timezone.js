
(function () {
	var offset = new Date().getTimezoneOffset();
	
	var tz;
	// Yes this is awkward...
	if (offset > 0) {
		tz = "-";
	} else {
		tz = "+";
	}
	var minute = Math.abs(offset);	
	var hour = Math.floor(minute / 60);
	minute = minute % 60;
	if (hour < 10) {
		tz += "0";
	}
	tz += hour;
	tz += ":";
	if (minute < 10) {
		tz += "0";
	}
	tz += minute;
	$.cookie("mashup-timezone", tz);
})();