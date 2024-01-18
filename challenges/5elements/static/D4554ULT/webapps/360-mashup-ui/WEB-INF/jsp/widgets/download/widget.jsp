<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<search:getFeed var="feed" feeds="${feeds}" />
<search:getEntry var="entry" feed="${feed}" />

<widget:widget extraCss="download">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<c:choose>
		<c:when test="${entry == null}">
			<widget:content>
				<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noResults.jsp" />
				<render:template template="${noResultsJspPathHit}">
					<render:parameter name="accessFeeds" value="${feeds}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:template>
			</widget:content>
		</c:when>

		<c:otherwise>
			<widget:content extraCss="med-padding center">
				<config:getOption var="inline" name="inline" defaultValue="false" />
				<render:template template="download.jsp">
					<render:parameter name="feed" value="${feed}" />
					<render:parameter name="entry" value="${entry}" />
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="inline" value="${inline}" />
				</render:template>
			</widget:content>
		</c:otherwise>
	</c:choose>
</widget:widget>
