<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="mobileDisplayHits">
	
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>
	
	<c:choose>
		<c:when test="${search:hasFeeds(feeds) == false}">
				<%-- If widget has no Feed --%>
				<render:definition name="noFeeds.mobile">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:definition>
				<%-- /If widget has no Feed --%>
		</c:when>

		<c:when test="${search:hasEntries(feeds) == false}">
				<%-- If all feeds have no results --%>
				<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/mobile/commons/noResults.jsp" />
				<render:template template="${noResultsJspPathHit}">
					<render:parameter name="accessFeeds" value="${feeds}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:template>
				<%-- /If all feeds have no results --%>
		</c:when>

		<c:otherwise>
		
				<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
				<config:getOption var="defaultJspPathHit" name="defaultJspPathHit" defaultValue="default/default.jsp" />

				<ul>
				<search:forEachFeed var="feed" feeds="${feeds}" varStatus="accessFeedsStatus">
					<search:forEachEntry var="entry" feed="${feed}" varStatus="entryStatus">

						<config:getOption var="hitTemplatePath" name="customJspPathHit" defaultValue="" entry="${entry}" feed="${feed}" />
						<config:getOption var="hitTitle" name="hitTitle" defaultValue="\${entry.title}" entry="${entry}" feed="${feed}" />
						<config:getOption var="hitUrl" name="hitUrl" defaultValue="" entry="${entry}" feed="${feed}" />

						<%-- Find a custom view for this hit --%>
						<render:template template="${templateBasePath}${hitTemplatePath}" defaultTemplate="${templateBasePath}${defaultJspPathHit}">
							<render:parameter name="feed" value="${feed}" />
							<render:parameter name="entry" value="${entry}" />
							<c:if test="${hitUrl != ''}">
								<url:url var="hitUrl" value="${hitUrl}" />
								<render:parameter name="hitUrl" value="${hitUrl}" />
							</c:if>
							<c:if test="${hitTitle != ''}">
								<render:parameter name="hitTitle" value="${hitTitle}" />
							</c:if>
							<render:parameter name="accessFeedsStatus" value="${accessFeedsStatus}" />
							<render:parameter name="entryStatus" value="${entryStatus}" />
						</render:template>
						<%-- /Find a custom view for this hit --%>
					</search:forEachEntry>
				</search:forEachFeed>
				</ul>
		</c:otherwise>
	</c:choose>
	
</widget:widget>
