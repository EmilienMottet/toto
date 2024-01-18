<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>


<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="horizontalRefines">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content>
		<c:choose>
			<%-- If widget has no Feed --%>
			<c:when test="${search:hasFeeds(feeds) == false}">
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</c:when>
			<c:otherwise>
				<config:getOption var="facetsListMode" name="facetsListMode" defaultValue="No filtering" />
				<config:getOption var="facetsList" name="facetsList" defaultValue="" />
				<config:getOptions var="values" name="values" />
				<config:getOption var="showEmptyFacets" name="showEmptyFacets" defaultValue="false" />
				<config:getOption var="sortModeFacets" name="sortModeFacets" defaultValue="default" />
				<config:getOption name="filterNullAggregation" var="filterNullAggregation" defaultValue="false"/>	
				<config:getOption name="defaultValue" var="defaultValue" defaultValue="0"/>

				<string:join var="valuesToPreserve" list="${values}" separator=","  />

				<%-- Show refined Facets --%>
				<c:set var="noResults" value="true" />
				<search:forEachFacet
					var="facet" 
					varStatus="status"
					feeds="${feeds}"
					filterMode="${facetsListMode}"
					facetsList="${facetsList}"
					showEmptyFacets="${showEmptyFacets}"
					sortMode="${sortModeFacets}"
					filterNullAggregation="${filterNullAggregation}"
					aggregationToPreserve="${valuesToPreserve}">

					<c:remove var="noResults" />

					<c:if test="${status.first == true}">
						<ul class="refinesGroups med-padding">
					</c:if>

					<c:set var="refineFoundOnCategory" value="DISPLAYED" />
					
					<search:forEachCategory filterNullAggregation="${filterNullAggregation}" aggregationToPreserve="${valuesToPreserve}" root="${facet}" var="category" iterationMode="flat">
						<c:if test="${category.count > 0 && category.state == 'REFINED' || category.state == 'EXCLUDED'}">
							<c:set var="refineFoundOnCategory" value="${category.state}" />
						</c:if>
					</search:forEachCategory>

					<li class="refinesGroup ${refineFoundOnCategory}">
						<h3><search:getFacetLabel facet="${facet}" /></h3>
						<ul class="refinesGroup">
							<c:if test="${search:hasCategories(facet)}">
								<render:template template="subCategory.jsp">
									<render:parameter name="category" value="${facet}" />
								</render:template>
							</c:if>
						</ul>
					</li>

					<c:if test="${status.last == true}">
						</ul>
					</c:if>
				</search:forEachFacet>
				<%-- /Show refined Facets --%>

				<%-- If all feeds have no results --%>
				<c:if test="${noResults}">
					<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
					<render:template template="${noResultsJspPathHit}">
						<render:parameter name="accessFeeds" value="${feeds}" />
						<render:parameter name="showSuggestion" value="true" />
					</render:template>
				</c:if>
			</c:otherwise>
		</c:choose>
	</widget:content>
</widget:widget>
