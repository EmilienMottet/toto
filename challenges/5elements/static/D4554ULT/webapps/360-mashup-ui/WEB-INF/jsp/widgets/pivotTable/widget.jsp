<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="multidim" uri="http://www.exalead.com/jspapi/widget-pivottable" %>

<render:import varWidget="widget" varFeeds="feeds" />
<widget:widget extraCss="pivotTable" varCssId="ucssId">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<config:getOptionsComposite var="columns" name="columns" />
	<config:getOption var="enableColumnDrillDown" name="enableColumnDrillDown" />
	<config:getOptionsComposite var="rows" name="rows" />
	<config:getOption var="rowPrecomputeUntil" name="rowPrecomputeUntil" />
	<config:getOption var="rowsLegend" name="rowsLegend" />
	<config:getOptionsComposite var="aggregations" name="aggregations" />
	<config:getOption var="query" name="query" />
	
	<config:getOption var="sapiCommand" name="command" />
	<config:getOption var="sapiConfig" name="apiConfig" />
	<config:getOption var="sapiUrl" name="searchApi" />
	<config:getOption var="sapiLogic" name="searchLogic" />
	<config:getOptionsComposite var="sapiParameters" name="extraParameters" />
	
	<multidim:getSearchParameters var="searchParameters" command="${sapiCommand}"
		apiConfig="${sapiConfig}" searchLogic="${sapiLogic}"
		searchAPI="${sapiUrl}" extraParameters="${sapiParameters}" />
	<multidim:getMultidimAnswer var="multidimAnswer" query="${query}"
		columns="${columns}" rows="${rows}" rowsLimit="${rowPrecomputeUntil}" rowsLegend="${rowsLegend}"
		aggregations="${aggregations}" resultFeeds="${feeds}"
		baseUrl="${baseUrl}" searchParameters="${searchParameters}" />

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

		<c:when test="${multidimAnswer == null}">
			<%-- If all feeds have no results --%>
			<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
			<widget:content>
				<render:template template="${noResultsJspPathHit}">
					<render:parameter name="accessFeeds" value="${feeds}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:template>
			</widget:content>
			<%-- /If all feeds have no results --%>
		</c:when>

		<c:otherwise>
			<multidim:getAdditionalRows var="additionalRows" rows="${rows}" rowsLimit="${rowPrecomputeUntil}" />

			<%-- Render Table HTML --%>
			<div class="table-wrapper">
				<div class="table-scroll">
					<table class="table-striped table-grid table-hover data-table" id="multidim-table">
						<thead>
							<multidim:forEachColumnDimension var="columnDimension" answer="${multidimAnswer}">
								<tr class="hover">
									<multidim:getDimensionLegend var="columnDimensionLegend" dimensionResponse="${columnDimension}" />
									<th>
										<string:eval string="${columnDimensionLegend}" />
									</th>
									<multidim:forEachDimensionCategories var="columnDimensionCategory" answer="${multidimAnswer}" dimensionResponse="${columnDimension}" resultFeeds="${feeds}" baseUrl="${baseUrl}">
										<c:forEach var="i" begin="1" end="${columnDimensionCategory['nbSpaces']}" step="1">
											<th class="space-header">
											</th>
										</c:forEach>
										<th colSpan="${columnDimensionCategory['colSpan']}" class="category-header">
											<c:if test="${enableColumnDrillDown and columnDimensionCategory['isLastLevel'] == null}">
												<span class="less" onclick="javascript:MultidimView.toggleColumn($(this), ${columnDimensionCategory['dimensionIndex']}, ${columnDimensionCategory['startIndex']}, ${columnDimensionCategory['nbLeaves']})">&nbsp;&nbsp;&nbsp;&nbsp;</span>
											</c:if>
											
		 									<render:link href="${columnDimensionCategory['url']}" extraCss="">
												<string:eval string="${columnDimensionCategory['title']}" />
											</render:link>
										</th>
									</multidim:forEachDimensionCategories>
								</tr>
							</multidim:forEachColumnDimension>
							<tr>
								<multidim:getRowsLegend var="rowsLegend" answer="${multidimAnswer}" />
								<th>
									<string:eval string="${rowsLegend}" />
								</th>
								<multidim:forEachCellInMeasureLine var="measureHeader" answer="${multidimAnswer}">
									<c:choose>
										<c:when test="${measureHeader['isSpace']}">
											<th class="measure-header space-header">
												<string:eval string="${measureHeader['legend']}" />
											</th>
										</c:when>
										<c:otherwise>
											<th class="measure-header">
												<string:eval string="${measureHeader['legend']}" />
											</th>
										</c:otherwise>
									</c:choose>
								</multidim:forEachCellInMeasureLine>
							</tr>
						</thead>
						<tbody>
							<multidim:forEachBodyLine var="rowView" answer="${multidimAnswer}">
								<multidim:getLineHeader var="lineHeader" rowView="${rowView}" answer="${multidimAnswer}" additionalRows="${additionalRows}" />
								<tr class="hover">
									<th class="row-header-${lineHeader['dimension']}">
										<c:choose>
											<c:when test="${lineHeader['hasAdditionalRefines'] == 'true'}">
												<span class="more refine">&nbsp;&nbsp;&nbsp;&nbsp;</span>
											</c:when>								
											<c:when test="${lineHeader['isLastDimension'] == 'true'}">
												<span class="neutral">&nbsp;&nbsp;&nbsp;&nbsp;</span>
											</c:when>
											<c:otherwise>
												<span class="less">&nbsp;&nbsp;&nbsp;&nbsp;</span>
											</c:otherwise>
										</c:choose>
										
										<multidim:getRowHeaderViewUrl var="rowUrl" rowView="${rowView}" answer="${multidimAnswer}" baseUrl="${baseUrl}" resultFeeds="${feeds}" />
										<render:link href="${rowUrl}" extraCss="">
											<string:eval string="${lineHeader['title']}" />
										</render:link>
									</th>
									<multidim:forEachCellInLine var="cell" rowView="${rowView}" answer="${multidimAnswer}">
										<multidim:isCellSpace var="isCellSpace" cell="${cell}" />
										<multidim:getCellValue var="cellValue" cell="${cell}" />
										<multidim:getCellUrl var="cellUrl" cell="${cell}" answer="${multidimAnswer}" baseUrl="${baseUrl}" resultFeeds="${feeds}" />
										<c:choose>
											<c:when test="${isCellSpace}">
												<td class="space-cell">
													<render:link href="${cellUrl}" extraCss="">
														<string:eval string="${cellValue}" />
													</render:link>
												</td>
											</c:when>
											<c:otherwise>
												<td class="leaf-cell">
													<render:link href="${cellUrl}" extraCss="">
														<string:eval string="${cellValue}" />
													</render:link>
												</td>
											</c:otherwise>
										</c:choose>
									</multidim:forEachCellInLine>
								</tr>
							</multidim:forEachBodyLine>
						</tbody>
					</table>
				</div>
			</div>

			<render:renderScript>
				<multidim:getMultidimAnswerJson var="multidimAnswerJson" answer="${multidimAnswer}" />
				<multidim:getAdditionalRowsJson var="additionalRowsJson" additionalRows="${additionalRows}" />
				(function () {
					var model = MultidimModel.getInstance();
					model.setData(<string:eval string="${multidimAnswerJson}" />);
					model.setAdditionalRows(<string:eval string="${additionalRowsJson}" />);
					var controller = MultidimController.getInstance();
					controller.init("${feedName}", "${widget.wuid}", "<c:url value="/" />");
					var view = MultidimView.getInstance();
					view.init("${ucssId}", "<c:url value="/" />");
					model.initializeRows();
					controller.createRowClickHandlers();
				}());
			</render:renderScript>
		</c:otherwise>
	</c:choose>
</widget:widget>
