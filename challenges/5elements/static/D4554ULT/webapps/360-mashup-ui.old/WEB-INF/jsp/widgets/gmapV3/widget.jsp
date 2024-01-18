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

<%-- This API MUST be loaded after Map API V2 --%>
<render:renderOnce id="googleGmapAPIV3">			
	<config:getOption var="clientId" name="clientId" />
	<config:getOption var="keyType" name="keyType"/>
	<c:set var="keyTypeParam" value=""/>
	<c:if test="${keyType == 'clientid'}">
		<c:set var="keyTypeParam" value="client"/>
	</c:if>
	<c:if test="${keyType == 'key'}">
		<c:set var="keyTypeParam" value="key"/>
	</c:if>
	
	<c:set var="clientIdParam" value="" />
	<c:if test="${clientId != null && keyType != 'free'}">
		<c:set var="clientIdParam" value="&${keyTypeParam}=${clientId}" />
	</c:if>
	<script src="https://maps.google.com/maps/api/js?language=${i18nLang}&libraries=drawing,visualization${clientIdParam}" type="text/javascript"></script>
</render:renderOnce>

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

		<render:renderScript>
			(function () {
                if (window.google === undefined) { $('#${cssId}').css('display', 'none'); return; }
				var mapWidget = new GoogleMapWidget('${cssId}_map', {		 		
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
			 		mapTypeId: '<config:getOption name="mapTypeId" defaultValue="ROADMAP"/>',
			 		streetViewControl: <config:getOption name="streetViewControl" defaultValue="false"/>,
					mapTypeControl: <config:getOption name="mapTypeControl" defaultValue="false"/>
				});
				
				
				var iconFactory = new GoogleIconFactory({						  
					iconAnchorX:<config:getOption name="iconAnchorX" defaultValue="10"/>,
					iconAnchorY:<config:getOption name="iconAnchorY" defaultValue="31"/>,
					sizeHeight:<config:getOption name="sizeHeight" defaultValue="34"/>,
					sizeWidth:<config:getOption name="sizeWidth" defaultValue="21"/>,
					bgColor:'<config:getOption name="gmarkerBGColor" defaultValue="#3279BE"/>',
					fgColor:'<config:getOption name="gmarkerFGColor" defaultValue="#FFF"/>'
				});
				
				
				var markerManager = new GoogleMarkerManager('${widget.wuid}', mapWidget, iconFactory);
				
				<render:template template="markers.jsp">
					<render:parameter name="feeds" value="${feeds}"/>
				</render:template>
				<config:getOption var="geofacet_useHeatmap" name="geofacet_useHeatmap" defaultValue="false"/>
				var formManager = new GoogleFormManager(mapWidget);
				formManager.setEditable(<config:getOption name="geoFormEdition" defaultValue="false"/>);
				formManager.setEnableHeatmap(${geofacet_useHeatmap});
				<render:template template="geofacet.jsp">
					<render:parameter name="feeds" value="${feeds}"/>
				</render:template>
				<c:if test="${geofacet_useHeatmap == false}">
					formManager.computeFacetColors();
				</c:if>
				
				exa.io.share('exa.io.GeoInterface', '${widget.wuid}', new GeoInterfaceImpl(formManager, markerManager).getInterface());
				
				mapWidget.decorate();
															
				$('#${cssId}').data('markerManager', markerManager);
				$('#${cssId}').data('formManager', formManager);
				
			})();
			
		</render:renderScript>

	</c:otherwise>
</c:choose>