<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url"%>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string"%>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search"%>

<render:import parameters="widget,accessFeeds,suggestions,feedWithMaxResults" />

<widget:widget extraCss="navigationHeader">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content extraCss="med-padding">
		<c:if test="${feedWithMaxResults != null}">

			<config:getOptionsComposite var="sortableExpr" name="sortableMetas" />
			<config:getOption var="perPageParameterName" name="perPageParameterName" defaultValue="" />
			<config:getOptions var="perPageChoices" name="perPageChoices" />
	
			<%-- Sort options --%>
			<c:if test="${search:hasEntries(accessFeeds) && fn:length(sortableExpr) > 0}">
				<span class="sort">
					<i18n:message code="sortedBy" />:
					<select onchange="exa.redirect($(this).val());">
						<search:getSortUrl var="noSortUrl" feeds="${accessFeeds}" />
						<option value="${noSortUrl}">--</option>
						<c:forEach var="expr" items="${sortableExpr}">
							<search:getSortUrl var="sortUrlDesc" varState="isUrlDesc" feeds="${accessFeeds}" expr="${expr[1]}" forceReverse="false" />
							<search:getSortUrl var="sortUrlAsc" varState="isUrlAsc" feeds="${accessFeeds}" expr="${expr[1]}" forceReverse="true" />
							<c:choose>
								<c:when test="${noSortUrl != sortUrlAsc}">
									<option value="${sortUrlAsc}" <c:if test="${isUrlAsc != ''}">selected</c:if>>${expr[0]} (<i18n:message code="ascending" />)</option>
									<option value="${sortUrlDesc}" <c:if test="${isUrlDesc != ''}">selected</c:if>>${expr[0]} (<i18n:message code="descending" />)</option>
								</c:when>
								<c:otherwise>
									<option value="${sortUrlDesc}" <c:if test="${isUrlDesc != ''}">selected</c:if>>${expr[0]}</option>
								</c:otherwise>
							</c:choose>
						</c:forEach>
					</select>
				</span>
			</c:if>

			<%-- Per page --%>
			<c:if test="${fn:length(perPageChoices) > 0 && fn:length(perPageParameterName) > 0}">
				<search:getPaginationInfos varPerPage="perPageCount" feeds="${accessFeeds}" />
				<span class="perPageSelect">
					<i18n:message code="perPage" />:
					<select onchange="exa.redirect($(this).val());">
					<c:forEach var="perPageChoice" items="${perPageChoices}">
						<c:set var="perPageChoiceDisplay" value="${perPageChoice * fn:length(accessFeeds)}" />
						<url:url var="perPageUrl" keepQueryString="true">
							<url:parameter name="${perPageParameterName}" value="${perPageChoice}" override="true" />
						</url:url>
						<option value="${perPageUrl}"<c:if test="${perPageCount == perPageChoiceDisplay}"> selected</c:if>>${perPageChoiceDisplay}</option>
					</c:forEach>
					</select>
				</span>
			</c:if>

			<%-- Navigation header --%>
			<p class="navigation">
				<config:getOption var="optionCustomHeaderMesssage" name="headerMesssage" defaultValue="" />
				<c:choose>
					<c:when test="${optionCustomHeaderMesssage != ''}">
						${optionCustomHeaderMesssage}
					</c:when>
					<c:otherwise>
						<search:getPaginationInfos varStart="startIndex" varEnd="endIndex" varTotal="totalResults" feeds="${accessFeeds}" />

						<c:choose>
							<c:when test="${totalResults > 0}">
								<i18n:message code="navigation.webResults" />
								<span>${startIndex}-${endIndex}</span>
								<i18n:message code="navigation.of" />
								<span>${totalResults}</span>

								<%--
									Hide the query
									<wh:i18n code="navigation.for" />
									<span title="<c:out value="${feedWithMaxResults.query}" />"><c:out value="${feedWithMaxResults.query}" /></span>,
								--%>

								<i18n:message code="navigation.page" />
								<span>${feedWithMaxResults.currentPage}</span>

								<c:if test="${feedWithMaxResults.currentPage > 1}">
									-
									<search:getPagePrevious varUrl="urlPreviousPage" feeds="${accessFeeds}" />
									<a class="topPreviousUrl" href="${urlPreviousPage}"><i18n:message code="navigation.previousPage"/></a>
								</c:if>

								<c:if test="${feedWithMaxResults.currentPage < feedWithMaxResults.lastPage}">
									-
									<search:getPageNext varUrl="urlNextPage" feeds="${accessFeeds}" />
									<a class="topNextUrl" href="${urlNextPage}"><i18n:message code="navigation.nextPage" /></a>
								</c:if>
							</c:when>
							<c:otherwise>
								<i18n:message code="navigation.noResult" />
							</c:otherwise>
						</c:choose>
					</c:otherwise>
				</c:choose>
			</p>
		</c:if>

		<%-- Spell Check Suggestions --%>
		<c:if test="${fn:length(suggestions) > 0}">
			<config:getOption var="queryParameter" name="spellSuggestionQueryParameter" defaultValue="" />
			<p class="suggestions">
				<config:getOption name="spellSuggestionText"/>
				<c:forEach var="suggestion" items="${suggestions}" varStatus="varStatus">
					<url:url var="spellCheckLink" keepQueryString="true">
						<url:parameter name="${queryParameter}" value="${suggestion}" override="true" urlEncode="false" />
					</url:url>
					<a href="${spellCheckLink}"><string:escape escapeType="HTML" value="${suggestion}"/></a>
					<c:if test="${varStatus.last == false}">
						<i18n:message code="suggestion.or" />
					</c:if>
				</c:forEach>
			</p>
		</c:if>
	</widget:content>

</widget:widget>