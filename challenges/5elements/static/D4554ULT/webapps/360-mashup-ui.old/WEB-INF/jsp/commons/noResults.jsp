<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<render:import parameters="accessFeeds,showSuggestion" />

<config:getOption var="displayStackTrace" name="displayStackTrace" component="${v10MashupUI}" defaultValue="false" />

<div class="noresult">
	<h3 class="secondaryTitle rounded-top"><i18n:message code="noresults.title" /></h3>
	<p class="query">
		<search:forEachFeed feeds="${accessFeeds}" var="feed">
			<c:choose>
				<c:when test="${feed.error == null}">
					<span title="${feed.id}"><c:out value="${feed.query}" /></span>
				</c:when>
				<c:when test="${displayStackTrace == 'false'}">
					<span title="${feed.id}"><i18n:message code="noresults.failedMessage" /></span>
				</c:when>
				<c:otherwise>
					<span><c:out value="${feed.error.message}" /></span>
				</c:otherwise>
			</c:choose>
		</search:forEachFeed>
	</p>

	<c:if test="${showSuggestion == 'true'}">
		<h3 class="secondaryTitle"><i18n:message code="noresults.suggestionTitle" />:</h3>
		<ul class="suggestions">
			<li><i18n:message code="noresults.suggestion1" /></li>
			<li><i18n:message code="noresults.suggestion2" /></li>
			<li><i18n:message code="noresults.suggestion3" /></li>
			<li><i18n:message code="noresults.suggestion4" /></li>
			<li><i18n:message code="noresults.suggestion5" /></li>
		</ul>
	</c:if>
</div>
