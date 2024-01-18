<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config"%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search"%>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="baseUrl" name="baseUrl" />
<config:getOption var="facetId" name="facetId" />
<config:getOption var="showLink" name="showLink" defaultValue="false" />
<config:getOption var="separator" name="separator" defaultValue="&gt;" />
<config:getOptions var="forceRefineOn" name="forceRefineOnFeeds" />

<search:getFacet var="facet" facetId="${facetId}" feeds="${feeds}" />

<widget:widget extraCss="breadcrumbs">
	<c:if test="${facet != null}">
		<widget:header htmlTag="div" extraCss="rounded">
			<h3><search:getFacetLabel facet="${facet}" /></h3> <span class="separator">${separator}</span>
			<ul class="breadcrumbs">
				<search:forEachCategory var="category" varStatus="status" root="${facet}" showState="REFINED" iterationMode="ALL">
					<li>
						<c:if test="${showLink}">
							<search:getCategoryUrl var="categoryUrl" category="${category}" baseUrl="${baseUrl}" forceRefineOn="${forceRefineOn}" feeds="${feeds}"/>
						</c:if>
						<render:link href="${categoryUrl}"><search:getCategoryLabel category="${category}" /></render:link>
						<c:if test="${status.last == false}"><span class="separator">${separator}</span></c:if>
					</li>
				</search:forEachCategory>
			</ul>
		</widget:header>
	</c:if>
</widget:widget>
