<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>

<render:import parameters="widget,accessFeeds,feed,entry,facet" />

<config:getOption var="baseUrl" name="hitFacetPageName" defaultValue="" feed="${feed}" entry="${entry}" />
<config:getOption var="iteration" name="nbSubFacets" defaultValue="0" />
<config:getOption var="sortMode" name="hitFacetSortStrategy" defaultValue="default" />
<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />

<span class="facetContent facetName text-light"><search:getFacetLabel facet="${facet}" />:</span>&nbsp;<span class="facetValue">
	<search:forEachCategory var="category" varStatus="status" root="${facet}" iterationMode="ALL" sortMode="${sortMode}" iteration="${iteration}">
		<c:if test="${!status.first}"><span class="refines-separator">,</span></c:if>

		<url:resource var="flagUrl" file="/resources/images/flags/${fn:toLowerCase(category.description)}.png" testIfExists="true" />
		<c:if test="${flagUrl}">
			<img class="flag" src="${flagUrl}" />
		</c:if>

		<render:categoryLink category="${category}" baseUrl="${baseUrl}" feeds="${accessFeeds}" forceRefineOn="${forceRefineOnFeeds}" />
	</search:forEachCategory>
</span>
