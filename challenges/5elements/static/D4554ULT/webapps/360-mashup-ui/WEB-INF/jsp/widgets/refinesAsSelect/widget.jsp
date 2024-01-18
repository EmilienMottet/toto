<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="refinesAsSelect">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<c:choose>
		<c:when test="${search:hasFeeds(feeds) == false}">
			<%-- If widget has no Feed --%>
			<widget:content>
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</widget:content>
			<%-- /If widget has no Feed --%>
		</c:when>

		<c:otherwise>

			<config:getOption var="baseUrl" name="facetPageName" defaultValue="" />
			<config:getOption var="showEmptyFacets" name="showEmptyFacets" defaultValue="false" />
			<config:getOption var="facetsList" name="facetsList" defaultValue="" />
			<config:getOption var="facetsListMode" name="facetsListMode" defaultValue="No filtering" />
			<config:getOption var="sortModeFacets" name="sortModeFacets" defaultValue="default" />
			<config:getOption name="filterNullAggregation" var="filterNullAggregation" defaultValue="false"/>
			<config:getOption name="defaultValue" var="defaultValue" defaultValue="0"/>

			<div class="facets">
				<%-- Retrieve all the Facets --%>
				<list:new var="facetsId" removeDuplicates="true"/>
				<search:forEachFacet var="facet" feeds="${feeds}" facetsList="${facetsList}" filterMode="${facetsListMode}" showEmptyFacets="${showEmptyFacets}" sortMode="${sortModeFacets}">
					<search:getFacetLabel var="facetLabel" facet="${facet}" />
					<list:add value="${facet.id}\#\#${facetLabel}" list="${facetsId}"/>
				</search:forEachFacet>
				<c:set var="noResults" value="${fn:length(facetsId) == 0}" />
				<%-- Retrieve all the Facets --%>

				<c:if test="${noResults == false}">

					<config:getOption var="sortMode" name="sortMode" defaultValue="default" />
					<config:getOption var="nbSubFacets" name="nbSubFacets" defaultValue="1000" />
					<config:getOption var="values" name="values" defaultValue="count" />
					<config:getOption var="displayFeed" name="displayFeed" defaultValue="true" />
					<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />

					<table class="data-table">
						<c:if test="${displayFeed == 'true'}">
							<%-- Header --%>
							<tr class="top">
								<th></th>
								<search:forEachFeed feeds="${feeds}" var="feed">
									<th><i18n:message code="feedName_${feed.id}" text="${feed.id}" /></th>
								</search:forEachFeed>
							</tr>
							<%-- /Header --%>
						</c:if>

						<%-- For Each Facet --%>
						<c:forEach var="facetId" items="${facetsId}" varStatus="varStatus">
							<string:split string="${facetId}" var="facetId" separator="##" />
							<tr class="${varStatus.index % 2 == 0 ? 'even' : 'odd'}">
								<td>${facetId[1]}</td>

								<%-- For Each Feed --%>
								<search:forEachFeed feeds="${feeds}" var="feed">
									<td class="select">
										<search:getFacet var="facet" facetId="${facetId[0]}" feed="${feed}" />
										<select class="decorate">
											<option value="">--</option>
											<search:forEachCategory aggregationToPreserve="${values}" filterNullAggregation="${filterNullAggregation}" var="cat" root="${facet}" sortMode="${sortMode}" iteration="${nbSubFacets}" iterationMode="ALL" varLevel="level">
												<search:getCategoryUrl var="categoryUrl" category="${cat}" feed="${feed}" baseUrl="${baseUrl}" forceRefineOn="${forceRefineOnFeeds}" />
												<option value="${categoryUrl}" <c:if test="${cat.state != 'DISPLAYED'}">selected="selected" refined="true"</c:if>>
													<c:forEach begin="1" end="${level}">&nbsp; </c:forEach>
													<search:getCategoryLabel category="${cat}"/>
													<search:getCategoryValueType var="type" category="${cat}" name="${values}" />
													
													<c:choose>
														<c:when test="${type == 'STRING'}">
															(<search:getCategoryValue category="${cat}" name="${values}" defaultValue="${defaultValue}" />)
														</c:when>
														<c:otherwise>
															(<search:getCategoryValue var="catValue" category="${cat}" name="${values}" defaultValue="" />
															<c:if test="${catValue == ''}">
																<c:out value="${defaultValue }"/>
															</c:if>
															<c:if test="${catValue != ''}">
																<string:formatNumber>
																	<search:getCategoryValue category="${cat}" name="${values}"
																	defaultValue="0" />
																</string:formatNumber>
															</c:if>)
														</c:otherwise>
													</c:choose>
												</option>
											</search:forEachCategory>
										</select>
									</td>
								</search:forEachFeed>
								<%-- /For Each Feed --%>
							</tr>
						</c:forEach>
						<%-- /For Each Facet --%>

					</table>
				</c:if>
			</div>

			<c:if test="${noResults}">
				<%-- If all feeds have no results --%>
				<widget:content>
					<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noResults.jsp" />
					<render:template template="${noResultsJspPathHit}">
						<render:parameter name="accessFeeds" value="${feeds}" />
						<render:parameter name="showSuggestion" value="true" />
					</render:template>
				</widget:content>
				<%-- /If all feeds have no results --%>
			</c:if>
		</c:otherwise>
	</c:choose>
</widget:widget>
