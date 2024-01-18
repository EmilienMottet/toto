<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="map" uri="http://www.exalead.com/jspapi/map" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="dbKey" name="dbKey" defaultValue="" />
<config:getOption var="type" name="type" defaultValue="" />
<config:getOption var="selector" name="selector" defaultValue="" />
<config:getOption var="action" name="action" defaultValue="" />
<config:getOption var="countSelector" name="countSelector" defaultValue="#bookmarks-count" />

<widget:widget varCssId="cssId" extraCss="bookmarks">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
		<span class="bookmarks-count"></span>
	</widget:header>

	<widget:content>
		<c:choose>
			<c:when test="${search:hasFeeds(feeds) == false}">
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:definition>
			</c:when>
			<c:otherwise>
				<div class="bookmarks-list"></div>
			</c:otherwise>
		</c:choose>
	</widget:content>
</widget:widget>

<%-- Compute our JSON --%>
<list:new var="feedEntries" />
<search:forEachFeed var="feed" feeds="${feeds}">
	<search:forEachEntry var="entry" feed="${feed}">
		<config:getOption var="displayExpression" name="displayExpression" entry="${entry}" feed="${feed}" isHighlighted="false" />
		<config:getOptionsComposite var="dataExpression" name="dataExpression" entry="${entry}" feed="${feed}" isHighlighted="false" />
		<map:new var="e" />
		<map:put map="${e}" key="cleanEntryId" value="${search:cleanEntryId(entry)}"/>
		<map:put map="${e}" key="display" value="${displayExpression}"/>
		<map:new var="data" />
		<c:forEach var="item" items="${dataExpression}">
			<c:if test="${item[0] != ''}">
				<map:put map="${data}" key="${item[0]}" value="${item[1]}" />
			</c:if>
		</c:forEach>
		<map:put map="${e}" key="data" value="${data}" />
		<list:add list="${feedEntries}" value="${e}" />
	</search:forEachEntry>
</search:forEachFeed>

<render:renderScript position="READY">
	$('#${cssId}').bookmarks('${widget.wuid}', <string:serialize object="${feedEntries}" />, { storageKey: '${dbKey}', scope: '${type}', selector: '${selector}', action: '${action}', countSelector: '${countSelector}' });
</render:renderScript>

