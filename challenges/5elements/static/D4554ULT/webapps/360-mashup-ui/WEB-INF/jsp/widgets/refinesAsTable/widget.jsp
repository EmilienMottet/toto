<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="map" uri="http://www.exalead.com/jspapi/map" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="facetName" name="facetName" defaultValue="" />
<search:getFacet var="facet" feeds="${feeds}" facetId="${facetName}" />

<widget:widget extraCss="refinesAsTable">

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

		<%-- If facet is not present in response --%>
		<c:when test="${facet == null}">
			<widget:content>
				<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
				<render:template template="${noResultsJspPathHit}">
					<render:parameter name="accessFeeds" value="${feeds}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:template>
			</widget:content>
		</c:when>

		<%-- Display data table --%>
		<c:otherwise>

			<config:getOption var="baseUrl" name="facetPageName" defaultValue="" />
			<config:getOption var="displayTitle" name="displayTitle" defaultValue="true" />
			<config:getOption var="displayTotal" name="displayTotal" defaultValue="true" />
			<config:getOption var="sortMode" name="sortMode" defaultValue="default" />
			<config:getOption var="iterMode" name="iterMode" />
			<config:getOptions var="forceRefineOn" name="forceRefineOnFeeds" />
			<config:getOptionsComposite var="columns" name="columns" />

			<%-- calculate total values for each category --%>
			<map:new var="total" />
			<c:forEach var="column" items="${columns}">
				<c:if test="${map:containsKey(total, column[0]) == false}">
					<search:getCategoryValue var="value" name="${column[0]}" parentCategory="${facet}" iterationMode="${iterMode}" defaultValue="0" />
					<map:put map="${total}" key="${column[0]}" value="${value}" />
				</c:if>
			</c:forEach>

			<%-- Render Table HTML --%>
			<table class="table-striped table-grid table-hover data-table">
				<tbody>
					<%-- Display titles --%>
					<c:if test="${displayTitle == 'true'}">
						<tr class="top">
							<th class="description">
								<config:getOption name="nameDescription" defaultValue="Description" />
							</th>
							<c:forEach var="column" items="${columns}">
								<th class="${column[0]}${column[2]=='true'?'_percent':''}">
									<string:eval string="${column[1]}" />
								</th>
							</c:forEach>
						</tr>
					</c:if>

					<%-- Display rows --%>
					<search:forEachCategory root="${facet}" var="subCategory" sortMode="${sortMode}" iterationMode="${iterMode}" varStatus="varStatus">
						<tr class="hover hit ${varStatus.index % 2 == 0 ? 'even' : 'odd'} ${className}">
							<td class="description">
								<render:categoryLink category="${subCategory}" baseUrl="${baseUrl}" forceRefineOn="${forceRefineOn}" feeds="${feeds}" />
							</td>
							<c:forEach var="column" items="${columns}">
								<search:getCategoryValue var="categoryValue" category="${subCategory}" name="${column[0]}" defaultValue="0" />
								<td class="${column[0]}${column[2]=='true'?'_percent':''}">
									<search:getCategoryValueType var="type" category="${subCategory}" name="${column[0]}" />
									<c:choose>
										<c:when test="${type == 'STRING'}">
											${categoryValue}
										</c:when>
										<c:otherwise>
											<c:choose>
												<c:when test="${column[2] == 'false'}">
													<string:formatNumber>${categoryValue}</string:formatNumber>
												</c:when>
												<c:when test="${total[column[0]] > 0}">
													<string:formatNumber percentageOf="${total[column[0]]}">${categoryValue}</string:formatNumber>
												</c:when>
												<c:otherwise>
													0
												</c:otherwise>
											</c:choose>
										</c:otherwise>
									</c:choose>
								</td>
							</c:forEach>
						</tr>
					</search:forEachCategory>

					<%-- Display totals --%>
					<c:if test="${displayTotal == 'true'}">
						<tr class="bottom">
							<th class="description">
								<config:getOption name="totalDescription" defaultValue="Total" />
							</th>
							<c:forEach var="column" items="${columns}">
								<td class="${column[0]}${column[2]=='true'?'_percent':''}">
									<c:choose>
										<c:when test="${column[2] == 'false'}">
											<string:formatNumber>${total[column[0]]}</string:formatNumber>
										</c:when>
										<c:when test="${total[column[0]] > 0}">
											100.00
										</c:when>
										<c:otherwise>
											0
										</c:otherwise>
									</c:choose>
								</td>
							</c:forEach>
						</tr>
					</c:if>
				</tbody>
			</table>
		</c:otherwise>
	</c:choose>
</widget:widget>
