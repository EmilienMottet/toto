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

<widget:widget extraCss="dataTableInverted">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<c:choose>

		<%-- If widget has no Feed --%>
		<c:when test="${search:hasFeeds(feeds) == false}">
			<widget:content>
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="true" />
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
			<config:getOptionsComposite var="rows" name="rows" />

			<%-- calculate total values for each category --%>
			<map:new var="total" />
			<c:forEach var="row" items="${rows}">
				<c:if test="${map:containsKey(total, row[0]) == false}">
					<search:getCategoryValue var="value" name="${row[0]}" parentCategory="${facet}" iterationMode="${iterMode}" defaultValue="0" />
					<map:put map="${total}" key="${row[0]}" value="${value}" />
				</c:if>
			</c:forEach>

			<%-- Render Table HTML --%>
			<table class="table-striped table-grid table-hover data-table">
				<thead>
					<tr class="top">
						<c:if test="${displayTitle}">
							<th><config:getOption name="nameDescription" defaultValue="" /></th>
						</c:if>
						<search:forEachCategory var="subCategory" root="${facet}" sortMode="${sortMode}" iterationMode="${iterMode}">
							<search:getCategoryState varClassName="className" category="${subCategory}" />
							<search:getCategoryUrl var="categoryUrl" baseUrl="${baseUrl}" forceRefineOn="${forceRefineOn}" category="${subCategory}" feeds="${feeds}" />
							<th class="${className} facet">
								<render:link href="${categoryUrl}" extraCss="${className}">
									<search:getCategoryLabel category="${subCategory}" />
								</render:link>
							</th>
						</search:forEachCategory>
						<c:if test="${displayTotal}">
							<th><config:getOption name="totalDescription" defaultValue="Total" /></th>
						</c:if>
					</tr>
				</thead>
				<tbody>
					<c:forEach var="row" items="${rows}" varStatus="loopStatus">
						<tr class="hover ${loopStatus.index%2==0?'odd':'even'}">
							<c:if test="${displayTitle}">
								<th><string:eval string="${row[1]}" /></th>
							</c:if>
							<search:forEachCategory var="subCategory" root="${facet}" sortMode="${sortMode}" iterationMode="${iterMode}">
								<td>
									<c:choose>
										<c:when test="${row[2] == 'false'}">
											<search:getCategoryValueType var="type" category="${subCategory}" name="${row[0]}" />
											<c:choose>
												<c:when test="${type == 'STRING'}">
													<search:getCategoryValue category="${subCategory}" name="${row[0]}" />
												</c:when>
												<c:otherwise>
													<string:formatNumber>
														<search:getCategoryValue category="${subCategory}" name="${row[0]}"
															defaultValue="0" />
													</string:formatNumber>
												</c:otherwise>
											</c:choose>
										</c:when>
										<c:when test="${total[row[0]] > 0}">
											<search:getCategoryValueType var="type" category="${subCategory}" name="${row[0]}" />
											<c:choose>
												<c:when test="${type == 'STRING'}">
													<search:getCategoryValue category="${subCategory}" name="${row[0]}" />
												</c:when>
												<c:otherwise>
													<string:formatNumber percentageOf="${total[row[0]]}">
														<search:getCategoryValue category="${subCategory}" name="${row[0]}"
															defaultValue="0" />
													</string:formatNumber>
												</c:otherwise>
											</c:choose>										
										</c:when>
										<c:otherwise>0</c:otherwise>
									</c:choose>
								</td>
							</search:forEachCategory>
							<c:if test="${displayTotal}">
								<td>
									<c:choose>
										<c:when test="${row[2] == 'false'}"><string:formatNumber>${total[row[0]]}</string:formatNumber></c:when>
										<c:when test="${total[row[0]] > 0}">100.0</c:when>
										<c:otherwise>0</c:otherwise>
									</c:choose>
								</td>
							</c:if>
						</tr>
					</c:forEach>
				</tbody>
			</table>
		</c:otherwise>
	</c:choose>
</widget:widget>
