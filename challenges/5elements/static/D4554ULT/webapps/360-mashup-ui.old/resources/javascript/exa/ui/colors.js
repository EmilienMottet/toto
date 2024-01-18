exa.provide('exa.ui.colors');
exa.provide('exa.ui.colors.Gradient');

exa.ui.colors.regExp = /^#([0-9a-fA-F]{3}){1,2}$/;

exa.ui.colors.isColor = function (value) {
	exa.ui.colors.regExp.lastIndex = 0;
	return exa.ui.colors.regExp.test(value);
};
exa.ui.colors.rgb2hex = function (rgb) {
	var h = '#',
		hex;	
	for (var i = 0; i < rgb.length; i ++) {
		 hex = rgb[i].toString(16);
         if (hex.length == 1) {
        	 hex = '0' + hex;
         }
         h = h + hex;
	}	
	return h;
};

exa.ui.colors.hex2rgb = function (h) {
	h = h.replace('#', '');
	if (h.length == 3) {
		return  [parseInt(h[0]+h[0], 16), parseInt(h[1]+h[1], 16), parseInt(h[2]+h[2], 16)];
	} else if (h.length == 6) {	
		return  [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
	}
	return [0,0,0];
};

exa.ui.colors.colorFromBg = function (bgColor) {
	var rgb = exa.ui.colors.hex2rgb(bgColor),
		test,
		color;
	test = 1 - ( 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;	
	if (test < 0.5) {
		color = '#000000';
	} else {
		color = '#FFFFFF';
	}
	return color; 
};

exa.ui.colors.Gradient = function (start, end) {
	var endRGB = exa.ui.colors.hex2rgb(end);
	this.startRGB = exa.ui.colors.hex2rgb(start);		
	this.diffRGB = [ 
        endRGB[0] - this.startRGB[0],
        endRGB[1] - this.startRGB[1],
        endRGB[2] - this.startRGB[2]
    ];
    this.endRGB = endRGB;
};

exa.ui.colors.Gradient.prototype.getColor = function (percent) {
	/* from start color to white and from white to end color */
	var tmpRGB;
	if (percent >= 0.5) {
		percent = 2*(percent-0.5);
		tmpRGB = [
          parseInt(255 - percent * (255 - this.endRGB[0]), 10),
          parseInt(255 - percent * (255 - this.endRGB[1]), 10),
          parseInt(255 - percent * (255 - this.endRGB[2]), 10)
        ];
	} else {
		percent = 2*(0.5 - percent);
		tmpRGB = [
          parseInt(255 - percent * (255 - this.startRGB[0]), 10),
          parseInt(255 - percent * (255 - this.startRGB[1]), 10),
          parseInt(255 - percent * (255 - this.startRGB[2]), 10)
        ];
	}
	return exa.ui.colors.rgb2hex(tmpRGB);
};

exa.ui.colors.Gradient.prototype.getColorNoWhite = function (percent) {
	var tmpRGB = [
	  parseInt(percent * this.diffRGB[0] + this.startRGB[0], 10),
	  parseInt(percent * this.diffRGB[1] + this.startRGB[1], 10),
	  parseInt(percent * this.diffRGB[2] + this.startRGB[2], 10)
	];
	return exa.ui.colors.rgb2hex(tmpRGB);
};
