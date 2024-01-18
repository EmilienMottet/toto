<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list"%>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search"%>

<render:import varWidget="widget" varFeeds="feeds" />

<c:choose>
	<c:when test="${search:hasFeeds(feeds) == false}">
		<widget:widget extraCss="navigationHeader">
			<widget:header>
				<config:getOption name="title" defaultValue="" />
			</widget:header>
			<widget:content>
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</widget:content>
		</widget:widget>
	</c:when>
	
	<c:otherwise>

		<%-- suggestions --%>
		<config:getOption var="spellSuggestionEnable" name="spellSuggestionEnable" defaultValue="false" />
		<c:if test="${spellSuggestionEnable == true}">
			<config:getOption var="spellSuggestionResultNumber" name="spellSuggestionResultNumber" defaultValue="-1" />
			<search:getSpellCheckSuggestions var="suggestions" feeds="${feeds}" max="${spellSuggestionResultNumber}" />
		</c:if>

		<%-- suggestions: backport --%>
		<c:if test="${suggestions == null}">
			<list:new var="suggestions" />
		</c:if>

		<%-- feed with most results --%>
		<search:getPaginationInfos varFeed="feedWithMaxResults" feeds="${feeds}" />

		<%-- Render the widget with the selected template --%>
		<config:getOption var="jspPath" name="jspPath" />
		<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
		<render:template template="${templateBasePath}${jspPath}" defaultTemplate="${templateBasePath}default.jsp">
			<render:parameter name="accessFeeds" value="${feeds}" />
			<render:parameter name="widget" value="${widget}" />
			<render:parameter name="suggestions" value="${suggestions}" />
			<render:parameter name="feedWithMaxResults" value="${feedWithMaxResults}" />
		</render:template>
	</c:otherwise>
</c:choose>
