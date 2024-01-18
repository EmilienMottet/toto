<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="pagination">
<c:choose>
	<c:when test="${search:hasFeeds(feeds) == false}">
		<widget:content>
			<render:definition name="noFeeds">
				<render:parameter name="widget" value="${widget}" />
				<render:parameter name="showSuggestion" value="false" />
			</render:definition>
		</widget:content>
	</c:when>
	<c:otherwise>
		<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
		<config:getOption var="optionDefaultJspPathfooter" name="jspPath" />
		<render:template template="${templateBasePath}${optionDefaultJspPathfooter}" defaultTemplate="${templateBasePath}default.jsp">
			<render:parameter name="accessFeeds" value="${feeds}" />
			<render:parameter name="widget" value="${widget}" />
		</render:template>
	</c:otherwise>
</c:choose>
</widget:widget>