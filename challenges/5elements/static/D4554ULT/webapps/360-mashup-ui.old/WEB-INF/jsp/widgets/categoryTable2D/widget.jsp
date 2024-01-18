<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n"%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search"%>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config"%>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string"%>
<%@ taglib prefix="dev" uri="http://www.exalead.com/jspapi/dev"%>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list"%>
<%@ taglib prefix="data" uri="http://www.exalead.com/jspapi/data"%>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="categoryTable2D">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<c:choose>

		<%-- If widget has no Feed --%>
		<c:when test="${search:hasFeeds(feeds) == false}">
			<widget:content>
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</widget:content>
		</c:when>
		<c:otherwise>
			<config:getOption var="facetId" name="facetsList" />
			<config:getOption var="facetType" name="facetType" defaultValue="multi_dimension" />
			<config:getOptionsComposite var="aggregations" name="displayModes" />
			<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />
			<config:getOption var="showSummaries" name="showSummaries" defaultValue="true" />
			
			<c:choose>
				<c:when test="${facetType == 'legacy_2d' }">
					<data:legacy2D var="mainDataSource" feeds="${feeds}" facet="${facetId}"/>
				</c:when>
				<c:otherwise>
					<data:matrix var="mainDataSource" feeds="${feeds}" facet="${facetId}" />
				</c:otherwise>
			</c:choose>
			<c:choose>
				<c:when test="${mainDataSource == null || fn:length(mainDataSource.dimensionList) != 2}">
					<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
					<widget:content>
						<render:template template="${noResultsJspPathHit}">
							<render:parameter name="accessFeeds" value="${feeds}" />
							<render:parameter name="showSuggestion" value="true" />
						</render:template>
					</widget:content>
				</c:when>
				<c:otherwise>
					<c:set var="facetType" value="${fn:toLowerCase(mainDataSource.facetType)}"/>
					<data:categoryList var="vCategoryList" data="${mainDataSource}" facetId="${mainDataSource.dimensionList[1]}" />
					<data:categoryList var="hCategoryList" data="${mainDataSource}" facetId="${mainDataSource.dimensionList[0]}" />
		
					<config:getOption var="baseUrl" name="facetPageName" defaultValue="" />
		
					<table class="data-table">
						<tr class="top">
							<th></th>
							<c:forEach var="cat" items="${hCategoryList}">
								<th colspan="${fn:length(aggregations)}">
									<search:getCategoryUrl var="categoryUrl" varClassName="className" baseUrl="${baseUrl}" category="${cat}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
									<render:link href="${categoryUrl}" extraCss="${className}">
										<search:getCategoryLabel category="${cat}" />
									</render:link>
								</th>
							</c:forEach>
							<c:if test="${showSummaries}">
								<th class="summary" colspan="${fn:length(aggregations)}"><i18n:message code="total" /></th>
							</c:if>
						</tr>
						<c:if test="${fn:length(aggregations) > 1}">
							<tr class="top">
								<th></th>
								<c:forEach var="hCat" items="${hCategoryList}">
									<c:forEach var="agg" items="${aggregations}">
										<th>${agg[1]}</th>
									</c:forEach>
								</c:forEach>
								<c:if test="${showSummaries}">
									<c:forEach var="agg" items="${aggregations}">
										<th>${agg[1]}</th>
									</c:forEach>
								</c:if>
							</tr>
						</c:if>
						<c:forEach varStatus="varStatus" var="vCat" items="${vCategoryList}">
							<tr class="${varStatus.index % 2 == 0 ? 'even' : 'odd'}">
								<td class="description key">
									<search:getCategoryUrl var="categoryUrl" varClassName="className" baseUrl="${baseUrl}" category="${vCat}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" /> 
									<render:link href="${categoryUrl}" extraCss="${className}">
										<search:getCategoryLabel category="${vCat}" />
									</render:link>
								</td>
								<list:new var="catList" />
								<c:forEach var="hCat" items="${hCategoryList}">
									<list:clear list="${catList}" />
									<list:add value="${vCat}" list="${catList}" />
									<list:add value="${hCat}" list="${catList}" />
									
									<c:set var="categoriesUrl"></c:set>
									<c:if test="${facetType == 'multi_dimension'}">
										<search:getCategoryUrl var="categoriesUrl" varClassName="className" baseUrl="${baseUrl}" categories="${catList}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
									</c:if>
									<c:forEach var="agg" items="${aggregations}">
										<td>
											<data:getValue var="val" categories="${catList}" aggregation="${agg[0]}" data="${mainDataSource}" />
											<data:getValueType var="type" categories="${catList}" aggregation="${agg[0]}" data="${mainDataSource}" />
											<c:choose>
												<c:when test="${val != null }">
													<c:if test="${agg[0] == 'count' && val == 0}">
														<c:set var="categoriesUrl"></c:set>
													</c:if>
													<render:link href="${categoriesUrl}" extraCss="${className}">
														<c:choose>
															<c:when test="${type == 'STRING'}">
																${val}
															</c:when>
															<c:otherwise>
																<string:formatNumber>${val}</string:formatNumber>
															</c:otherwise>
														</c:choose>
													</render:link>
												</c:when>
												<c:otherwise>
													<i18n:message code="notavailable" />
												</c:otherwise>
											</c:choose></td>
									</c:forEach>
								</c:forEach>
								<%-- Right summary --%>
								<c:if test="${showSummaries == 'true'}">
									<c:forEach var="agg" items="${aggregations}">
										<td class="summary">
											<search:getCategoryValueType var="type" category="${vCat}" name="${agg[0]}" />
											<c:choose>
												<c:when test="${type == 'STRING'}">
													<search:getCategoryValue category="${vCat}" name="${agg[0]}" />
												</c:when>
												<c:otherwise>
													<string:formatNumber>
														<search:getCategoryValue category="${vCat}" name="${agg[0]}"
															defaultValue="0" />
													</string:formatNumber>
												</c:otherwise>
											</c:choose>
										</td>
									</c:forEach>
								</c:if>
								<%-- /Right summary --%>
							</tr>
						</c:forEach>
						<%-- /Iterate over vertical categories --%>

						<c:if test="${showSummaries}">
							<tr>
								<td class="summary"><i18n:message code="total" /></td>
								<c:forEach var="hCat" items="${hCategoryList}">
									<c:forEach var="agg" items="${aggregations}">
										<td class="summary">
											<search:getCategoryValueType var="type" category="${hCat}" name="${agg[0]}" />
											<c:choose>
												<c:when test="${type == 'STRING'}">
													<search:getCategoryValue category="${hCat}" name="${agg[0]}" />
												</c:when>
												<c:otherwise>
													<string:formatNumber>
														<search:getCategoryValue category="${hCat}" name="${agg[0]}"
															defaultValue="0" />
													</string:formatNumber>
												</c:otherwise>
											</c:choose>
										</td>
									</c:forEach>
								</c:forEach>
								<search:getFacet var="facet" facetId="${facetId}" feeds="${feeds}" />
								<c:forEach var="aggregation" items="${aggregations}">
									<td class="summary">
										<search:getFacetValue var="facetValue" name="${aggregation[0]}" facet="${facet}" defaultValue="9223372036854775807" />
										<search:getFacetValueType var="type" name="${aggregation[0]}" facet="${facet}" />
										<c:choose>
											<c:when test="${facetValue != 9223372036854775807}">
												<c:choose>
													<c:when test="${type == 'STRING'}">
														${facetValue}
													</c:when>
													<c:otherwise>
														<string:formatNumber>${facetValue}</string:formatNumber>
													</c:otherwise>
												</c:choose>
											</c:when>
											<c:otherwise>&nbsp;</c:otherwise>
										</c:choose>
									</td>
								</c:forEach>
							</tr>
						</c:if>
						
						<%-- /refinements --%>
						
						<data:getRefines var="horizontalRefinedCategories" data="${mainDataSource}" dimension="${mainDataSource.dimensionList[0]}"/>
						<data:getRefines var="verticalRefinedCategories" data="${mainDataSource}" dimension="${mainDataSource.dimensionList[1]}"/>						
						
						<c:set var="lastLevelHorizontalRefined" value="false" />
						<c:if test="${fn:length(horizontalRefinedCategories) == 1}">
							<c:forEach var="horizontalCategory" items="${hCategoryList}">
								<search:getCategoryState varClassName="hState" category="${horizontalCategory}" />
								<c:set var="lastLevelHorizontalRefined" value="${ hState == 'refined' }" />
							</c:forEach>
						</c:if>
						<c:set var="lastLevelVerticalRefined" value="false" />
						<c:if test="${fn:length(verticalRefinedCategories) == 1}">
							<c:forEach var="verticalCategory" items="${vCategoryList}">
								<search:getCategoryState varClassName="vState" category="${verticalCategory}" />
								<c:set var="lastLevelVerticalRefined" value="${ vState == 'refined' }" />
							</c:forEach>
						</c:if>
						
						<c:set var="nbColumns">${fn:length(aggregations) * fn:length(hCategoryList) }</c:set>
						<c:if test="${showSummaries}">
							<c:set var="nbColumns" value="${nbColumns + fn:length(aggregations)}" />
						</c:if>
						<c:if test="${fn:length(verticalRefinedCategories) > 0 && !lastLevelVerticalRefined}">
							<tr class="horizontalRefinements">
								<td class="horizontalRefinements"><i18n:message code="verticalRefinedCategories" /></td>
								<td colspan="${nbColumns}">
									<c:forEach var="verticalRefine" items="${verticalRefinedCategories}">
										<search:getCategoryState varClassName="className" category="${verticalRefine}" />
										<search:getCategoryUrl var="categoryUrl" baseUrl="${baseUrl}" category="${verticalRefine}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
										<render:link href="${categoryUrl}" extraCss="${className}">
											<search:getCategoryLabel category="${verticalRefine}" />
										</render:link> &nbsp; 
									</c:forEach>
								</td>
							</tr>
						</c:if>
						<c:if test="${fn:length(horizontalRefinedCategories) > 0 && !lastLevelHorizontalRefined}">
							<tr class="horizontalRefinements">
								<td class="horizontalRefinements"><i18n:message code="horizontalRefinedCategories" /></td>
								<td colspan="${nbColumns}">
									<c:forEach var="horizontalRefine" items="${horizontalRefinedCategories}">
										<search:getCategoryState varClassName="className" category="${horizontalRefine}" />
										<search:getCategoryUrl var="categoryUrl" baseUrl="${baseUrl}" category="${horizontalRefine}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
										<render:link href="${categoryUrl}" extraCss="${className}">
											<search:getCategoryLabel category="${horizontalRefine}" />
										</render:link> &nbsp; 
									</c:forEach>
								</td>
							</tr>
						</c:if>
						<%-- /refinements --%>
					</table>
				</c:otherwise>
			</c:choose>
		</c:otherwise>
	</c:choose>
</widget:widget>