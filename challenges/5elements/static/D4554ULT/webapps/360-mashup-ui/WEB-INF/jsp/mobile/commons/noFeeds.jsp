<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<render:import parameters="widget,showSuggestion" />

<div>
	<h3><i18n:message code="nofeed.title" /></h3>
	<p>
		<c:forEach var="feedsId" items="${widget.useFeeds.feedsId}">
			<span>"${feedsId}"</span><br />
		</c:forEach>
	</p>

	<c:if test="${showSuggestion == 'true'}">
		<p><strong><i18n:message code="nofeed.suggestionTitle" />:</strong></p>
		<ul>
			<li><i18n:message code="nofeed.suggestion1" /></li>
			<li><i18n:message code="nofeed.suggestion2" /></li>
			<li><i18n:message code="nofeed.suggestion3" /></li>
		</ul>
	</c:if>
</div>
