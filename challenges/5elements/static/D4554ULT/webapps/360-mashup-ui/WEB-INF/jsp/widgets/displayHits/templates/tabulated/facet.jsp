<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>

<render:import parameters="widget,accessFeeds,feed,entry,facet" />

<config:getOption var="baseUrl" name="hitFacetPageName" defaultValue="" feed="${feed}" entry="${entry}" />
<config:getOption var="iteration" name="nbSubFacets" defaultValue="0" />
<config:getOption var="sortMode" name="hitFacetSortStrategy" defaultValue="default" />
<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />

<table>
	<tr>
		<td class="facetContent facetName text-light cell-half">
			<search:getFacetLabel facet="${facet}" />
		</td>
		<td class="facetContent facetValue cell-half">
			<search:forEachCategory var="category" varLevel="level" varPreviousLevel="previousLevel" varStatus="status" root="${facet}" iterationMode="ALL" sortMode="${sortMode}" iteration="${iteration}">
				<c:if test="${!status.first}"><span class="refines-separator">${previousLevel < level ? '&gt;' : ','}</span></c:if>
				<render:categoryLink category="${category}" baseUrl="${baseUrl}" feeds="${accessFeeds}" forceRefineOn="${forceRefineOnFeeds}" />
			</search:forEachCategory>
		</td>
	</tr>
</table>