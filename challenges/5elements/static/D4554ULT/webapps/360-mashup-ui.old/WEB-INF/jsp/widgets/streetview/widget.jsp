<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<render:ifPlatform type="WEB">
	<render:renderLater>
		<render:renderOnce id="googleGmapAPIV3">			
			<config:getOption var="clientId" name="clientId" />
			<c:set var="clientIdParam" value="" />
			<c:if test="${clientId != null}"><c:set var="clientIdParam" value="&client=${clientId}" /></c:if>
			<script src="https://maps.google.com/maps/api/js?sensor=false&language=${i18nLang}&libraries=drawing,visualization${clientIdParam}" type="text/javascript"></script>
		</render:renderOnce>
	</render:renderLater>
</render:ifPlatform>

<config:getOption var="height" name="height" defaultValue="350" />
<config:getOption var="width" name="width" />
<c:if test="${width != null}"><c:set var="width" value="width:${width}px;" /></c:if>

<widget:widget extraCss="streetview" extraStyles="${width}" varCssId="cssId">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content cssId="streetviewSVG_${cssId}" extraStyles="height:${height}px;">
		<c:choose>
			<%-- If widget has no Feed --%>
			<c:when test="${search:hasFeeds(feeds) == false}">
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</c:when>

			<c:otherwise>				
				<%-- Retrieve coordinates of the first entry --%>
				<search:getFeed feeds="${feeds}" var="feed" />
				<search:getEntry var="entry" feed="${feed}" />
				
				<config:getOption var="addr" name="addr" entry="${entry}" feed="${feed}" isHighlighted="false"/>
				<config:getOption var="location" name="location" entry="${entry}" feed="${feed}" isHighlighted="false"/>

				<render:renderScript position="READY">
					(function () {
						var streetViewService = new google.maps.StreetViewService(),
							displayError = function () {
								$('#streetviewSVG_${cssId}').html('<p class="streetview-no-data">No panorama found.</p>');
							},
							callback = function (data, status) {
								switch (status) {
								case google.maps.StreetViewStatus.OK:
									new google.maps.StreetViewPanorama(document.getElementById('streetviewSVG_${cssId}'), {
										pano: data.location.pano
									});								
									break;
								default:
									displayError();
								}								
							};	
					<c:choose>
						<c:when test="${fn:length(location) > 0}">
							streetViewService.getPanoramaByLocation(new google.maps.LatLng(${location}), 50, callback);
						</c:when>
						<c:when test="${fn:length(addr) > 0 }">
							new google.maps.Geocoder().geocode({'address': '${addr}' }, function(results, status) {
								switch (status) {
								case google.maps.GeocoderStatus.OK:
									streetViewService.getPanoramaByLocation(results[0].geometry.location, 50, callback);
									break;
								case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
								default:
									displayError();
									break;
								}
							});
						</c:when>
					</c:choose>
					})();
				</render:renderScript>		
			</c:otherwise>
		</c:choose>
	</widget:content>
</widget:widget>
