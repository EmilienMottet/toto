<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="width" name="width" />
<c:if test="${width != null}"><c:set var="width" value="width:${width}px;" /></c:if>

<widget:widget varUcssId="ucssId" varCssId="cssId" extraCss="highcharts multipleCharts" extraStyles="${width}">

	<widget:header>
		<config:getOption name="title" defaultValue=""/>
	</widget:header>

	<widget:content>
		<c:choose>
			<c:when test="${widget:hasSubWidgets(widget)}">
				<config:getOption var="height" name="height" />

                <div class="chart-wrapper" style="height: ${height}px;width:100%;">
                    <div class="chart-inner">
                        <div id="chart_${cssId}" class="highChartsSVGWrapper" style="height: ${height}px;width:100%;"></div>
                    </div>
                </div>

				<render:renderScript position="READY">
					var charts = [];
					<widget:forEachSubWidget>
						<render:template template="javascript.jsp" widget="${dataWidgetWrapper.widget.id}">
							<render:parameter name="chartContainerId" value="chart_${cssId}" />
						</render:template>
						charts.push({ opts: opts });
					</widget:forEachSubWidget>

					MultipleCharts.load({
						$chartContainer_ucssid: '${ucssId}',
						$widget: $("#chart_${cssId}").closest('.multipleCharts'),
						$chartContainer: $("#chart_${cssId}"),
						charts: charts
					});
				</render:renderScript>
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
	</widget:content>
</widget:widget>
