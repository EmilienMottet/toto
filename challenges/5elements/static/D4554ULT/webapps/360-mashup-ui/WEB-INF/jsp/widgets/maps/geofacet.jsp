<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>


<render:import varFeeds="feeds" />
<%--
	********
	 FACETS 
	********
--%>
<config:getOption var="geoFacetsList" name="geoFacetsList" defaultValue=""/>

<c:if test="${fn:length(geoFacetsList) > 0}">	
	<%-- For each Facets used by this widget --%>
	<config:getOption var="geofacet_hitFacetPageName" name="geofacet_hitFacetPageName" defaultValue=""/>
	<config:getOptions var="geofacet_forceRefineOnFeeds" name="geofacet_forceRefineOnFeeds" defaultValue=""/>	
	<config:getOption var="geofacet_aggregation" name="geofacet_aggregation" defaultValue="count"/>
	<config:getOption var="geofacet_tooltip" name="geofacet_tooltip" doEval="false"/>
	<search:forEachFacet 
		var="facet"
		feeds="${feeds}"
		filterMode="INCLUDE"
		facetsList="${geoFacetsList}">
		<search:forEachCategory 
			root="${facet}"
			var="category">

			<c:if test="${fn:contains(category.data, 'disk(')}">
				<c:set var="subCategoryId">${fn:substring(category.data, 5, fn:length(category.data)-1)}</c:set>
				<string:split string="${subCategoryId}" var="diskParameters" separator="," />
				<c:if test="${fn:length(diskParameters) == 3}">
				 	formManager.addDiskFacet('${diskParameters[0]}', '${diskParameters[1]}', '${diskParameters[2]}', '<search:getCategoryUrl category="${category}" feeds="${feeds}" forceRefineOn="${geofacet_forceRefineOnFeeds}" baseUrl="${geofacet_hitFacetPageName}" forHtml="false" />', <search:getCategoryValue name="${geofacet_aggregation}" category="${category}"/>, '<string:eval string="${geofacet_tooltip}" category="${category}" facet="${facet}" />');				 
				 </c:if>
			</c:if>
			<c:if test="${fn:contains(category.id, 'disk(')}">
				<c:set var="subCategoryId">${fn:substringAfter(category.id, facet.id)}</c:set>
				<c:set var="subCategoryId">${fn:substring(subCategoryId, 6, fn:length(subCategoryId)-1)}</c:set>
				<string:split string="${subCategoryId}" var="diskParameters" separator="," />
				<c:if test="${fn:length(diskParameters) == 3}">
				 	formManager.addDiskFacet('${diskParameters[0]}', '${diskParameters[1]}', '${diskParameters[2]}', '<search:getCategoryUrl category="${category}" feeds="${feeds}" forceRefineOn="${geofacet_forceRefineOnFeeds}" baseUrl="${geofacet_hitFacetPageName}" forHtml="false" />', <search:getCategoryValue name="${geofacet_aggregation}" category="${category}"/>, '<string:eval string="${geofacet_tooltip}" category="${category}" facet="${facet}" />');				 
				 </c:if>
			</c:if>

			<c:if test="${fn:contains(category.data, 'poly(')}">
				<c:set var="subCategoryId">${fn:substring(category.data, 5, fn:length(category.data)-1)}</c:set>				
				<string:split string="${subCategoryId}" var="polyParameters" separator=";" />
				<c:if test="${fn:length(polyParameters) > 2}">
				 	formManager.addPolygonFacet(["${fn:join(polyParameters, '","')}"], '<search:getCategoryUrl category="${category}" feeds="${feeds}"  forceRefineOn="${geofacet_forceRefineOnFeeds}" baseUrl="${geofacet_hitFacetPageName}" forHtml="false" />', <search:getCategoryValue name="${geofacet_aggregation}" category="${category}"/>, '<string:eval string="${geofacet_tooltip}" category="${category}" facet="${facet}" />');				 
				 </c:if>
			</c:if>
			<c:if test="${fn:contains(category.id, 'poly(')}">
				<c:set var="subCategoryId">${fn:substringAfter(category.id, facet.id)}</c:set>
				<c:set var="subCategoryId">${fn:substring(subCategoryId, 6, fn:length(subCategoryId)-1)}</c:set>				
				<string:split string="${subCategoryId}" var="polyParameters" separator=";" />
				<c:if test="${fn:length(polyParameters) > 2}">
				 	formManager.addPolygonFacet(["${fn:join(polyParameters, '","')}"], '<search:getCategoryUrl category="${category}" feeds="${feeds}"  forceRefineOn="${geofacet_forceRefineOnFeeds}" baseUrl="${geofacet_hitFacetPageName}" forHtml="false" />', <search:getCategoryValue name="${geofacet_aggregation}" category="${category}"/>, '<string:eval string="${geofacet_tooltip}" category="${category}" facet="${facet}" />');				 
				 </c:if>
			</c:if>

			<c:if test="${fn:contains(category.data, 'bounds(')}">
				<c:set var="subCategoryId">${fn:substring(category.data, 7, fn:length(category.data)-1)}</c:set>
				<string:split string="${subCategoryId}" var="boundsParameters" separator=";" />
				<c:if test="${fn:length(boundsParameters) == 2}">
				 	formManager.addBoundsFacet("${boundsParameters[0]}","${boundsParameters[1]}", '<search:getCategoryUrl category="${category}" feeds="${feeds}"  forceRefineOn="${geofacet_forceRefineOnFeeds}" baseUrl="${geofacet_hitFacetPageName}" forHtml="false" />', <search:getCategoryValue name="${geofacet_aggregation}" category="${category}"/>, '<string:eval string="${geofacet_tooltip}" category="${category}" facet="${facet}" />');
				 </c:if>
			</c:if>
			<c:if test="${fn:contains(category.id, 'bounds(')}">
				<c:set var="subCategoryId">${fn:substringAfter(category.id, facet.id)}</c:set>
				<c:set var="subCategoryId">${fn:substring(subCategoryId, 8, fn:length(subCategoryId)-1)}</c:set>
				<string:split string="${subCategoryId}" var="boundsParameters" separator=";" />
				<c:if test="${fn:length(boundsParameters) == 2}">
				 	formManager.addBoundsFacet("${boundsParameters[0]}","${boundsParameters[1]}", '<search:getCategoryUrl category="${category}" feeds="${feeds}"  forceRefineOn="${geofacet_forceRefineOnFeeds}" baseUrl="${geofacet_hitFacetPageName}" forHtml="false" />', <search:getCategoryValue name="${geofacet_aggregation}" category="${category}"/>, '<string:eval string="${geofacet_tooltip}" category="${category}" facet="${facet}" />');
				 </c:if>
			</c:if>
		</search:forEachCategory>
	</search:forEachFacet>
	<%-- /For each Facets used by this widget --%>
</c:if>
