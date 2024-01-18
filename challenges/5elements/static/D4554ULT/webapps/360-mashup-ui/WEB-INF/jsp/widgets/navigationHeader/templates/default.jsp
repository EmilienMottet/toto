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

	<%-- Navigation header --%>
	<c:if test="${feedWithMaxResults != null}">

		<config:getOptionsComposite var="sortableExpr" name="sortableMetas" />
		<config:getOption var="perPageParameterName" name="perPageParameterName" defaultValue="" />
		<config:getOptions var="perPageChoices" name="perPageChoices" />

		<widget:header htmlTag="div" extraCss="${fn:length(suggestions) == 0 ? 'rounded' : ''}">

			<c:if test="${search:hasEntries(accessFeeds) && fn:length(sortableExpr) > 0}">
				<div class="headerSort">
					<span class="sortBy"><i18n:message code="sortBy" /></span>
					<c:forEach var="expr" items="${sortableExpr}">
						<search:getSortUrl var="sortUrl" varState="sortState" feeds="${accessFeeds}" expr="${expr[1]}" defaultOrder="${expr[2]}" />
						<span class="sortOption ${sortState}"><a href="${sortUrl}">${expr[0]}</a></span>
					</c:forEach>
				</div>
			</c:if>

			<c:if test="${fn:length(perPageChoices) > 0 && fn:length(perPageParameterName) > 0}">
				<search:getPaginationInfos varPerPage="perPageCount" feeds="${accessFeeds}" />
				<div class="headerPerPage">
					<span class="perPage"><i18n:message code="perPage" /></span>
					<c:forEach var="perPageChoice" items="${perPageChoices}">
						<c:set var="perPageChoiceDisplay" value="${perPageChoice * fn:length(accessFeeds)}" />
						<url:url var="perPageUrl" keepQueryString="true">
							<url:parameter name="${perPageParameterName}" value="${perPageChoice}" override="true" />
						</url:url>
						<c:set var="className" value="${perPageCount == perPageChoiceDisplay ? ' selected' : ''}" />
						<span class="perPageOption${className}"><a href="${perPageUrl}">${perPageChoiceDisplay}</a></span>
					</c:forEach>
				</div>
			</c:if>

			<config:getOption name="title" defaultValue="\${i18n['navigation.webResults']}" /> <span>&rsaquo;</span>

			<%-- Num results --%>
			<config:getOption var="optionCustomHeaderMesssage" name="headerMesssage" defaultValue="" />
			<c:choose>
				<c:when test="${optionCustomHeaderMesssage != ''}">
					${optionCustomHeaderMesssage}
				</c:when>
				<c:otherwise>
					<search:getPaginationInfos varStart="startIndex" varEnd="endIndex" varTotal="totalResults" feeds="${accessFeeds}" />
					<c:choose>
						<c:when test="${totalResults > 0}">
							<span>${startIndex}-${endIndex}</span>
							<i18n:message code="navigation.of" />
							<span>${totalResults}</span>
						</c:when>
						<c:otherwise>
							<i18n:message code="navigation.noResult" />
						</c:otherwise>
					</c:choose>
				</c:otherwise>
			</c:choose>
		</widget:header>
	</c:if>

	<%-- Spell Check Suggestions --%>
	<c:if test="${fn:length(suggestions) > 0}">
		<config:getOption var="queryParameter" name="spellSuggestionQueryParameter" defaultValue="" />
		<widget:content extraCss="med-padding">
			<config:getOption name="spellSuggestionText" />
			<c:forEach var="suggestion" items="${suggestions}" varStatus="varStatus">
				<url:url var="spellCheckLink" keepQueryString="true">
					<url:parameter name="${queryParameter}" value="${suggestion}" override="true" urlEncode="false" />
				</url:url>
				<a href="${spellCheckLink}"><string:escape escapeType="HTML" value="${suggestion}"/></a>
				<c:if test="${varStatus.last == false}">
					<i18n:message code="suggestion.or" />
				</c:if>
			</c:forEach>
		</widget:content>
	</c:if>
</widget:widget>
