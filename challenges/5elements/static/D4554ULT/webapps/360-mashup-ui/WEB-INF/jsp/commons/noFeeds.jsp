<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<render:import parameters="widget,showSuggestion" />

<div class="noresult">
	<h3 class="secondaryTitle"><i18n:message code="nofeed.title" /></h3>
	<p class="query">
		<c:forEach var="feedsId" items="${widget.useFeeds.feedsId}">
			<span>"${feedsId}"</span><br />
		</c:forEach>
	</p>

	<c:if test="${showSuggestion == 'true'}">
		<h3 class="secondaryTitle"><i18n:message code="nofeed.suggestionTitle" />:</h3>
		<ul class="suggestions">
			<li><i18n:message code="nofeed.suggestion1" /></li>
			<li><i18n:message code="nofeed.suggestion2" /></li>
			<li><i18n:message code="nofeed.suggestion3" /></li>
		</ul>
	</c:if>
</div>
