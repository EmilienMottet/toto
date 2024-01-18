<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="displayHits" uri="http://www.exalead.com/displayHits-widget-helpers" %>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="refines" varCssId="cssId">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content extraCss="facets">
		<c:choose>
			<c:when test="${search:hasFeeds(feeds) == false}">
				<%-- If widget has no Feed --%>
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
				<%-- /If widget has no Feed --%>
			</c:when>

			<c:otherwise>
				<config:getOption var="facetsListMode" name="facetsListMode" defaultValue="No filtering"/>
				<config:getOption var="facetsList" name="facetsList" defaultValue=""/>
				<config:getOption var="values" name="values" defaultValue="" />
				<config:getOption var="showEmptyFacets" name="showEmptyFacets" defaultValue="false"/>
				<config:getOption var="sortModeFacets" name="sortModeFacets" defaultValue="default"/>
				<config:getOption name="filterNullAggregation" var="filterNullAggregation" defaultValue="false"/>
				<config:getOption name="defaultValue" var="defaultValue" defaultValue="0"/>

				<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/"/>
				<config:getOption var="facetTemplateDirectory" name="facetTemplateDirectory" defaultValue="default"/>
				<c:set var="facetTemplateDirectory" value="${templateBasePath}${facetTemplateDirectory}" />	

				<c:set var="noResults" value="true" />
				<search:forEachFacet
					var="facet"
					feeds="${feeds}"
					filterMode="${facetsListMode}"
					facetsList="${facetsList}"
					showEmptyFacets="${showEmptyFacets}"
					sortMode="${sortModeFacets}"
					filterNullAggregation="${filterNullAggregation}"
					aggregationToPreserve="${values}">

					<c:remove var="noResults" />

						<displayHits:jspFileCheck var="categoryTemplatePath" defaultJspPath="${facetTemplateDirectory}/category.jsp" customJspPath="${facetTemplateDirectory}/${fn:toLowerCase(facet.path)}/category.jsp"/>

						<render:template template="${facetTemplateDirectory}/${fn:toLowerCase(facet.path)}/facet.jsp" defaultTemplate="${facetTemplateDirectory}/facet.jsp">
							<render:parameter name="widget" value="${widget}" />
							<render:parameter name="facet" value="${facet}" />
							<render:parameter name="accessFeeds" value="${feeds}" />
						</render:template>

						<request:getCookieValue var="cookieVal" name="refineWidget" defaultValue="" />
						<string:unescape var="cookieVal" escapeType="URL">${cookieVal}</string:unescape>
						<string:split var="cookieValues" separator=";" string="${cookieVal}"/>
						<c:set var="cookieClassName" value="table-collapsable" />
						<c:forEach var="val" items="${cookieValues}">
							<c:if test="${val == search:cleanFacetId(facet)}">
								<c:set var="cookieClassName" value="table-collapsed" />
							</c:if>
						</c:forEach>						
						<table class="facet table table-layout table-facets table-hover ${cookieClassName}">
							<render:template template="${facetTemplateDirectory}/${fn:toLowerCase(facet.path)}/subCategory.jsp" defaultTemplate="${facetTemplateDirectory}/subCategory.jsp">
								<render:parameter name="widget" value="${widget}" />
								<render:parameter name="facet" value="${facet}" />
								<render:parameter name="accessFeeds" value="${feeds}" />
								<render:parameter name="categoryTemplatePath" value="${categoryTemplatePath}" />
							</render:template>
						</table>
				</search:forEachFacet>

				<config:getOption var="isDisjunctive" name="isDisjunctive" defaultValue="false" />
				<render:renderScript position="READY">
					<render:renderOnce id="initRefinesWidget">
						refinesWidget.initI18N({
							singular: "<i18n:message code="refines.singular" />",
							plural: "<i18n:message code="refines.plural" />"
						});
					</render:renderOnce>

					refinesWidget.initToggle($('#${cssId}'));
					<c:if test="${isDisjunctive == true}">
						refinesWidget.initCheckboxes($('#${cssId}'));
					</c:if>
				</render:renderScript>
			</c:otherwise>
		</c:choose>
	
		<c:if test="${noResults && search:hasFeeds(feeds) == true}">
			<%-- If all feeds have no results --%>
			<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
			<render:template template="${noResultsJspPathHit}">
				<render:parameter name="accessFeeds" value="${feeds}" />
				<render:parameter name="showSuggestion" value="true" />
			</render:template>
			<%-- /If all feeds have no results --%>
		</c:if>
	</widget:content>

</widget:widget>
