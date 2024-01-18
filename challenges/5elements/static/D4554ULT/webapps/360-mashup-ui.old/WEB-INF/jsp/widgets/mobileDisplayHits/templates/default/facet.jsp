<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import varFeeds="feeds" parameters="facet,feed,entry" />

<config:getOption var="baseUrl" name="hitFacetPageName" defaultValue="" feed="${feed}" entry="${entry}" />
<config:getOption var="nbSubFacets" name="nbSubFacets" defaultValue="0" />
<config:getOption var="hitFacetSortStrategy" name="hitFacetSortStrategy" defaultValue="default" />

<strong><search:getFacetLabel facet="${facet}" />:</strong>
<search:forEachCategory root="${facet}" var="cat" varStatus="status" iterationMode="all" iteration="${nbSubFacets}" varLevel="level" varPreviousLevel="previousLevel" sortMode="${hitFacetSortStrategy}">
	<c:if test="${!status.first}"><span class="refines-separator">${previousLevel < level ? '&gt;' : ','}</span></c:if>
	<render:categoryLink category="${cat}" baseUrl="${baseUrl}" feeds="${feeds}" />
</search:forEachCategory>
