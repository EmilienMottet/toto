<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url"%>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list"%>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search"%>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="spellSuggestionQueryParameter" name="spellSuggestionQueryParameter" defaultValue="q" />
<config:getOption var="spellSuggestionResultNumber" name="spellSuggestionResultNumber" defaultValue="-1" />
<search:getSpellCheckSuggestions varObject="suggestions" feeds="${feeds}" max="${spellSuggestionResultNumber}" />

<c:if test="${suggestions != null && fn:length(suggestions) > 0}">
	<widget:widget extraCss="spellCheckList">
		<widget:header>
			<config:getOption name="title" defaultValue="" />
		</widget:header>
		<widget:content extraCss="med-padding" htmlTag="ul">
			<c:forEach var="suggestion" items="${suggestions}" varStatus="varStatus">
				<li class="suggestion">
				<url:url var="spellCheckLink" keepQueryString="true">
					<url:parameter name="${spellSuggestionQueryParameter}" value="${suggestion.suggestedText}" override="true" urlEncode="false" />
				</url:url>
				<a href="${spellCheckLink}">${suggestion.suggestedText}<c:if test="${suggestion.nhits > 0}"> (${suggestion.nhits} hits)</c:if></a>
				</li>
			</c:forEach>
		</widget:content>
	</widget:widget>	
</c:if>