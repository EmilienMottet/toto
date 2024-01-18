<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<search:getFeed var="feed" feeds="${feeds}" />
<search:getEntry var="entry" feed="${feed}" />

<config:getOption var="showPreviewInLighBox" name="showPreviewInLighBox" defaultValue="false" />

<widget:widget extraCss="preview">

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

		<c:when test="${showPreviewInLighBox == true}">
			<render:template template="previewInLightBox.jsp">
				<render:parameter name="feed" value="${feed}" />
				<render:parameter name="entry" value="${entry}" />
				<render:parameter name="widget" value="${widget}" />
			</render:template>
		</c:when>

		<c:otherwise>
			<search:getEntryHtmlPreviewUrl var="previewUrl" entry="${entry}" feed="${feed}" />
				<c:choose>
					<c:when test="${previewUrl != null}">
						<config:getOption var="height" name="height" />
						<iframe src="${previewUrl}" width="100%" height="${height}"></iframe>
					</c:when>
					<c:otherwise>
						<widget:content extraCss="med-padding center">
							<i18n:message code="previewUnavailable" />
						</widget:content>
					</c:otherwise>
				</c:choose>
		</c:otherwise>
	</c:choose>
</widget:widget>
