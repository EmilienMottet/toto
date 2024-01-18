<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="mappy" uri="http://www.exalead.com/jspapi/widget-mappy" %>

<render:import varWidget="widget" varFeeds="feeds" />

<render:renderOnce id="mappyAPI">
	<render:renderLater>
		<config:getOption var="mappyLogin" name="mappyLogin" />
		<config:getOption var="mappyPassword" name="mappyPassword" />
		<config:getOption var="proxyHost" name="proxyHost" />
		<config:getOption var="proxyPort" name="proxyPort" />
		<config:getOption var="proxyUser" name="proxyUser" />
		<config:getOption var="proxyPwd" name="proxyPwd" />
		<mappy:getToken
			var="mappyToken"
			mappyPassword="${mappyPassword}"
			mappyLogin="${mappyLogin}"
			proxyHost="${proxyHost}"
			proxyPort="${proxyPort}"
			proxyUser="${proxyUser}"
			proxyPwd="${proxyPwd}" />
		<c:if test="${mappyToken != null}">
			<script src="http://axe.mappy.com/1v1/init/get.aspx?auth=${mappyToken}&version=2.01&solution=ajax"></script>
		</c:if>
	</render:renderLater>
</render:renderOnce>

<config:getOption var="width" name="width" />
<c:if test="${width != null}"><c:set var="width" value="width:${width}px;" /></c:if>

