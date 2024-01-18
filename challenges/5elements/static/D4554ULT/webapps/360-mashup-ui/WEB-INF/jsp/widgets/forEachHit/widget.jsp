<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />
<render:getPlatform var="platform" />

<search:getFeed var="feed" feeds="${feeds}" />
<config:getOption var="htmlTag" name="htmlTag" defaultValue="div"/>

<widget:widget disableWrapper="${platform == 'MOBILE'}" extraCss="forEachHit" disableStyles="true" htmlTag="${htmlTag}">
	<c:choose>
		<c:when test="${feed == null}">
			<render:definition name="noFeeds">
				<render:parameter name="widget" value="${widget}" />
				<render:parameter name="showSuggestion" value="false" />
			</render:definition>
		</c:when>
		<c:otherwise>
			<config:getOption var="maxIteration" name="maxIteration" defaultValue="0" />
			<search:forEachEntry var="entry" feed="${feed}" iteration="${maxIteration}">
				<widget:forEachSubWidget widgetContainer="${widget}" feed="${feed}" entry="${entry}">
					<render:widget />
				</widget:forEachSubWidget>
			</search:forEachEntry>
		</c:otherwise>
	</c:choose>
</widget:widget>
