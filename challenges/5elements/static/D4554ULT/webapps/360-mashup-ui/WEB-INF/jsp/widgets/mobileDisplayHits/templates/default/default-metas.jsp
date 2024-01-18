<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varFeeds="feeds" parameters="feed,entry" />

<config:getOption var="showHitMetas" name="showHitMetas" defaultValue="true" />
<c:if test="${showHitMetas == true}">
	<config:getOption var="customDisplay" name="customDisplay" defaultValue="false" />
	<config:getOption var="filterMetas" name="filterMetas" defaultValue="" />
	<config:getOption var="metas" name="metas" defaultValue="" />
	<config:getOption var="showEmptyMetas" name="showEmptyMetas" defaultValue="false" />
	<config:getOption var="sortModeMetas" name="sortModeMetas" defaultValue="default" />
</c:if>
<config:getOption var="showHitFacets" name="showHitFacets" defaultValue="true" />
<c:if test="${showHitFacets == true}">
	<config:getOption var="hitFilterFacetsType" name="hitFilterFacetsType" defaultValue="No filtering" />
	<config:getOption var="hitFacetsList" name="hitFacetsList" defaultValue="" />
	<config:getOption var="showEmptyFacets" name="showEmptyFacets" defaultValue="false" />
	<config:getOption var="sortModeFacets" name="sortModeFacets" defaultValue="default" />
	<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
	<c:set var="templateBasePath" value="${templateBasePath}default" />
</c:if>

<%-- Displays Hit Metas --%>
<c:if test="${showHitMetas == 'true'}">
	<c:choose>
		<c:when test="${customDisplay == 'true'}">
			<config:getOption name="customMetasDisplay" defaultValue="" entry="${entry}" feed="${feed}"/>
		</c:when>

		<c:otherwise>
		<p>
			<%-- Iteration over metas --%>
				<search:forEachMeta
					var="meta"
					entry="${entry}"
					filterMode="${filterMetas}"
					metasList="${metas}"
					showEmptyMetas="${showEmptyMetas}"
					sortMode="${sortModeMetas}">
					<strong><search:getMetaLabel meta="${meta}"/>:</strong>
					<search:forEachMetaValue var="metaValue" varUrl="metaUrl" entry="${entry}" meta="${meta}" varStatus="status">
						<render:link href="${metaUrl}">${metaValue}</render:link><c:if test="${status.last == false}">,</c:if>
					</search:forEachMetaValue>
					<br />
				</search:forEachMeta>
				<%-- /Iteration over metas --%>
			</p>
		</c:otherwise>
	</c:choose>
</c:if>
<%-- /Displays Hit Metas --%>

<%-- Displays Hit Facets --%>
<c:if test="${showHitFacets == 'true'}">
	<p>
		<search:forEachFacet
			var="facet"
			entry="${entry}"
			filterMode="${hitFilterFacetsType}"
			facetsList="${hitFacetsList}"
			showEmptyFacets="${showEmptyFacets}"
			sortMode="${sortModeFacets}">
			<render:template template="${templateBasePath}/${fn:toLowerCase(facet.path)}/facet.jsp" defaultTemplate="${templateBasePath}/facet.jsp">
				<render:parameter name="feed" value="${feed}" />
				<render:parameter name="entry" value="${entry}" />
				<render:parameter name="facet" value="${facet}" />
			</render:template>
			<br />
		</search:forEachFacet>
	</p>
</c:if>
<%-- /Displays Hit Facets --%>
