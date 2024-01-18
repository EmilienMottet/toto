<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>

<render:import varWidget="widget" varFeeds="feeds" />

<request:getParameterValue var="ajax" name="${widget.wuid}_ajax" defaultValue="false"/>
<c:choose>
	<c:when test="${ajax == true}">
		<request:getParameterValue var="cssId" name="${widget.wuid}_cssId" defaultValue=""/>
		<render:renderScript>
			(function() {
				var markerManager = $('#${cssId}').data('markerManager');
				markerManager.clearMarkers();
				<render:template template="markers.jsp">
					<render:parameter name="feeds" value="${feeds}"/>
				</render:template>
				
				var formManager = $('#${cssId}').data('formManager');
				formManager.clearFacets();				
				<render:template template="geofacet.jsp">
					<render:parameter name="feeds" value="${feeds}"/>
				</render:template>
			})();
		</render:renderScript>
	</c:when>

	<c:otherwise>
		<config:getOption var="divWidth" name="width" />
		<c:if test="${divWidth != null}"><c:set var="divWidth" value="width:${divWidth}px;" /></c:if>

		<widget:widget varCssId="cssId" varUcssId="ucssId" extraCss="gmap" extraStyles="${divWidth}">
			<widget:header>
				<config:getOption name="title" defaultValue=""/>
			</widget:header>
			<config:getOption var="divHeight" name="height" />
			<widget:content extraStyles="height:${divHeight}px;" cssId="${cssId}_map">
			
			</widget:content>
		</widget:widget>
		<config:getOption var="provider" name="provider" defaultValue="MapQuest"/>
		<c:if test="${provider == 'MapQuest'}">
			<render:renderOnce id="mapQuestAPI">
				<config:getOption name="apiKey" var="apiKey"/>
				<script src="https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-map.js?key=${apiKey}"></script>
			</render:renderOnce>
		</c:if>
		<render:renderScript>
			(function () {
				<c:choose>
					<c:when test="${provider == 'Bing'}">
						var provider = new BingProvider('<config:getOption name="apiKey"/>');
					</c:when>
					<c:otherwise>
						var provider = new MapQuestProvider('<config:getOption name="apiKey"/>');
					</c:otherwise>
				</c:choose>
				 	
				var mapWidget = new LeafletMap('${cssId}_map', {		 		
			 		<config:getOptions var="wuids" name="ajaxWUIDs" />
					<c:if test="${fn:length(wuids) > 0}">
					ajax: {
						cssId: '${cssId}',
						wuid:'${widget.wuid}',
						wuids: ['<string:join list="${wuids}" separator="','"/>'],
						latParameterName: '<config:getOption name="ajaxParameterNameLat" defaultValue="lat" />',
						lngParameterName: '<config:getOption name="ajaxParameterNameLng" defaultValue="lng" />',
						zoomlevelParameterName: '<config:getOption name="ajaxParameterNameZoomLevel" defaultValue="zoomlevel" />'
					},
					</c:if>
					defaultZoom: parseInt(<config:getOption name="defaultZoom" defaultValue="11"/>),					
			 		provider: provider
				});
				
				var iconFactory = new LeafletIconFactory({
					className:'<config:getOption name="iconClassName" defaultValue=""/>',
					iconAnchorX:<config:getOption name="iconAnchorX" defaultValue="10"/>,
					iconAnchorY:<config:getOption name="iconAnchorY" defaultValue="31"/>,
					sizeHeight:<config:getOption name="sizeHeight" defaultValue="34"/>,
					sizeWidth:<config:getOption name="sizeWidth" defaultValue="21"/>,
					bgColor:'<config:getOption name="gmarkerBGColor" defaultValue="#3279BE"/>',
					fgColor:'<config:getOption name="gmarkerFGColor" defaultValue="#FFF"/>'
				});
				
				var markerManager = new LeafletMarkerManager('${widget.wuid}', mapWidget, iconFactory);				
				<render:template template="markers.jsp">
					<render:parameter name="feeds" value="${feeds}"/>
				</render:template>				
				markerManager.fitMarkers();
				
				var formManager = new LeafletFormManager(mapWidget);
				formManager.setEditable(<config:getOption name="geoFormEdition" defaultValue="false"/>);
				<render:template template="geofacet.jsp">
					<render:parameter name="feeds" value="${feeds}"/>
				</render:template>
				formManager.computeFacetColors();
				formManager.fitForms();
				
				exa.io.share('exa.io.GeoInterface', '${widget.wuid}', new GeoInterfaceImpl(formManager, markerManager).getInterface());
			})();
			
		</render:renderScript>
	</c:otherwise>
</c:choose>