<widget:widget varCssId="cssId" extraCss="mappy" extraStyles="${width}">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content>
	<c:choose>

		<c:when test="${search:hasFeeds(feeds) == false}">
			<%-- If widget has no Feed --%>
			<render:definition name="noFeeds">
				<render:parameter name="widget" value="${widget}" />
				<render:parameter name="showSuggestion" value="false" />
			</render:definition>
			<%-- /If widget has no Feed --%>
		</c:when>

		<c:otherwise>
			<config:getOption var="cssClass" name="cssClass" defaultValue="" />
			<config:getOption var="height" name="height" />
			<div id="mappyWrapper_${cssId}" class="mappyWrapper ${cssClass}" style="height:${height}px;"></div>

			<config:getOption var="location" name="location" defaultValue="" />
			<c:set var="lat" value="" />
			<c:set var="lng" value="" />
			<string:split string="${fn:replace(location,' ','')}" var="splitLocation"/>
			<c:if test="${fn:length(splitLocation) == 2}">
				<c:set var="lat" value="${splitLocation[0]}" />
				<c:set var="lng" value="${splitLocation[1]}" />
			</c:if>

			<config:getOption var="mappyDecoration" name="mappyDecoration" defaultValue="true" />
			<config:getOption var="integrate" name="hitPins" defaultValue="true" />
			<config:getOption var="appendMarker" name="appendMarker" defaultValue="" doEval="false"/>

			<config:getOption var="iconAnchorX" name="iconAnchorX" defaultValue="10"/>
			<config:getOption var="iconAnchorY" name="iconAnchorY" defaultValue="31"/>

			<config:getOption var="popUpAnchorX" name="popUpAnchorX" defaultValue="10"/>
			<config:getOption var="popUpAnchorY" name="popUpAnchorY" defaultValue="0"/>

			<config:getOption var="sizeHeight" name="sizeHeight" defaultValue="31"/>
			<config:getOption var="sizeWidth" name="sizeWidth" defaultValue="21"/>

			<%-- For each Feed used by this widget --%>
			<search:forEachFeed var="feed" feeds="${feeds}">
				<search:forEachEntry var="entry" feed="${feed}">
					<config:getOption var="messagePopup" name="messagePopup" defaultValue="" feed="${feed}" entry="${entry}" />
					<config:getOption var="popupTemplatePath" name="popupTemplatePath" defaultValue="" feed="${feed}" entry="${entry}" />
					<config:getOption var="hitUrl" name="hitUrl" defaultValue="" feed="${feed}" entry="${entry}" />
					<config:getOption var="iconLabel" name="iconLabel" defaultValue="" feed="${feed}" entry="${entry}" />
					<config:getOption var="iconUrl" name="iconUrl" defaultValue="" feed="${feed}" entry="${entry}" />
					<config:getOption var="markerBGColor" name="markerBGColor" defaultValue="#3279BE" feed="${feed}" entry="${entry}" />
					<config:getOption var="markerFGColor" name="markerFGColor" defaultValue="#FFF" feed="${feed}" entry="${entry}" />

					<url:url var="hitUrl" value="${hitUrl}" />

					<render:renderScript>
						<search:getMetaValue var="locationValue" entry="${entry}" metaName="${location}" isHighlighted="false" />
						<c:choose>
							<c:when test="${locationValue != null}">
								<string:split var="locationValue" string="${locationValue}" />
								<c:set var="markerLat" value="${locationValue[0]}" />
								<c:set var="markerLng" value="${locationValue[0]}" />
							</c:when>
							<c:otherwise>
								<search:getMetaValue var="markerLat" entry="${entry}" metaName="${lat}" isHighlighted="false" />
								<search:getMetaValue var="markerLng" entry="${entry}" metaName="${lng}" isHighlighted="false" />
							</c:otherwise>
						</c:choose>

						<c:if test="${markerLat != null && markerLng != null}">
							MappyManager.markers.push({
								lat: parseFloat('${markerLat}'),
								lon: parseFloat('${markerLng}'),

								bgColor: '${fn:replace(markerBGColor, '#', '')}',
								fgColor: '${fn:replace(markerFGColor, '#', '')}',

								<c:choose>
									<c:when test="${fn:length(popupTemplatePath) > 0}">
										messagePopup: '<string:escape escapeType="javascript">
											<render:template template="${popupTemplatePath}">
												<render:parameter name="feed" value="${feed}" />
												<render:parameter name="entry" value="${entry}" />
											</render:template>'
										</string:escape>',
									</c:when>

									<c:when test="${fn:length(messagePopup) > 0}">
										messagePopup: '<string:escape escapeType="javascript" value="${messagePopup}" />',
									</c:when>
								</c:choose>

								mappyDecoration: '${mappyDecoration}',

								iconAnchorX: parseInt('${iconAnchorX}'),
								iconAnchorY: parseInt('${iconAnchorY}'),

								popUpAnchorX: parseInt('${popUpAnchorX}'),
								popUpAnchorY: parseInt('${popUpAnchorY}'),

								sizeHeight: parseInt('${sizeHeight}'),
								sizeWidth: parseInt('${sizeWidth}'),

								<c:if test="${entry.id != null && integrate == 'true'}">
									$appendMarker: $('<string:eval entry="${entry}" string="${appendMarker}" feed="${feed}"/>'),
								</c:if>
								<c:if test="${fn:length(iconUrl) > 0}">
									image: '<c:url value="${iconUrl}" />',
									label: '${iconLabel}',
								</c:if>

								<c:if test="${fn:length(hitUrl) > 0}">
									url: '${hitUrl}',
								</c:if>

								end: true
							});
						</c:if>
					</render:renderScript>
				</search:forEachEntry>
			</search:forEachFeed>
			<%-- /For each Feed used by this widget --%>

			<render:renderScript>
				<config:getOption var="showMiniMap" name="showMiniMap" defaultValue="rb" />
				<config:getOption var="showIconMiniMap" name="showIconMiniMap" defaultValue="rb" />
				<config:getOption var="showIconMove" name="showIconMove" defaultValue="true" />
				<config:getOption var="showIconZoom" name="showIconZoom" defaultValue="true" />
				<config:getOption var="showIconMouseWheelZoom" name="showIconMouseWheelZoom" defaultValue="true" />
				<config:getOption var="showIconSelection" name="showIconSelection" defaultValue="true" />
				<config:getOption var="showIconSlider" name="showIconSlider" defaultValue="true" />
				<config:getOption var="showToolbar" name="showToolbar" defaultValue="lt" />
				<config:getOption var="disableScrollWheelZoom" name="disableScrollWheelZoom" defaultValue="false" />
				<config:getOption var="disableDraggable" name="disableDraggable" defaultValue="false" />

				$("#${cssId}").showSpinner();
				MappyManager.show('mappyWrapper_${cssId}');

				MappyManager.showMiniMap('${showMiniMap}');

				MappyManager.toolbar_showMiniMap('${showIconMiniMap}');
				MappyManager.toolbar_showMove(${showIconMove});
				MappyManager.toolbar_showZoom(${showIconZoom});
				MappyManager.toolbar_showMouseWheelZoom(${showIconMouseWheelZoom});
				MappyManager.toolbar_showSelection(${showIconSelection});
				MappyManager.toolbar_showSlider(${showIconSlider});
				MappyManager.showToolbar('${showToolbar}');

				MappyManager.disableScrollWheelZoom(${disableScrollWheelZoom});
				MappyManager.disableDraggable(${disableDraggable});

				<%-- 
					Register your own callback for reacting to changes of map center

					MappyManager.setOnDragEndCallback(function(map) { 
						console.log("center X:", map.getCenter().x, "center Y:", map.getCenter().y) 
						var bounds = map.getVisibleBounds(); 
						console.log('ne_x='+bounds.ne.x, 'ne_y='+bounds.ne.y, 'sw_x='+bounds.sw.x, 'sw_y='+bounds.sw.y); 
					});
				--%>

				$("#${cssId}").hideSpinner();
			</render:renderScript>
		</c:otherwise>
	</c:choose>
	</widget:content>
</widget:widget>
