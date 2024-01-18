<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="dbKey" name="dbKey" defaultValue="SavedQueriesWidget[]" />
<config:getOption var="type" name="type" defaultValue="Shared" />
<config:getOption var="showDelete" name="showDelete" defaultValue="true" />
<config:getOption var="showSave" name="showSave" defaultValue="true" />
<config:getOption var="showExpanded" name="showExpanded" defaultValue="false" />

<widget:widget varCssId="widgetId" extraCss="savedQueries">
	<widget:header htmlTag="div">
		<a href="#" class="show"><i18n:message code="saved-queries" /></a>
		<a href="#" class="hide"><i18n:message code="hide-queries" /></a>
		<c:if test="${showSave}">
			<a href="#" class="save"><i18n:message code="save-this-page" /></a>
		</c:if>
	</widget:header>
	<widget:content>
		<ul></ul>
	</widget:content>
</widget:widget>

<render:renderScript position="READY">
	new SavedQueries({type: '${type}', key: '${dbKey}'}).onReady({widgetId: '${widgetId}', showDelete: ${showDelete}, showExpanded: ${showExpanded}});
</render:renderScript>
