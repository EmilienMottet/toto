<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>

<render:import varFeeds="feeds" parameters="feed,entry,facet" />

<config:getOption var="sortMode" name="hitFacetSortStrategy" defaultValue="default" feed="${feed}" entry="${entry}" />
<config:getOption var="baseUrl" name="hitFacetPageName" defaultValue="" feed="${feed}" entry="${entry}" />

<search:forEachCategory var="category" root="${facet}" varStatus="status" iterationMode="all" sortMode="${sortMode}" varLevel="level" varPreviousLevel="previousLevel">
	<c:if test="${!status.first}"><span class="refines-separator">${previousCategoryLevel < level ? '&gt;' : ','}</span></c:if>

	<url:resource var="flagUrl" file="/resources/images/flags/${fn:toLowerCase(category.description)}.png" testIfExists="true" />
	<c:if test="${flagUrl != null}">
		<img class="flag" src="${flagUrl}" />
	</c:if>

	<render:categoryLink category="${category}" baseUrl="${baseUrl}" feeds="${feeds}" />
</search:forEachCategory>
