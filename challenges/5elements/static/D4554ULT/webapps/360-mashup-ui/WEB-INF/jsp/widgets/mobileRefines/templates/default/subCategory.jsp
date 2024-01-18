<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import parameters="widget,accessFeeds,facet,categoryTemplatePath" />

<config:getOption var="values" name="values" defaultValue="" />
<config:getOption var="isDisjunctive" name="isDisjunctive" defaultValue="false" />
<config:getOption var="sortMode" name="sortMode" defaultValue="default" />
<config:getOption var="nbSubFacets" name="nbSubFacets" defaultValue="0" />
<config:getOption var="iterMode" name="iterMode" defaultValue="all" />
<config:getOption var="drillDown" name="drillDown" defaultValue="false" />
<config:getOption var="displayExclude" name="displayExclude" defaultValue="false" />
<config:getOption var="facetPageName" name="facetPageName" defaultValue=""/>
<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />

<c:if test="${iterMode == 'flat' && drillDown == 'true'}">
	<c:set var="iterMode" value="drilldown" />
</c:if>

<search:forEachCategory 
	var="category"
	varLevel="depthLevel"
	varStatus="status"
	root="${facet}"
	sortMode="${sortMode}"
	iteration="${nbSubFacets}"
	iterationMode="${iterMode}"
	drillDown="${drillDown}">

		<search:getCategoryUrl var="categoryUrl" baseUrl="${facetPageName}" varClassName="className" category="${category}" feeds="${accessFeeds}" forceRefineOn="${forceRefineOnFeeds}" />

		<tr class="category depthLevel_${depthLevel} ${status.index % 2 == 0 ? 'odd' : 'even'} ${className}">
			<c:if test="${isDisjunctive == true}">
				<td class="disjunctive">
					<input type="checkbox" data-url="${categoryUrl}" <c:if test="${category.state == 'REFINED'}">checked="checked"</c:if>/>
				</td>
			</c:if>

			<td class="refineName">
				<render:template template="${categoryTemplatePath}">
					<render:parameter name="categoryUrl" value="${categoryUrl}" />
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="category" value="${category}" />
					<render:parameter name="accessFeeds" value="${accessFeeds}" />
				</render:template>
			</td>

			<c:if test="${values != ''}">
				<td class="count">
					<c:if test="${values == 'count'}">
						<c:set var="fillerWidth" value="${20 + (cat.count * 25) / category.count}" />
					</c:if>
					<div class="countcontainer" style="width: ${(fillerWidth == null || fillerWidth > 45) ? 45 : fillerWidth}px">
						<search:getCategoryValueType var="type" category="${category}" name="${values}" />
						<c:choose>
							<c:when test="${type == 'STRING'}">
								<search:getCategoryValue category="${category}" name="${values}" />
							</c:when>
							<c:otherwise>
								<string:formatNumber>
									<search:getCategoryValue category="${category}" name="${values}"
										defaultValue="0" />
								</string:formatNumber>
							</c:otherwise>
						</c:choose>
					</div>
				</td>
			</c:if>

			<c:if test="${displayExclude == 'true'}">
				<td class="exclude">
					<c:choose>
						<c:when test="${className == 'displayed' || className == 'refined'}">
							<%-- Show exclude link if needed --%>
							<search:getCategoryUrl var="categoryUrl" baseUrl="${facetPageName}" category="${category}" forceState="EXCLUDED" feeds="${accessFeeds}" forceRefineOn="${forceRefineOnFeeds}" />
							<a href="${categoryUrl}" class="exclude" title="<i18n:message code="refines.exclude" />"><i18n:message code="refines.x" /></a>
						</c:when>
						<c:otherwise>
							<%-- Show cancel link if needed --%>
							<a href="${categoryUrl}" class="cancel" title="<i18n:message code="refines.cancel" />"><i18n:message code="refines.x" /></a>
						</c:otherwise>
					</c:choose>
				</td>
			</c:if>
		</tr>
</search:forEachCategory>
