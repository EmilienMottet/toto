<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import parameters="accessFeeds,feed,entry,widget" />
<render:import parameters="hitUrl" ignore="true" />

<%-- retrieve the widget options --%>
<config:getOption var="metaUrlTarget" name="metaUrlTarget" defaultValue="" />
<config:getOption var="showHitFacets" name="showHitFacets" defaultValue="true" />
<config:getOption var="showHitMetas" name="showHitMetas" defaultValue="true" />
<config:getOption var="showContent" name="showTextOnTop" defaultValue="true" />
<config:getOption var="showHitId" name="showHitId" defaultValue="true" />
<c:if test="${showHitFacets == 'true'}">
	<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
	<config:getOption var="hitFilterFacetsType" name="hitFilterFacetsType" defaultValue="No filtering" />
	<config:getOption var="hitFacetsList" name="hitFacetsList" defaultValue="" />
	<config:getOption var="sortModeFacets" name="sortModeFacets" defaultValue="default" />
    <config:getOption var="showEmptyFacets" name="showEmptyFacets" defaultValue="true" />
</c:if>
<c:if test="${showHitMetas == 'true'}">
	<config:getOption var="filterMetas" name="filterMetas" defaultValue="No filtering" />
	<config:getOption var="metasList" name="metas" />
	<config:getOption var="showEmptyMetas" name="showEmptyMetas" defaultValue="true" />
	<config:getOption var="sortModeMetas" name="sortModeMetas" defaultValue="default" />
	<config:getOption var="customDisplay" name="customDisplay" defaultValue="false" />
</c:if>

<c:set var="metaUrlTarget" value="${metaUrlTarget == 'New Page' ? '_blank' : ''}" />
<c:set var="hasContent" value="${showContent && entry.content != null && entry.content != ''}" />

<%-- Hit Text --%>
<c:if test="${hasContent}">
	<table class="contentWrapper hitContent hitText">
		<tr>
			<td class="text">
				<c:if test="${hasContent}">
					<config:getOption var="showTextOnTopTruncate" name="showTextOnTopTruncate" defaultValue="500" />
					<p>
						<i18n:message var="i18nShow" code="truncate-tag-show" />
						<i18n:message var="i18nHide" code="truncate-tag-hide" />
						<string:truncate text="${entry.content}" labelHide="${i18nHide}" labelShow="${i18nShow}"  truncateFrom="${showTextOnTopTruncate}" />
					</p>
				</c:if>
			</td>
		</tr>
	</table>
</c:if>

<table class="hitContent hitMetasFacets table table-condensed table-transparent">
	<%-- Displays Hit Metas --%>
	<c:if test="${showHitMetas == 'true'}">
	<c:choose>
		<c:when test="${customDisplay == 'true'}">
			<tr>
				<td colspan="2">
					<config:getOption name="customMetasDisplay" defaultValue="" entry="${entry}" feed="${feed}"/>
				</td>
			</tr>
		</c:when>
		<c:otherwise>
			<search:forEachMeta var="meta" entry="${entry}" filterMode="${filterMetas}" metasList="${metasList}" showEmptyMetas="${showEmptyMetas}" sortMode="${sortModeMetas}">
				<tr class="meta">
					<td>
						<span class="text-light metaName"><search:getMetaLabel meta="${meta}" />:</span>&nbsp;<span class="metaValue">
						<search:forEachMetaValue entry="${entry}" meta="${meta}" var="value" varUrl="metaUrl" varStatus="status">
							<render:link href="${metaUrl}" target="${metaUrlTarget}">${value}</render:link><c:if test="${status.last == false}">,</c:if>
						</search:forEachMetaValue>
						</span>
					</td>
				</tr>
			</search:forEachMeta>
		</c:otherwise>
	</c:choose>
	</c:if>

	<%-- Displays Hit Facets --%>
	<c:if test="${showHitFacets == 'true'}">
		<search:forEachFacet var="facet" entry="${entry}" filterMode="${hitFilterFacetsType}" facetsList="${hitFacetsList}" showEmptyFacets="${showEmptyFacets}" sortMode="${sortModeFacets}">
			<tr class="facet">
				<td>
					<render:template template="${templateBasePath}${fn:toLowerCase(facet.path)}/facet.jsp" defaultTemplate="${templateBasePath}default/facet.jsp">
						<render:parameter name="widget" value="${widget}" />
						<render:parameter name="accessFeeds" value="${accessFeeds}" />
						<render:parameter name="feed" value="${feed}" />
						<render:parameter name="entry" value="${entry}" />
						<render:parameter name="facet" value="${facet}" />
					</render:template>
				</td>
			</tr>
		</search:forEachFacet>
	</c:if>

	<%-- Displays Hit ID --%>
	<c:if test="${showHitId == 'true'}">
		<tr class="uri">
			<td>
				<c:choose>
					<c:when test="${url:isUrl(entry.id)}">
						<render:link href="${entry.id}" target="${metaUrlTarget}" title="id" extraCss="green">${entry.id}</render:link>
					</c:when>
					<c:otherwise><span class="uriName">id:</span>&nbsp;<span class="uriValue text-uri" title="id">${entry.id}</span></c:otherwise>
				</c:choose>
			</td>
		</tr>
	</c:if>

	<%-- Similar query --%>
	<config:getOption var="similarUrl" name="similarUrl" entry="${entry}" feed="${feed}" defaultValue="" />
	<c:if test="${similarUrl != ''}">
		<tr class="similar">
			<td>
				<a href="${similarUrl}" title="similar"><i18n:message code="more-like-this" /></a>
			</td>
		</tr>
	</c:if>

</table>
