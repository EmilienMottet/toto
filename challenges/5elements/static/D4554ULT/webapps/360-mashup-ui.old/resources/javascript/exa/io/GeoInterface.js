exa.provide('exa.io.GeoInterface');

exa.require('exa.geo.Polygon');
exa.require('exa.geo.Circle');


exa.io.GeoInterface = function () {};

exa.io.GeoInterface.prototype.addPolygon = null;

exa.io.GeoInterface.prototype.addCircle = null;

exa.io.GeoInterface.prototype.addMarker = null;

exa.io.GeoInterface.prototype.getPolygons = null;

exa.io.GeoInterface.prototype.getCircles = null;

exa.io.GeoInterface.prototype.addOnChangedListener = null;

