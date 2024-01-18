<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />
<search:getFeed var="feed" feeds="${feeds}" />

<widget:widget disableStyles="true" extraCss="consumeFeed">
	<div class="wrapper">
		<c:choose>
			<c:when test="${feed == null}">
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</c:when>

			<c:otherwise>
				<search:forEachEntry var="entry" feed="${feed}">
					<widget:forEachSubWidget widgetContainer="${widget}" feed="${feed}" entry="${entry}">
						<render:widget />
					</widget:forEachSubWidget>
				</search:forEachEntry>
			</c:otherwise>
		</c:choose>
	</div>
</widget:widget>
