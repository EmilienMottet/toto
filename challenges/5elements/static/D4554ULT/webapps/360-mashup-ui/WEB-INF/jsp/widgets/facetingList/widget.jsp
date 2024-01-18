<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import varWidget="widget" varFeeds="feeds"/>

<widget:widget varCssId="cssId" extraCss="facetingList" disableStyles="true">
	
	<widget:header>
   		<config:getOption name="title" defaultValue=""/>
	</widget:header>
	
	<c:choose>
		<c:when test="${search:hasFeeds(feeds) == false}">
			<%-- If widget has no Feed --%>
			<render:definition name="noFeeds">
				<render:parameter name="widget" value="${widget}" />
				<render:parameter name="showSuggestion" value="false" />
			</render:definition>
			<%-- /If widget has no Feed --%>
		</c:when>

		<c:otherwise>
			<config:getOption var="facetId" name="facetId"/>
			<search:getFacet var="facet" facetId="${facetId}" feeds="${feeds}"/>
			
			<c:choose>
				<c:when test="${facet != null}">
					<div class="exa-faceting-list">
						<config:getOption var="sortMode" name="sortMode" defaultValue="default"/>
						<config:getOption var="aggregation" name="aggregation" defaultValue="count"/> 				
						<config:getOption var="enablePagination" name="enablePagination" defaultValue="true"/>
						<config:getOption var="paginationSize" name="paginationSize" defaultValue="10"/>
						<config:getOption var="enableFiltering" name="enableFiltering" defaultValue="true"/>
						<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />	
						<config:getOption name="filterNullAggregation" var="filterNullAggregation" defaultValue="false"/>	
						<config:getOption name="defaultValue" var="defaultValue" defaultValue="0"/>
	
						<c:set var="isDisjunctive" value="${facet.refinementPolicy == 'DISJUNCTIVE' }"/>				
						<c:set var="displayAllCategories" value="false" />
						<h3><span class="collapsable"></span><search:getFacetLabel facet="${facet}"/></h3>
						<div id="${cssId}_content">
							<ul>
							<search:forEachCategory aggregationToPreserve="${aggregation}" filterNullAggregation="${filterNullAggregation}" root="${facet}" var="category" varLevel="depthLevel" iterationMode="ALL">
								<search:getCategoryState var="state" category="${category}"/>
								<c:choose>
									<c:when test="${state == 'REFINED'}">
										<search:getCategoryUrl var="cat_url" category="${category}" feeds="${feeds}" zapRefinements="${!isDisjunctive}" forceRefineOn="${forceRefineOnFeeds}" />			
										<search:getCategoryValueType var="type" category="${category}" name="${aggregation}" />
						
										<li class="exa-faceting-list-li exa-faceting-list-li-refined">
											
											<span class="exa-faceting-list-li-aggr">
												<c:choose>
													<c:when test="${type == 'STRING'}">
														<search:getCategoryValue category="${category}" name="${aggregation}" defaultValue="${defaultValue}" />
													</c:when>
													<c:otherwise>
														<search:getCategoryValue var="catValue" category="${category}" name="${aggregation}" defaultValue="" />
														<c:if test="${catValue == ''}">
															<c:out value="${defaultValue }"/>
														</c:if>
														<c:if test="${catValue != ''}">
															<string:formatNumber>
																<search:getCategoryValue category="${category}" name="${aggregation}"
																defaultValue="0" />
															</string:formatNumber>
														</c:if>
													</c:otherwise>
												</c:choose>
											</span>
											
											<c:choose>
												<c:when test="${cat_url != null}">
													<a class="exa-faceting-list-li-a" href="${cat_url}"><search:getCategoryLabel category="${category}" /></a>
												</c:when>
												<c:otherwise>
													<span class="exa-faceting-list-li-a"><search:getCategoryLabel category="${category}" /></span>
												</c:otherwise>
											</c:choose>
										</li>
									</c:when>
									<c:otherwise>
										<c:set var="displayAllCategories" value="true" />
									</c:otherwise>
								</c:choose>
								
							</search:forEachCategory>
							</ul>
						
							<c:if test="${displayAllCategories}">
								<div id="${cssId}_categories"></div>
								<render:renderScript position="READY">
									(function () {
										<c:set var="isFirst" value="true" />			
										var data = [
										<search:forEachCategory aggregationToPreserve="${aggregation}" filterNullAggregation="${filterNullAggregation}" root="${facet}" var="category" iterationMode="FLAT" sortMode="${sortMode}" varStatus="status">
											<search:getCategoryState var="state" category="${category}"/>
											<c:if test="${!status.first}">,</c:if>
											<render:template template="subCategories.jsp">
												<render:parameter name="category" value="${category}" />
												<render:parameter name="aggregation" value="${aggregation}" />
												<render:parameter name="feeds" value="${feeds}" />
												<render:parameter name="isDisjunctive" value="${isDisjunctive}" />
												<render:parameter name="forceRefineOnFeeds" value="${forceRefineOnFeeds}" />
												<render:parameter name="sortMode" value="${sortMode}" />
												<render:parameter name="filterNullAggregation" value="${filterNullAggregation}" />
												<render:parameter name="defaultValue" value="${defaultValue}" />
											</render:template>
										</search:forEachCategory>
										];
										
										var list = new FacetingList(data, {
											enablePagination:${enablePagination},
											paginationSize: ${paginationSize},
											enableFiltering:${enableFiltering}
										});
										list.render(document.getElementById('${cssId}_categories'));
										
										
									})();
								
								</render:renderScript>
							</c:if>
						</div>	
						<render:renderScript position="READY">
							$('#${cssId} h3').bind('click', function () {
								$(this).find('.collapsable').toggleClass('collapsed');
								$('#${cssId}_content').toggle();
							});
						</render:renderScript>
					</div>
				</c:when>
				<c:otherwise>
					<%-- If all feeds have no results --%>
					<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
					<render:template template="${noResultsJspPathHit}">
						<render:parameter name="accessFeeds" value="${feeds}" />
						<render:parameter name="showSuggestion" value="true" />
					</render:template>
					<%-- /If all feeds have no results --%>
				</c:otherwise>
			</c:choose>
		</c:otherwise>		
	</c:choose>
</widget:widget>
